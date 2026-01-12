import { UserProfile } from "@/lib/types";
import { User } from "firebase/auth";
import React, { useEffect } from "react";
import ResponsiveNavigation from "./ResponsiveNavigation";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { app, db } from "@/lib/firebase";
import {
  getDatabase,
  ref,
  onDisconnect,
  onValue,
  serverTimestamp as rtdbServerTimeStamp,
  set,
  update,
} from "firebase/database";

interface MainLayoutProps {
  user: User;
  profile: UserProfile;
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

function MainLayout({
  user,
  profile,
  activeTab,
  onTabChange,
  children,
}: MainLayoutProps) {
  useEffect(() => {
    if (!user?.uid) return;

    const rtdb = getDatabase(app);
    const userStatusRef = ref(rtdb, `status/${user.uid}`);
    const firestoreUserRef = doc(db, "users", user.uid);

    const onlineStatus = {
      isOnline: true,
      lastSeen: Date.now(),
    };

    const offlineStatus = {
      isOnline: false,
      lastSeen: Date.now(),
    };

    const connectedRef = ref(rtdb, ".info/connected");

    const unsubscribe = onValue(connectedRef, async (snap) => {
      if (!snap.val()) return;

      await onDisconnect(userStatusRef).set(offlineStatus);
      await set(userStatusRef, onlineStatus);

      await updateDoc(firestoreUserRef, {
        isOnline: true,
        lastSeen: serverTimestamp(),
      });
    });

    const handleVisibilityChange = async () => {
      if (document.visibilityState === "hidden") {
        await update(userStatusRef, offlineStatus);
        await updateDoc(firestoreUserRef, {
          isOnline: false,
          lastSeen: serverTimestamp(),
        });
      } else {
        await update(userStatusRef, onlineStatus);
        await updateDoc(firestoreUserRef, {
          isOnline: true,
          lastSeen: serverTimestamp(),
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      unsubscribe();
      set(userStatusRef, offlineStatus);
    };
  }, [user?.uid]);

  return (
    <div className="min-h-screen bg-black flex relative pb-20 md:pb-0">
      <div className="hidden lg:block fixed top-0 left-0 h-screen">
        <ResponsiveNavigation
          activeTab={activeTab}
          onTabChange={onTabChange}
          user={user}
          profile={profile}
        />
      </div>

      <div className="flex-1 lg:ml-80 lg:pb-0">{children}</div>
      <div className=" lg:hidden fixed bottom-0 left-0 right-0">
        <ResponsiveNavigation
          activeTab={activeTab}
          onTabChange={onTabChange}
          user={user}
          profile={profile}
        />
      </div>
    </div>
  );
}

export default MainLayout;
