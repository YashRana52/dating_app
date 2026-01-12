"use client";

import { UserProfile } from "@/lib/types";
import { db } from "@/lib/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

interface UserProfileResult {
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useUserProfile(userId: string | undefined): UserProfileResult {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(true);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const userRef = doc(db, "users", userId);

    const unsubscribe = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;

          if (data.profileComplete) {
            setProfile({ ...data, uid: userId });
          } else {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setProfile(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  //  Manual refresh (one-time fetch)
  const refresh = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const snap = await getDoc(doc(db, "users", userId));

      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        setProfile(data.profileComplete ? { ...data, uid: userId } : null);
      } else {
        setProfile(null);
      }
    } catch (err) {
      setError(err as Error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { profile, loading, error, refresh };
}
