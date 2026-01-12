import { useDiscovery } from "@/hooks/useDiscovery";
import { UserProfile } from "@/lib/types";
import { User } from "firebase/auth";
import React, { useState } from "react";
import toast from "react-hot-toast";
import ProfilePage from "../profile/page";
import { Eye, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PLACEHOLDERS } from "@/lib/common-utils";
import { getOrCreateConversation } from "@/hooks/firebase-chat";

interface MatchPageProps {
  user: User;
  onSelectMatch: () => void;
}

export default function MatchePage({ user, onSelectMatch }: MatchPageProps) {
  const { myMatches, whoLikedMe, loading, handleSwipeAction } =
    useDiscovery(user);
  const [viewProfile, setViewProfile] = useState<UserProfile | null>(null);
  const [startChat, setStartChat] = useState<string | null>(null);

  const handleStartChat = async (matchedUser: UserProfile) => {
    setStartChat(matchedUser.uid);
    try {
      await getOrCreateConversation(user?.uid, matchedUser.uid);
      onSelectMatch();
    } catch (error) {
      console.error("Error starting chat", error);
      toast.error("Couldn't start chat");
    } finally {
      setStartChat(null);
    }
  };

  const handleLikeBack = async (profile: UserProfile) => {
    const success = await handleSwipeAction(profile, "like");
    if (success) {
      toast.success("Liked back! 🎉");
    }
  };

  const handleProfileView = (profile: UserProfile) => {
    setViewProfile(profile);
  };

  const handleBackFromProfile = () => {
    setViewProfile(null);
  };

  // ── Loading State ── (same style as other components)
  if (loading) {
    return (
      <div className="relative h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(236,72,153,0.15),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_70%,rgba(99,102,241,0.15),transparent_55%)]" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex flex-col items-center gap-10">
            <div className="relative">
              <div className="absolute inset-[-80px] rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-ping opacity-60" />
              <div className="absolute inset-[-50px] rounded-full bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 animate-pulse" />

              <div className="relative w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-600/40">
                <Heart className="h-16 w-16 text-white fill-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]" />
              </div>
            </div>

            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-pulse">
                Loading Matches...
              </h2>
              <p className="text-white/60 font-medium tracking-wide">
                Someone special is waiting ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (viewProfile) {
    return (
      <ProfilePage
        profile={viewProfile}
        isOwnerProfile={false}
        onBack={handleBackFromProfile}
        onStartChat={() => {
          handleStartChat(viewProfile);
          setViewProfile(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950 flex flex-col">
      {/* Glassmorphic Header */}
      <header className="sticky top-0 z-30 bg-black/30 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Matches
            </h1>
            <p className="text-white/60 text-sm mt-0.5">
              Your lovely connections 💘
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-purple-300 text-sm font-medium flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {whoLikedMe.length}
            </div>
            <div className="px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-pink-300 text-sm font-medium flex items-center gap-1.5">
              <Heart className="h-4 w-4 fill-current" />
              {myMatches.length}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 space-y-12 overflow-y-auto">
        {/* Who Liked You */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-900/30">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Who Liked You</h2>
              <p className="text-white/60">They already swiped right on you</p>
            </div>
          </div>

          {whoLikedMe.length === 0 ? (
            <div className="text-center py-16 px-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-purple-900/30 to-pink-900/20 flex items-center justify-center">
                <Eye className="h-10 w-10 text-purple-400/60" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Still quiet here...
              </h3>
              <p className="text-white/60 max-w-md mx-auto">
                Keep swiping — someone amazing is about to appear 💜
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {whoLikedMe.map((profile) => (
                <div
                  key={profile.uid}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={profile.photos?.[0] || PLACEHOLDERS.AVATAR_LARGE}
                      alt={profile.name}
                      className="w-full aspect-[3/4] object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-pink-600/80 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                      Liked you 💙
                    </div>
                  </div>

                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-white text-lg">
                      {profile.name}, {profile.age}
                    </h3>
                    <p className="text-white/60 text-sm mt-0.5">
                      {profile.location?.city}
                    </p>

                    <div className="flex gap-3 mt-5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-white/30 text-white hover:bg-white/10"
                        onClick={() => handleProfileView(profile)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                        onClick={() => handleLikeBack(profile)}
                      >
                        <Heart className="h-4 w-4 mr-1.5" />
                        Like Back
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Your Matches */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-900/30">
              <Heart className="h-5 w-5 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Your Matches</h2>
              <p className="text-white/60">You can now chat with them</p>
            </div>
          </div>

          {myMatches.length === 0 ? (
            <div className="text-center py-16 px-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-pink-900/30 to-rose-900/20 flex items-center justify-center">
                <Heart className="h-10 w-10 text-pink-400/60 fill-current" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No matches yet
              </h3>
              <p className="text-white/60 max-w-md mx-auto">
                Someone perfect is waiting — keep liking with intention ❤️
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {myMatches.map((profile) => (
                <div
                  key={profile.uid}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={profile.photos?.[0] || PLACEHOLDERS.AVATAR_LARGE}
                      alt={profile.name}
                      className="w-full aspect-[3/4] object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-rose-600/80 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                      It's a match! ❤️
                    </div>
                  </div>

                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-white text-lg">
                      {profile.name}, {profile.age}
                    </h3>
                    <p className="text-white/60 text-sm mt-0.5">
                      {profile.location?.city}
                    </p>

                    <div className="flex gap-3 mt-5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-white/30 text-white hover:bg-white/10 cursor-pointer"
                        onClick={() => handleProfileView(profile)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 cursor-pointer"
                        onClick={() => handleStartChat(profile)}
                        disabled={startChat === profile.uid}
                      >
                        <MessageCircle className="h-4 w-4 mr-1.5" />
                        Chat
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
