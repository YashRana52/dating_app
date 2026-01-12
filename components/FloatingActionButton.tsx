import { UserProfile } from "@/lib/types";
import React from "react";
import { Button } from "./ui/button";

// Wrap icons with proper SVG props typing
const RewindIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <RewindIcon {...props} />
);
const DislikeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <DislikeIcon {...props} />
);
const LikeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <LikeIcon {...props} />
);
const SuperlikeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <SuperlikeIcon {...props} />
);
const MessageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <MessageIcon {...props} />
);

interface FloatingActionButtonProps {
  onAction: (
    action: "pass" | "like" | "superlike" | "rewind" | "message",
    profile?: UserProfile
  ) => void;
  actionLoading: string | null;
  disabled?: boolean;
  currentProfile?: UserProfile;
}

export default function FloatingActionButton({
  onAction,
  actionLoading,
  disabled = false,
}: FloatingActionButtonProps) {
  const isLoading = (action: string) => actionLoading === action;

  return (
    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 translate-y-1/2 z-50 pointer-events-auto">
      <div
        className="
          flex items-center justify-center gap-4 
          bg-black/40 backdrop-blur-xl 
          px-6 py-5 rounded-full 
          border border-white/10 
          shadow-2xl
          ring-1 ring-white/5
        "
      >
        {/* Rewind */}
        <ActionBtn
          onClick={() => onAction("rewind")}
          loading={isLoading("rewind")}
          disabled={disabled}
          className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 hover:shadow-amber-500/20"
        >
          <RewindIcon className="h-5 w-5" />
        </ActionBtn>

        {/* Pass */}
        <ActionBtn
          onClick={() => onAction("pass")}
          loading={isLoading("pass")}
          disabled={disabled}
          className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 hover:shadow-rose-500/20"
          size="lg"
        >
          <DislikeIcon className="h-7 w-7" />
        </ActionBtn>

        {/* Super Like */}
        <ActionBtn
          onClick={() => onAction("superlike")}
          loading={isLoading("superlike")}
          disabled={disabled}
          className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/15 hover:shadow-purple-500/30 scale-110"
          size="lg"
        >
          <SuperlikeIcon className="h-7 w-7" />
        </ActionBtn>

        {/* Like */}
        <ActionBtn
          onClick={() => onAction("like")}
          loading={isLoading("like")}
          disabled={disabled}
          className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 hover:shadow-emerald-500/30 scale-110"
          size="lg"
        >
          <LikeIcon className="h-8 w-8" />
        </ActionBtn>

        {/* Message */}
        <ActionBtn
          onClick={() => onAction("message")}
          loading={isLoading("message")}
          disabled={disabled}
          className="text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 hover:shadow-sky-500/20"
          size="lg"
        >
          <MessageIcon className="h-7 w-7" />
        </ActionBtn>
      </div>
    </div>
  );
}

// Reusable button
type ActionBtnProps = {
  children: React.ReactNode;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  size?: "default" | "lg";
};

function ActionBtn({
  children,
  onClick,
  loading = false,
  disabled = false,
  className = "",
  size = "default",
}: ActionBtnProps) {
  const btnSize = size === "lg" ? "h-16 w-16" : "h-12 w-12";
  const iconSize = size === "lg" ? "scale-110" : "scale-100";

  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      size="icon"
      variant="ghost"
      className={`
        relative ${btnSize} rounded-full
        bg-white/5 hover:bg-white/10
        border border-white/10
        transition-all duration-300 ease-out
        active:scale-95
        hover:scale-110
        hover:shadow-xl
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </div>
      ) : (
        <div className={iconSize}>{children}</div>
      )}
    </Button>
  );
}
