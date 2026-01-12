"use client";

import { User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { UserProfile } from "./useOnboarding";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  calculateDistance,
  CHAT_ACTIONS,
  GENDER_FILTERS,
} from "@/lib/common-utils";

export const useDiscovery = (user: User) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);
  const [myMatches, setMyMatches] = useState<UserProfile[]>([]);
  const [whoLikedMe, setWhoLikedMe] = useState<UserProfile[]>([]);

  // current user

  const loadCurrentUser = useCallback(async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", user?.uid));
      if (userDoc.exists()) {
        setCurrentUser(userDoc.data() as UserProfile);
      }
    } catch (error) {
      console.error("Error loading current user profile", error);
    }
  }, [user?.uid]);

  //ismai hmai milega jisko login user ne jise like dislike kiya uska id

  const getInteractedUserIds = async (userId: string): Promise<string[]> => {
    try {
      const interactionsQuery = query(
        collection(db, "interactions"),
        where("userId", "==", userId),
        where("action", "in", ["like", "dislike", "superlike"])
      );

      const snapshot = await getDocs(interactionsQuery);
      const interactedIds = snapshot.docs.map((doc) => doc.data().targetUserId);
      return interactedIds;
    } catch (error) {
      console.error("Error fetching interacted user ids", error);
      return [];
    }
  };

  //load profiles for discovery jinko hmne like dislike kuch nhi kiya

  const loadProfiles = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const interactedUserIds = await getInteractedUserIds(user?.uid);

      const excludedIds = [...interactedUserIds, user?.uid];

      const genderFilter = [
        ...(GENDER_FILTERS[currentUser.gender as keyof typeof GENDER_FILTERS] ||
          GENDER_FILTERS.default),
      ];
      const usersQuery = query(
        collection(db, "users"),
        where("profileComplete", "==", true),
        where("gender", "in", genderFilter),
        where("age", ">=", currentUser.ageRange[0]),
        where("age", "<=", currentUser.ageRange[1]),
        limit(50)
      );

      const snapshot = await getDocs(usersQuery);

      const potentialProfile = snapshot.docs
        .map((doc) => ({ ...doc.data(), uid: doc.id } as UserProfile))
        .filter((profile) => !excludedIds.includes(profile.uid))
        .filter((profile) => {
          if (
            !profile.location ||
            !profile.location.longitude ||
            !profile.location.latitude
          ) {
            return false;
          }
          if (
            !currentUser.location ||
            !currentUser.location.latitude ||
            !currentUser.location.longitude
          ) {
            return false;
          }
          return true;
        })

        .map((profile) => {
          const distance = calculateDistance(
            currentUser.location.latitude,
            currentUser.location.longitude,
            profile.location.latitude,
            profile.location.longitude
          );
          return { ...profile, distance };
        })
        .filter((profile) => {
          const totalProfile = snapshot.docs.length;
          let maxDistance = 100;

          if (totalProfile < 5) {
            maxDistance = 200;
          } else if (totalProfile < 10) {
            maxDistance = 150;
          } else if (totalProfile < 50) {
            maxDistance = 50;
          }
          return profile.distance <= maxDistance;
        })
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))
        .slice(0, 50);
      setProfiles(potentialProfile);
    } catch (error) {
      console.error("Error loading discovery profile", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, user?.uid]);

  //swipe handle
  const handleSwipeAction = async (
    profile: UserProfile,
    action: "like" | "dislike" | "superlike"
  ): Promise<boolean> => {
    try {
      //  Prevent multiple swipes on same user
      const existingInteractionQuery = query(
        collection(db, "interactions"),
        where("userId", "==", user.uid),
        where("targetUserId", "==", profile.uid)
      );

      const existingSnapshot = await getDocs(existingInteractionQuery);

      if (!existingSnapshot.empty) {
        console.warn("Already swiped on this user");
        return false;
      }

      //  Save swipe action
      const interactionRef = await addDoc(collection(db, "interactions"), {
        userId: user.uid,
        targetUserId: profile.uid,
        action,
        status: action === "dislike" ? "rejected" : "pending",
        createdAt: Timestamp.now(),
      });

      //  Remove profile from UI immediately
      setProfiles((prev) => prev.filter((p) => p.uid !== profile.uid));

      //  Match logic only for like/superlike
      if (action === "like" || action === "superlike") {
        const otherUserLikesQuery = query(
          collection(db, "interactions"),
          where("userId", "==", profile.uid),
          where("targetUserId", "==", user.uid),
          where("action", "in", ["like", "superlike"]),
          where("status", "==", "pending")
        );

        const likeSnapshot = await getDocs(otherUserLikesQuery);

        if (!likeSnapshot.empty) {
          //  Update other user's interaction
          await updateDoc(likeSnapshot.docs[0].ref, {
            status: "matched",
          });

          //  Update current user's interaction
          await updateDoc(interactionRef, {
            status: "matched",
          });

          //  MATCH FOUND
          setMatchedUser(profile);
          loadMyMatches();
          loadWhoLikesMe();

          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error handling swipe action", error);
      return false;
    }
  };

  //check kro kon mujhe like kr rha

  const loadWhoLikesMe = useCallback(async () => {
    try {
      const likedMeQuery = query(
        collection(db, "interactions"),
        where("targetUserId", "==", user.uid),
        where("action", "in", ["like", "superlike"]),
        where("status", "==", "pending")
      );

      const snapshot = await getDocs(likedMeQuery);

      const userIds = snapshot.docs.map((doc) => doc.data().userId);

      const profiles = await Promise.all(
        userIds.map(async (likedId) => {
          const likerDoc = await getDoc(doc(db, "users", likedId));
          if (!likerDoc.exists()) return null;
          return { ...likerDoc.data(), uid: likerDoc.id } as UserProfile;
        })
      );
      setWhoLikedMe(profiles.filter(Boolean) as UserProfile[]);
    } catch (error) {
      console.log("Error loading  who liked me:", error);
    }
  }, [user?.uid]);

  //mutual mathces k liye

  const loadMyMatches = useCallback(async () => {
    try {
      const matchesQuery = query(
        collection(db, "interactions"),
        where("userId", "==", user.uid),

        where("status", "==", "matched")
      );

      const snapshot = await getDocs(matchesQuery);

      const userIds = snapshot.docs.map((doc) => doc.data().targetUserId);

      const profiles = await Promise.all(
        userIds.map(async (matchId) => {
          const matchDoc = await getDoc(doc(db, "users", matchId));
          if (!matchDoc.exists()) return null;
          return { ...matchDoc.data(), uid: matchDoc.id } as UserProfile;
        })
      );
      setMyMatches(profiles.filter(Boolean) as UserProfile[]);
    } catch (error) {
      console.log("Error loading  my matches:", error);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  useEffect(() => {
    loadProfiles();
    loadMyMatches();
    loadWhoLikesMe();
  }, [currentUser, loadProfiles, loadMyMatches, loadWhoLikesMe]);

  return {
    profiles,
    currentUser,
    loading,
    matchedUser,
    myMatches,
    whoLikedMe,
    loadProfiles,
    handleSwipeAction,
    setMatchedUser,
    loadWhoLikesMe,
    loadMyMatches,
    setCurrentUser,
  };
};
