"use client";
import React from "react";

import Loader from "@/components/Loader";
import MainLayout from "@/components/mainLayout";
import { useActiveTab } from "@/hooks/useActiveTab";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import MessagePage from "./message/page";
import DiscoveryPage from "./discovery/page";
import MatchesPage from "./matches/page";
import ProfilePage from "./profile/page";

import { UserProfile } from "@/lib/types";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

function Home() {
  const router = useRouter();

  const { user, loading: authLoading } = useFirebaseAuth();
  const { profile, loading: profileLoading } = useUserProfile(user?.uid);

  const [activeTab, setActiveTab] = useActiveTab("activeTab", "discovery");

  // Auth + Profile Guard
  useEffect(() => {
    if (authLoading || profileLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    // Agar user hai lekin profile document nahi exist karta → onboarding pe bhejo
    if (user && !profile) {
      router.replace("/user-onboarding");
      return;
    }
  }, [user, profile, authLoading, profileLoading, router]);

  const handleSelectMatch = () => setActiveTab("messages");

  // Loading / Redirect State
  if (authLoading || profileLoading || !user || !profile) {
    const message = !user
      ? "Redirecting to login..."
      : !profile
      ? "Redirecting to profile setup..."
      : "Loading your profile...";

    return <Loader message={message} />;
  }

  // Profile Update Handler – Direct Firestore Update (No local onboarding state)
  const handleProfileUpdate = async (updated: Partial<UserProfile>) => {
    if (!user?.uid) return;

    const userRef = doc(db, "users", user.uid); // Fixed: "users" collection

    try {
      await updateDoc(userRef, updated);
    } catch (error) {
      console.error("Error updating user profile:", error);
      // You can add toast notification here if needed
    }
  };

  // Tabs Content
  const tabs: Record<string, React.ReactNode> = {
    messages: <MessagePage user={user} />,
    discovery: <DiscoveryPage user={user} onSelectMatch={handleSelectMatch} />,
    matches: <MatchesPage user={user} onSelectMatch={handleSelectMatch} />,
    profile: (
      <ProfilePage
        profile={profile}
        onUpdate={handleProfileUpdate}
        isOwnProfile={true}
      />
    ),
  };

  return (
    <MainLayout
      user={user}
      profile={profile}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {tabs[activeTab] || null}
    </MainLayout>
  );
}

export default Home;
