"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import Loader from "@/components/Loader";
import MainLayout from "@/components/mainLayout";
import { useActiveTab } from "@/hooks/useActiveTab";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useUserProfile } from "@/hooks/useUserProfile";

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

  /**
   * 🔐 AUTH + PROFILE GUARD
   */
  useEffect(() => {
    if (authLoading || profileLoading) return;

    // ❌ Not logged in → Login
    if (!user) {
      router.replace("/login");
      return;
    }

    // ❌ Logged in but profile missing → Onboarding
    if (!profile) {
      router.replace("/user-onboarding");
      return;
    }
  }, [user, profile, authLoading, profileLoading, router]);

  /**
   * ⏳ Loading / Redirect State
   */
  if (authLoading || profileLoading) {
    return <Loader message="Loading..." />;
  }

  if (!user) {
    return <Loader message="Redirecting to login..." />;
  }

  if (!profile) {
    return <Loader message="Redirecting to profile setup..." />;
  }

  /**
   * 🔄 Profile Update Handler
   */
  const handleProfileUpdate = async (updated: Partial<UserProfile>) => {
    if (!user.uid) return;

    try {
      await updateDoc(doc(db, "users", user.uid), updated);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleSelectMatch = () => setActiveTab("messages");

  /**
   * 📦 Tabs
   */
  const tabs: Record<string, React.ReactNode> = {
    messages: <MessagePage user={user} />,
    discovery: <DiscoveryPage user={user} onSelectMatch={handleSelectMatch} />,
    matches: <MatchesPage user={user} onSelectMatch={handleSelectMatch} />,
    profile: (
      <ProfilePage
        profile={profile}
        onUpdate={handleProfileUpdate}
        isOwnProfile
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
      {tabs[activeTab]}
    </MainLayout>
  );
}

export default Home;
