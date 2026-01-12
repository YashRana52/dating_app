import React, { useState } from "react";
import { User } from "firebase/auth";
import { Heart, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SwipebleCard from "@/components/SwipebleCard";
import FloatingActionButton from "@/components/FloatingActionButton";
import { useDiscovery } from "@/hooks/useDiscovery";
import { DISCOVERY_CONSTANTS, PLACEHOLDERS } from "@/lib/common-utils";
import { UserProfile } from "@/lib/types";

interface DiscoveryPageProps {
  user: User;
  onSelectMatch: () => void;
}

export default function DiscoveryPage({
  user,
  onSelectMatch,
}: DiscoveryPageProps) {
  const { profiles, loading, handleSwipeAction, loadProfiles } =
    useDiscovery(user);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [animatingCards, setAnimatingCards] = useState<Set<string>>(new Set());

  // Better photo fallback handling
  const enhancedProfiles = profiles.map((profile) => ({
    ...profile,
    photos: profile.photos?.length > 0 ? profile.photos : [PLACEHOLDERS.AVATAR],
  }));

  const handleButtonAction = async (
    action: "pass" | "like" | "superlike" | "rewind" | "message",
    profile?: UserProfile
  ) => {
    if (actionLoading || enhancedProfiles.length === 0) return;

    setActionLoading(action);

    try {
      const currentProfile = enhancedProfiles[0];

      if (action === "message" && profile) {
        await handleSwipeAction(profile, "like");
        onSelectMatch();
        return;
      }

      if (action === "rewind") {
        // Usually handled in backend / context
        return;
      }

      // Main swipe actions
      if (action === "like") {
        await handleSwipeAction(currentProfile, "like");
      } else if (action === "superlike") {
        await handleSwipeAction(currentProfile, "superlike");
      } else if (action === "pass") {
        await handleSwipeAction(currentProfile, "dislike");
      }

      // Visual feedback: mark as animating out
      setAnimatingCards((prev) => new Set([...prev, currentProfile.uid]));

      // Clean up after animation
      setTimeout(() => {
        setAnimatingCards((prev) => {
          const next = new Set(prev);
          next.delete(currentProfile.uid);
          return next;
        });
      }, 1200);
    } catch (error) {
      console.error("Swipe action failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const visibleProfiles = enhancedProfiles.slice(
    0,
    DISCOVERY_CONSTANTS.MAX_VISIBLE_PROFILES
  );

  // ── Loading State ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="relative h-full bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Background pulse rings */}
            <div className="absolute inset-[-40%] rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 animate-pulse-slow opacity-70" />
            <div className="absolute inset-[-20%] rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 animate-pulse" />

            <div className="relative flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-pink-500/30 animate-pulse">
                  <Heart className="h-10 w-10 text-white fill-white" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping" />
              </div>

              <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-200 bg-clip-text text-transparent">
                  Discovering amazing people...
                </h2>
                <p className="text-white/60 text-sm">Just a moment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Content ────────────────────────────────────────────────────────────────
  return (
    <div className="relative h-full bg-gradient-to-b from-gray-950 via-slate-950 to-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(236,72,153,0.08),transparent_40%)]" />

      <div className="relative h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 pb-32 md:pb-40">
          <div className="relative w-full max-w-md aspect-[3/4.2] mx-auto">
            {visibleProfiles.length === 0 ? (
              // No more profiles state
              <Card className="relative h-full w-full overflow-hidden border border-white/10 bg-black/40 backdrop-blur-2xl rounded-3xl shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-purple-900/10 to-transparent" />

                <CardContent className="relative h-full flex flex-col items-center justify-center gap-8 p-10 text-center">
                  <div className="rounded-full bg-gradient-to-br from-pink-600 to-purple-600 p-6 shadow-xl shadow-pink-500/30">
                    <Heart className="h-14 w-14 text-white fill-white" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                      You're all caught up!
                    </h3>
                    <p className="text-white/60 text-base max-w-sm">
                      New interesting people will appear soon. Stay connected ✨
                    </p>
                  </div>

                  <Button
                    onClick={loadProfiles}
                    size="lg"
                    className="gap-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 px-10 hover:from-pink-500 hover:to-purple-500 shadow-lg shadow-pink-600/30 transition-all duration-300 hover:scale-105"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Discover More
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {visibleProfiles.map((profile, index) => {
                  const isTop = index === 0;
                  const zIndex = visibleProfiles.length - index + 10;
                  const scale = 1 - index * 0.04;
                  const translateY = index * 12;

                  return (
                    <SwipebleCard
                      key={profile.uid}
                      profile={profile}
                      isAnimating={animatingCards.has(profile.uid)}
                      className={isTop ? "shadow-2xl shadow-pink-500/20" : ""}
                      style={{
                        zIndex,
                        transform: `scale(${scale}) translateY(${translateY}px)`,
                        opacity: animatingCards.has(profile.uid) ? 0 : 1,
                        transition:
                          "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      }}
                    />
                  );
                })}

                <FloatingActionButton
                  onAction={handleButtonAction}
                  actionLoading={actionLoading}
                  disabled={animatingCards.size > 0}
                  currentProfile={visibleProfiles[0]}
                />
              </>
            )}
          </div>
        </div>

        {visibleProfiles.length > 0 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center pointer-events-none">
            <p className="text-xs text-white/40 tracking-wide">
              Swipe or use buttons below
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
