import { ACTION_ICONS } from "@/lib/common-utils";

export const DislikeIcon = () => (
  <img
    src={ACTION_ICONS.cancel}
    alt="dislike"
    className="h-7 w-7 object-contain"
    draggable={false}
  />
);

export const SuperlikeIcon = () => (
  <img
    src={ACTION_ICONS.star}
    alt="superlike"
    className="h-7 w-7 object-contain"
    draggable={false}
  />
);

export const LikeIcon = () => (
  <img
    src={ACTION_ICONS.heart}
    alt="like"
    className="h-7 w-7 object-contain"
    draggable={false}
  />
);

export const MessageIcon = () => (
  <img
    src={ACTION_ICONS.message}
    alt="message"
    className="h-7 w-7 object-contain"
    draggable={false}
  />
);

export const RewindIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
  >
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);
