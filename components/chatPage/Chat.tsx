"use client";
import {
  deleteMessage,
  markMessageAsRead,
  reactMessage,
  sendMessage,
  subscribeToMessage,
} from "@/hooks/firebase-chat";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useCloudinaryAudio } from "@/hooks/useCloudinaryAudio";
import { getLastSeenText, QUICK_REACTIONS } from "@/lib/common-utils";
import { ChatMessage, SavedRecording, UserProfile } from "@/lib/types";
import { User } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Heart,
  Mic,
  Pause,
  Play,
  Send,
  Smile,
  Trash2,
  Image as ImageIcon,
  Paperclip,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface ChatPageProps {
  user: User;
  conversationId: string;
  otherUser: UserProfile;
  onBack: () => void;
}

export default function PremiumChat({
  user,
  conversationId,
  otherUser,
  onBack,
}: ChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);

  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [reactionPickerId, setReactionPickerId] = useState<string | null>(null);

  const [savedVoice, setSavedVoice] = useState<SavedRecording | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previewAudioRef = useRef<HTMLAudioElement>(null);
  const audioElements = useRef<Record<string, HTMLAudioElement>>({});

  const {
    isRecording,
    recordingTime,
    audioLevel,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useAudioRecorder();

  const { uploadAudio, uploadProgress, uploading } = useCloudinaryAudio();

  // ── Realtime messages ───────────────────────────────────────────────
  useEffect(() => {
    if (!conversationId || !user?.uid) return;
    setLoading(true);

    const unsubscribe = subscribeToMessage(conversationId, (msgs) => {
      setMessages(msgs);
      setLoading(false);
      if (msgs.length > 0) markMessageAsRead(conversationId, user.uid);
    });

    return () => unsubscribe();
  }, [conversationId, user?.uid]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, savedVoice]);

  // Voice preview audio
  useEffect(() => {
    if (!savedVoice?.url) {
      previewAudioRef.current?.pause();
      return;
    }

    const audio = new Audio(savedVoice.url);
    audio.onended = () => {
      setIsPreviewPlaying(false);
      setPreviewProgress(0);
    };
    audio.ontimeupdate = () =>
      setPreviewProgress((audio.currentTime / audio.duration) * 100 || 0);
    previewAudioRef.current = audio;

    return () => audio.pause();
  }, [savedVoice]);

  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || uploading) return;

    await sendMessage(
      conversationId,
      user.uid,
      otherUser.uid,
      messageInput.trim(),
      "text"
    );
    setMessageInput("");
    setShowEmoji(false);
  };

  const handleSendVoice = async () => {
    if (!savedVoice) return;
    try {
      const audioUrl = await uploadAudio(savedVoice.blob);
      await sendMessage(
        conversationId,
        user.uid,
        otherUser.uid,
        "Voice message",
        "audio",
        audioUrl,
        Math.round(savedVoice.duration)
      );
      discardVoice();
    } catch (err) {
      console.error("Voice send failed:", err);
    }
  };

  const discardVoice = () => {
    previewAudioRef.current?.pause();
    if (savedVoice?.url) URL.revokeObjectURL(savedVoice.url);
    setSavedVoice(null);
    setIsPreviewPlaying(false);
    setPreviewProgress(0);
  };

  const togglePreview = () => {
    if (!previewAudioRef.current) return;
    isPreviewPlaying
      ? previewAudioRef.current.pause()
      : previewAudioRef.current.play();
    setIsPreviewPlaying(!isPreviewPlaying);
  };

  const toggleAudioMessage = (msgId: string, url: string) => {
    // Pause previous
    if (playingAudioId && playingAudioId !== msgId) {
      audioElements.current[playingAudioId]?.pause();
    }

    if (playingAudioId === msgId) {
      audioElements.current[msgId]?.pause();
      setPlayingAudioId(null);
      return;
    }

    if (!audioElements.current[msgId]) {
      const audio = new Audio(url);
      audio.onended = () => setPlayingAudioId(null);
      audioElements.current[msgId] = audio;
    }

    audioElements.current[msgId].play();
    setPlayingAudioId(msgId);
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Heart className="h-20 w-20 mx-auto mb-6 text-rose-500 animate-pulse" />
          <p className="text-2xl font-medium text-white/90">
            Opening conversation...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-950 via-slate-950 to-indigo-950 text-white">
      {/* ── Premium Header ────────────────────────────────────────────── */}
      <header className="bg-black/50 backdrop-blur-2xl border-b border-white/8 sticky top-0 z-20">
        <div className="flex items-center px-4 py-3.5 gap-3.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-white/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Avatar className="h-11 w-11 ring-2 ring-rose-500/40 ring-offset-2 ring-offset-black">
            <AvatarImage src={otherUser.photos?.[0]} />
            <AvatarFallback className="bg-gradient-to-br from-rose-600 to-purple-600">
              {otherUser.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-lg truncate">{otherUser.name}</h2>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              {otherUser.isOnline ? (
                <>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  Active now
                </>
              ) : (
                getLastSeenText(otherUser.lastSeen)
              )}
            </p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-28 scrollbar-thin scrollbar-thumb-indigo-700/50">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col items-center justify-center text-center gap-4"
          >
            <Heart className="h-24 w-24 text-rose-500/30" />
            <h3 className="text-3xl font-medium bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
              It's a match!
            </h3>
            <p className="text-gray-400 max-w-md">
              Start with something flirty or genuine — {otherUser.name} is
              waiting 💫
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {messages.map((msg) => {
              const isOwn = msg.senderId === user.uid;
              const hasReactions =
                msg.reactions && Object.keys(msg.reactions).length > 0;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={cn(
                    "flex",
                    isOwn ? "justify-end" : "justify-start"
                  )}
                >
                  <div className="group relative max-w-[82%]">
                    <div
                      className={cn(
                        "px-5 py-3.5 rounded-2xl shadow-lg transition-all",
                        isOwn
                          ? "bg-gradient-to-br from-rose-600 to-pink-600 rounded-br-none"
                          : "bg-white/6 backdrop-blur-md border border-white/10 rounded-bl-none"
                      )}
                    >
                      {msg.type === "audio" ? (
                        <div className="flex items-center gap-3 min-w-[260px]">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="hover:bg-white/10"
                            onClick={() =>
                              toggleAudioMessage(msg.id, msg.audioUrl!)
                            }
                          >
                            {playingAudioId === msg.id ? <Pause /> : <Play />}
                          </Button>

                          <div className="flex-1 h-8 flex items-center gap-0.5">
                            {Array.from({ length: 24 }).map((_, i) => (
                              <motion.span
                                key={i}
                                className="w-0.5 bg-white/70 rounded-full origin-bottom"
                                animate={{
                                  height:
                                    playingAudioId === msg.id
                                      ? [6, 18, 10, 22, 14][i % 5]
                                      : 8,
                                }}
                                transition={{
                                  duration: 0.8,
                                  repeat:
                                    playingAudioId === msg.id ? Infinity : 0,
                                  delay: i * 0.04,
                                }}
                              />
                            ))}
                          </div>

                          <span className="text-xs font-mono text-white/70 tabular-nums">
                            {msg.audioDuration
                              ? formatDuration(msg.audioDuration)
                              : "--:--"}
                          </span>
                        </div>
                      ) : (
                        <p className="leading-relaxed break-words">
                          {msg.content}
                        </p>
                      )}

                      <time className="text-xs mt-2 opacity-60 block text-right">
                        {msg.timestamp?.toDate?.().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }) ?? "sending..."}
                      </time>
                    </div>

                    {/* Reactions row */}
                    {hasReactions && (
                      <div
                        className={cn(
                          "mt-1.5 flex gap-1 px-3 py-1 rounded-full bg-black/60 backdrop-blur-lg border border-white/10 w-fit text-lg shadow-md",
                          isOwn ? "ml-auto" : ""
                        )}
                      >
                        {Object.keys(msg.reactions ?? {}).map((e) => (
                          <span key={e}>{e}</span>
                        ))}
                      </div>
                    )}

                    {/* Hover controls */}
                    <div className="absolute top-1/2 -translate-y-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isOwn && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 bg-black/60 backdrop-blur-md hover:bg-red-900/50"
                          style={{ marginLeft: "-3.75rem" }}
                          onClick={() => deleteMessage(msg.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 bg-black/60 backdrop-blur-md hover:bg-white/10"
                        style={
                          isOwn
                            ? { marginLeft: "-7.5rem" }
                            : { marginRight: "-3.75rem" }
                        }
                        onClick={() =>
                          setReactionPickerId(
                            reactionPickerId === msg.id ? null : msg.id
                          )
                        }
                      >
                        <Smile size={18} />
                      </Button>
                    </div>

                    {/* Quick reaction picker */}
                    <AnimatePresence>
                      {reactionPickerId === msg.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 10 }}
                          className={cn(
                            "absolute z-30 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex gap-3 shadow-2xl",
                            isOwn
                              ? "right-0 bottom-full mb-3"
                              : "left-0 bottom-full mb-3"
                          )}
                        >
                          {QUICK_REACTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              className="text-4xl hover:scale-125 transition-transform p-2 rounded-xl hover:bg-white/10"
                              onClick={() => {
                                reactMessage(msg.id, user.uid, emoji);
                                setReactionPickerId(null);
                              }}
                            >
                              {emoji}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* ── Input Area (floating style) ───────────────────────────────── */}
      <footer className="bg-gradient-to-t from-black/80 via-black/60 to-transparent pb-safe pt-2 px-4 sticky bottom-0 z-10">
        <AnimatePresence mode="wait">
          {isRecording ? (
            <motion.div
              key="recording"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="mb-4 p-5 bg-gradient-to-b from-red-950/60 to-red-950/40 backdrop-blur-xl rounded-2xl border border-red-800/30"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-red-300 tracking-wide">
                  RECORDING
                </span>
                <span className="font-mono text-xl font-bold text-red-200 tabular-nums">
                  {formatDuration(recordingTime)}
                </span>
              </div>

              <div className="h-2 bg-red-950/70 rounded-full overflow-hidden mb-5">
                <motion.div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-600"
                  animate={{ width: `${Math.min(audioLevel * 1.8, 100)}%` }}
                  transition={{ duration: 0.15 }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="border-green-600/70 text-green-300 hover:bg-green-950/50"
                  onClick={stopRecording}
                >
                  Stop & Listen
                </Button>
                <Button
                  variant="outline"
                  className="border-red-600/70 text-red-300 hover:bg-red-950/50"
                  onClick={cancelRecording}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          ) : savedVoice ? (
            <motion.div
              key="preview"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="mb-4 p-5 bg-gradient-to-b from-indigo-950/60 to-indigo-950/40 backdrop-blur-xl rounded-2xl border border-indigo-800/30"
            >
              <p className="font-medium text-indigo-300 mb-4">
                Voice Message Preview
              </p>

              <div className="flex items-center gap-4 mb-4">
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-14 w-14 rounded-full hover:bg-white/10"
                  onClick={togglePreview}
                >
                  {isPreviewPlaying ? <Pause size={28} /> : <Play size={28} />}
                </Button>

                <div className="flex-1">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-400 to-purple-500"
                      animate={{ width: `${previewProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-indigo-200/80 mt-1.5 font-mono">
                    <span>
                      {formatDuration(
                        Math.round(
                          (previewProgress / 100) * (savedVoice.duration || 0)
                        )
                      )}
                    </span>
                    <span>{formatDuration(savedVoice.duration || 0)}</span>
                  </div>
                </div>
              </div>

              {uploading && (
                <div className="mb-4">
                  <p className="text-xs text-indigo-300 mb-1.5">
                    Uploading... {Math.round(uploadProgress)}%
                  </p>
                  <Progress value={uploadProgress} className="h-1.5" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button
                  className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
                  onClick={handleSendVoice}
                  disabled={uploading}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Voice
                </Button>
                <Button
                  variant="outline"
                  className="border-red-600/60 text-red-300 hover:bg-red-950/50"
                  onClick={discardVoice}
                  disabled={uploading}
                >
                  Discard
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="input"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onSubmit={handleSendText}
              className="flex items-center gap-2 pb-3 pt-2"
            >
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="hover:bg-white/10"
              >
                <Paperclip size={20} />
              </Button>

              <div className="relative flex-1">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={`Message ${otherUser.name?.split(" ")[0]}...`}
                  className="pr-24 bg-white/5 border-white/10 focus:border-rose-500 rounded-full py-6"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-white/10"
                  onClick={() => setShowEmoji(!showEmoji)}
                >
                  <Smile size={20} />
                </Button>
              </div>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={startRecording}
                className="hover:bg-white/10"
              >
                <Mic size={20} />
              </Button>

              <Button
                type="submit"
                size="icon"
                className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-full"
                disabled={!messageInput.trim() || uploading}
              >
                <Send size={18} />
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showEmoji && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-full left-4 mb-4 z-30"
            >
              <EmojiPicker
                onEmojiClick={(emojiData: EmojiClickData) => {
                  setMessageInput((prev) => prev + emojiData.emoji);
                }}
                previewConfig={{ showPreview: false }}
                width={320}
                height={400}
                skinTonePickerLocation="none"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </footer>
    </div>
  );
}
