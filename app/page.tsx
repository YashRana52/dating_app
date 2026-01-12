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
   * 🔐 AUTH + PROFILE GUARD (ONLY PLACE FOR REDIRECT)
   */
  useEffect(() => {
    if (authLoading || profileLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user && !profile) {
      router.replace("/user-onboarding");
    }
  }, [user, profile, authLoading, profileLoading, router]);

  /**
   * ⏳ Loading state
   */
  if (authLoading || profileLoading) {
    return <Loader message="Loading..." />;
  }

  /**
   * 🚫 While redirecting (VERY IMPORTANT)
   */
  if (!user || !profile) {
    return null;
  }

  /**
   * 🔄 Profile Update
   */
  const handleProfileUpdate = async (updated: Partial<UserProfile>) => {
    try {
      await updateDoc(doc(db, "users", user.uid), updated);
    } catch (err) {
      console.error("Profile update error:", err);
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
