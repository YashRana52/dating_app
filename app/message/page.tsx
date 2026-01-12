"use client";

import Chat from "@/components/chatPage/Chat";
import ConversationList from "@/components/chatPage/ConversationList";

import { SelectedConversation, UserProfile } from "@/lib/types";
import { User } from "firebase/auth";
import { Heart } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface MessagePageProps {
  user: User;
}

function MessagePage({ user }: MessagePageProps) {
  const [loading, setLoading] = useState(true);

  const [selectedConversation, setSelectedConversation] =
    useState<SelectedConversation | null>(null);
  const scrollPositionRef = useRef(0);

  const handleSelectConversation = (
    conversationId: string,
    otherUser: UserProfile
  ) => {
    scrollPositionRef.current = window.scrollY;
    setSelectedConversation({ conversationId, otherUser });
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
    setTimeout(() => {
      window.scrollTo({ top: scrollPositionRef.current, behavior: "instant" });
    }, 0);
  };

  useEffect(() => {
    if (!selectedConversation && scrollPositionRef.current > 0) {
      window.scrollTo({ top: scrollPositionRef.current, behavior: "instant" });
    }
  }, [selectedConversation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="relative h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(236,72,153,0.15),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_70%,rgba(99,102,241,0.15),transparent_55%)]" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex flex-col items-center gap-10">
            {/* Ripple rings */}
            <div className="relative">
              <div className="absolute inset-[-70px] rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-ping opacity-60" />
              <div className="absolute inset-[-40px] rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-ping opacity-70" />
              <div className="absolute inset-[-18px] rounded-full bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 animate-pulse" />

              {/* Main chat bubble */}
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-600/40 animate-pulse">
                <svg
                  className="w-14 h-14 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3C6.48 3 2 6.94 2 11.8c0 2.48 1.2 4.7 3.14 6.25L4 22l4.21-2.2c1.17.32 2.43.5 3.79.5 5.52 0 10-3.94 10-8.8S17.52 3 12 3zm-3 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm3 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm3 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                </svg>

                <div className="absolute inset-0 rounded-full border-4 border-white/25 animate-ping" />
              </div>
            </div>

            {/* Text */}
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-pulse">
                Loading conversations…
              </h2>
              <p className="text-white/50 text-base font-medium">
                Getting your chats ready 💬
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 overflow-hidden">
      {/*  SIDEBAR  */}
      <aside className="hidden md:flex w-[380px] lg:w-[420px] flex-col border-r border-pink-100/60 bg-white/50 backdrop-blur-xl">
        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-300/50 hover:scrollbar-thumb-pink-400">
          <ConversationList
            user={user}
            onSelectConversation={handleSelectConversation}
          />
        </div>
      </aside>

      {/* CHAT AREA  */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {selectedConversation ? (
          <>
            {/* Chat Component */}
            <Chat
              user={user}
              conversationId={selectedConversation.conversationId}
              otherUser={selectedConversation.otherUser}
              onBack={handleBackToList}
            />
          </>
        ) : (
          /* ================= EMPTY STATE ================= */
          <div className="flex-1 flex items-center justify-center px-6 bg-gradient-to-br from-slate-950 via-indigo-950 to-fuchsia-950">
            <div className="text-center max-w-sm space-y-6">
              {/* Icon */}
              <div
                className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 
      flex items-center justify-center shadow-2xl shadow-indigo-900/40"
              >
                <Heart className="w-12 h-12 text-white" fill="white" />
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                No Chat Selected
              </h2>

              {/* Subtitle */}
              <p className="text-white/60 text-base leading-relaxed">
                Choose a match from the left
                <br />
                and start your conversation 💬
              </p>

              {/* CTA */}
              <button
                className="
        mt-4 px-8 py-4 rounded-xl
        bg-white/10 hover:bg-white/20
        backdrop-blur-md
        text-white font-medium
        transition-all duration-300
        hover:scale-105
        border border-white/10
      "
              >
                View Matches
              </button>

              {/* Footer Hint */}
              <p className="text-white/40 text-sm pt-4">
                Your next connection is waiting ✨
              </p>
            </div>
          </div>
        )}

        {/* Mobile Conversation List */}
        {!selectedConversation && (
          <div className="md:hidden h-full">
            <ConversationList
              user={user}
              onSelectConversation={handleSelectConversation}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default MessagePage;
