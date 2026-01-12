import { UserProfile } from "@/lib/types";
import React, { useState } from "react";
import { Card } from "./ui/card";
import { formatUtils, PLACEHOLDERS } from "@/lib/common-utils";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Badge } from "./ui/badge";

interface SwipebleCardProps {
  profile: UserProfile;
  style?: React.CSSProperties;
  isAnimating?: boolean;
}

function SwipebleCard({ profile, style, isAnimating }: SwipebleCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      Math.min(prev + 1, profile.photos.length - 1)
    );
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) => Math.max(prev - 1, 0));
  };

  const cardStyle = {
    ...style,
    transition: isAnimating
      ? "transform 0.3s ease-out, opacity 0.3s ease-in-out"
      : "none",
  };

  return (
    <div
      className="absolute inset-0 rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]"
      style={cardStyle}
    >
      <div className="relative w-full h-full bg-gradient-to-b from-black/10 via-transparent to-black/70">
        {/* Progress indicators */}
        {profile.photos.length > 1 && (
          <div className="absolute top-5 left-5 right-5 z-30 flex gap-1.5 px-2">
            {profile.photos.map((_, idx) => (
              <div
                key={idx}
                className="h-1.5 flex-1 rounded-full overflow-hidden bg-white/25 backdrop-blur-sm"
              >
                <div
                  className={`h-full bg-white transition-all duration-300 ease-out ${
                    idx === currentImageIndex ? "w-full" : "w-0"
                  } ${idx < currentImageIndex ? "w-full" : ""}`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Main Photo */}
        <img
          src={profile?.photos[currentImageIndex] || PLACEHOLDERS.AVATAR}
          alt={profile.name}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          draggable={false}
        />

        {/* Gradient overlay + content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

        {/* Navigation buttons - subtle & modern */}
        {profile.photos.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              disabled={currentImageIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-7 w-7" strokeWidth={2.5} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              disabled={currentImageIndex === profile.photos.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-110 disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-7 w-7" strokeWidth={2.5} />
            </button>
          </>
        )}

        {/* Bottom Info - modern glass effect */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 z-20">
          <div className="flex items-end gap-3 mb-2">
            <h2 className="text-4xl font-extrabold tracking-tight drop-shadow-lg">
              {profile.name}
            </h2>
            <span className="text-3xl font-light text-white/90 drop-shadow-lg">
              {profile.age}
            </span>
            <div className="ml-2 mb-1.5 w-3.5 h-3.5 rounded-full bg-green-500 ring-2 ring-green-500/40 shadow-lg" />
          </div>

          {profile.additionalInfo?.bio && (
            <p className="text-base text-white/85 font-light leading-relaxed mb-5 line-clamp-2 drop-shadow-md">
              {profile.additionalInfo.bio}
            </p>
          )}

          <div className="flex items-center gap-2 mb-5 text-white/90 drop-shadow-md">
            <MapPin className="h-5 w-5" strokeWidth={2} />
            <span className="text-base font-medium">
              {profile.location.city}, {profile.location.state}
              {profile.distance !== undefined && profile.distance > 0 && (
                <span className="ml-2 font-semibold text-white/80">
                  • {formatUtils.formatDistance(profile.distance)} away
                </span>
              )}
            </span>
          </div>

          {/* Interests - pill style with glass effect */}
          <div className="flex flex-wrap gap-2.5">
            {profile.interests.slice(0, 5).map((interest) => (
              <div
                key={interest}
                className="px-4 py-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium text-white shadow-sm"
              >
                {interest}
              </div>
            ))}

            {profile.interests.length > 5 && (
              <div className="px-4 py-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium text-white shadow-sm">
                +{profile.interests.length - 5}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SwipebleCard;
