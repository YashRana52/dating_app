import { INTERESTS_OPTIONS } from "@/lib/common-utils";
import { UserProfile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckIcon, Heart } from "lucide-react";
import React from "react";

interface InterestedStepProps {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

function InterestedStep({ profile, updateProfile }: InterestedStepProps) {
  const handleInterestToggle = (interest: string) => {
    const currentInterest = profile.interests || [];

    const newInterests = currentInterest.includes(interest)
      ? currentInterest.filter((i) => i !== interest)
      : [...currentInterest, interest];

    updateProfile({ interests: newInterests });
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-xl opacity-70 animate-pulse" />
          <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 p-1 shadow-2xl">
            <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Heart
                className="h-12 w-12 text-white drop-shadow-lg"
                fill="currentColor"
                strokeWidth={2}
              />
            </div>
          </div>
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-5 tracking-tight">
          What do you truly love doing?
        </h2>

        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Choose up to{" "}
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            8 passions
          </span>{" "}
          that truly define you
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {INTERESTS_OPTIONS.map((interest) => {
          const isSelected = profile.interests.includes(interest.name);

          return (
            <button
              key={interest.name}
              onClick={() => handleInterestToggle(interest.name)}
              disabled={profile.interests.length >= 8 && !isSelected} // Disable if limit reached and not selected
              className={cn(
                "group relative overflow-hidden rounded-full px-6 py-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 shadow-lg",
                "backdrop-blur-md border border-white/20",
                isSelected
                  ? "bg-gradient-to-br from-pink-500/40 via-purple-500/40 to-indigo-500/40 text-white scale-105 shadow-2xl ring-4 ring-purple-500/30"
                  : "bg-white/30 dark:bg-slate-800/30 hover:bg-white/50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:scale-105 hover:shadow-xl",
                profile.interests.length >= 8 &&
                  !isSelected &&
                  "opacity-50 cursor-not-allowed"
              )}
            >
              {/* Shiny hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <span className="text-3xl">{interest.icon}</span>
              <span className="font-semibold text-sm">{interest.name}</span>

              {isSelected && (
                <CheckIcon className="absolute top-2 right-2 h-5 w-5 text-white opacity-80" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Count & Limit Warning */}
      <div className="mt-10 text-center">
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Selected:{" "}
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            {profile.interests.length}
          </span>{" "}
          / 8
        </p>

        {profile.interests.length >= 8 && (
          <p className="mt-4 text-sm text-amber-600 dark:text-amber-400 flex items-center justify-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Maximum 8 interests reached. Deselect some to choose others.
          </p>
        )}

        {profile.interests.length === 0 && (
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Pick at least a few to help us find better matches for you!
          </p>
        )}
      </div>
    </div>
  );
}
export default InterestedStep;
