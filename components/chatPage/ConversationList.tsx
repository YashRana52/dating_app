import { getUserProfile, subscribeToConversation } from "@/hooks/firebase-chat";
import { Conversation, UserProfile } from "@/lib/types";
import { User } from "firebase/auth";
import { Heart, MessageCircle, Mic, Search, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PLACEHOLDERS } from "@/lib/common-utils";
import { cn } from "@/lib/utils";

interface ConversationWithProfile extends Conversation {
  otherUser: UserProfile; // always defined after filtering
}

interface ConversationListProps {
  user: User;
  onSelectConversation: (
    conversationId: string,
    otherUser: UserProfile
  ) => void;
  className?: string;
}

export default function ConversationList({
  user,
  className,
  onSelectConversation,
}: ConversationListProps) {
  const [conversations, setConversations] = useState<ConversationWithProfile[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToConversation(
      user.uid,
      async (newConversations) => {
        const convWithProfiles = await Promise.all(
          newConversations.map(async (conv) => {
            const otherUserId = conv.participants.find((id) => id !== user.uid);
            if (!otherUserId) return null;

            const firebaseUser = await getUserProfile(otherUserId);
            if (!firebaseUser) return null;

            // Map Firebase UserProfile to your local UserProfile type
            const otherUser: UserProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.name,
              email: firebaseUser.email,
              age: firebaseUser.age,
              photos: firebaseUser.photos || [],
              isOnline: firebaseUser.isOnline || false,
              // add any other fields your UserProfile expects
            };

            return { ...conv, otherUser };
          })
        );

        // Remove nulls (failed fetches) and narrow types
        const validConversations: ConversationWithProfile[] =
          convWithProfiles.filter(
            (c): c is ConversationWithProfile => c !== null
          );

        // Sort by last message time descending
        validConversations.sort((a, b) => {
          const ta = a.lastMessageTime?.toMillis?.() ?? 0;
          const tb = b.lastMessageTime?.toMillis?.() ?? 0;
          return tb - ta;
        });

        setConversations(validConversations);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const filteredConversations = conversations.filter((c) =>
    c.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  type TimestampLike =
    | { toDate: () => Date }
    | Date
    | number
    | null
    | undefined;
  const isTimestampWithToDate = (t: unknown): t is { toDate: () => Date } =>
    !!t && typeof (t as { toDate?: unknown }).toDate === "function";

  const formatTime = (timestamp: TimestampLike): string => {
    if (!timestamp) return "";
    const date = isTimestampWithToDate(timestamp)
      ? timestamp.toDate()
      : timestamp instanceof Date
      ? timestamp
      : new Date(timestamp as number);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return "now";
    if (diffMin < 60) return `${diffMin}m`;
    if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h`;
    if (diffMin < 10080) return `${Math.floor(diffMin / 1440)}d`;
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="relative h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(236,72,153,0.15),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_70%,rgba(99,102,241,0.15),transparent_55%)]" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex flex-col items-center gap-8">
            <div className="relative">
              <div className="absolute inset-[-80px] rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-ping opacity-60" />
              <div className="absolute inset-[-50px] rounded-full bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 animate-pulse" />

              <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-600/40">
                <Heart
                  className="w-12 h-12 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
                  fill="currentColor"
                />
              </div>
            </div>

            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-pulse">
                Loading Matches...
              </h2>
              <p className="text-white/60 font-medium tracking-wide">
                Finding your conversations 💌
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950 flex flex-col",
        className
      )}
    >
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-xl border-b border-white/5 sticky top-0 z-20">
        <div className="px-4 pt-5 pb-3 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-900/30">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Messages
              </h1>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="text-white/70 hover:text-pink-400 hover:bg-white/5 rounded-full"
            >
              <Users className="h-5 w-5" />
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search matches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-full h-12 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-3 pt-2 pb-20 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-900/30 to-indigo-900/20 flex items-center justify-center mb-6 border border-white/10">
              <Heart
                className="w-12 h-12 text-purple-400/40"
                fill="currentColor"
              />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              No conversations yet
            </h3>
            <p className="text-white/50 text-base max-w-xs">
              Start swiping and matching to spark new conversations!
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-w-3xl mx-auto">
            {filteredConversations.map((conv) => {
              const other = conv.otherUser;
              const hasUnread = conv.unreadCount && conv.unreadCount > 0;

              return (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id, other)}
                  className={cn(
                    "w-full group flex items-center gap-4 p-4 rounded-2xl transition-all duration-200",
                    "bg-white/5 hover:bg-white/10 border border-white/5",
                    "active:scale-[0.98]",
                    hasUnread && "bg-purple-950/25 border-purple-500/30"
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar className="w-16 h-16 border-2 border-black/40 shadow-xl shadow-black/30">
                      <AvatarImage
                        src={other.photos?.[0] || PLACEHOLDERS.AVATAR}
                        alt={other.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-semibold">
                        {other.name[0] || "?"}
                      </AvatarFallback>
                    </Avatar>

                    {other.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-black rounded-full shadow-lg shadow-emerald-900/40" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <h3
                        className={cn(
                          "font-semibold truncate",
                          hasUnread ? "text-white" : "text-white/90"
                        )}
                      >
                        {other.name}
                      </h3>
                      <span className="text-xs text-white/40 shrink-0 font-medium">
                        {formatTime(conv.lastMessageTime)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      {conv.lastMessageType === "audio" && (
                        <Mic className="h-3.5 w-3.5 text-purple-400" />
                      )}
                      <p
                        className={cn(
                          "text-sm truncate",
                          hasUnread ? "text-white font-medium" : "text-white/60"
                        )}
                      >
                        {conv.lastMessage || "Start the conversation ✨"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
