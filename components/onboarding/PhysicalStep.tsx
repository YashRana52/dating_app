import {
  generateHeightOptions,
  generateWeightOptions,
  LOOKING_FOR_OPTIONS,
  ONBOARDING_CONSTANTS,
} from "@/lib/common-utils";
import { UserProfile } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import {
  CalendarRange,
  CheckIcon,
  Ruler,
  SearchIcon,
  Weight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

interface PhysicalStepProps {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

function PhysicalStep({ profile, updateProfile }: PhysicalStepProps) {
  const [minAge, setMinAge] = useState<number>(
    profile.ageRange?.[0] ?? ONBOARDING_CONSTANTS.DEFAULT_AGE_MIN
  );
  const [maxAge, setMaxAge] = useState<number>(
    profile.ageRange?.[1] ?? ONBOARDING_CONSTANTS.DEFAULT_AGE_MAX
  );

  useEffect(() => {
    setMinAge(profile.ageRange?.[0] ?? ONBOARDING_CONSTANTS.DEFAULT_AGE_MIN);
    setMaxAge(profile.ageRange?.[1] ?? ONBOARDING_CONSTANTS.DEFAULT_AGE_MAX);
  }, [profile.ageRange]);

  const handleAgeBlur = () => {
    const validMin = Math.min(
      Math.max(
        ONBOARDING_CONSTANTS.MIN_AGE,
        minAge || ONBOARDING_CONSTANTS.MIN_AGE
      ),
      maxAge - 1
    );
    const validMax = Math.max(validMin + 1, maxAge || validMin + 5);
    updateProfile({ ageRange: [validMin, validMax] });
  };

  const handleLookingForToggle = (value: string) => {
    const current = profile.lookingFor || [];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    updateProfile({ lookingFor: updated });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Height & Weight - Side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        {/* Height */}
        <div className="space-y-3">
          <Label className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Ruler className="h-5 w-5 text-pink-500" />
            Your Height
          </Label>

          <Select
            value={profile.height || ""}
            onValueChange={(value) => updateProfile({ height: value })}
          >
            <SelectTrigger
              className={cn(
                "h-14 md:h-16 text-base md:text-lg rounded-xl md:rounded-2xl border-2 transition-all px-5",
                "bg-white/80 dark:bg-slate-800/80 backdrop-blur",
                "border-slate-200 dark:border-slate-700",
                "focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20",
                "hover:border-pink-400"
              )}
            >
              <SelectValue placeholder="Select your height" />
            </SelectTrigger>

            <SelectContent className="rounded-xl md:rounded-2xl border bg-white/95 dark:bg-slate-800/95 backdrop-blur shadow-2xl max-h-80">
              {generateHeightOptions().map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="py-3 px-5 text-base cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Weight */}
        <div className="space-y-3">
          <Label className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Weight className="h-5 w-5 text-pink-500" />
            Your Weight
          </Label>

          <Select
            value={profile.weight || ""}
            onValueChange={(value) => updateProfile({ weight: value })}
          >
            <SelectTrigger
              className={cn(
                "h-14 md:h-16 text-base md:text-lg rounded-xl md:rounded-2xl border-2 transition-all px-5",
                "bg-white/80 dark:bg-slate-800/80 backdrop-blur",
                "border-slate-200 dark:border-slate-700",
                "focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20",
                "hover:border-pink-400"
              )}
            >
              <SelectValue placeholder="Select your weight" />
            </SelectTrigger>

            <SelectContent className="rounded-xl md:rounded-2xl border bg-white/95 dark:bg-slate-800/95 backdrop-blur shadow-2xl max-h-80">
              {generateWeightOptions().map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="py-3 px-5 text-base cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Looking For - Glassmorphic Pills */}
      <div className="space-y-6">
        <Label className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-3">
          <SearchIcon className="h-6 w-6 text-pink-600" />
          What are you looking for?
        </Label>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {LOOKING_FOR_OPTIONS.map((option) => {
            const isSelected = profile.lookingFor?.includes(option.value);

            return (
              <button
                key={option.value}
                onClick={() => handleLookingForToggle(option.value)}
                className={cn(
                  "group relative overflow-hidden rounded-full px-8 py-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 shadow-xl",
                  "backdrop-blur-md border border-white/20",
                  isSelected
                    ? "bg-gradient-to-br from-pink-500/40 via-purple-500/40 to-indigo-500/40 text-white scale-105 ring-4 ring-pink-500/40"
                    : "bg-white/30 dark:bg-slate-800/30 hover:bg-white/50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:scale-105"
                )}
              >
                {/* Shiny gleam on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <span className="text-4xl">{option.icon}</span>
                <span className="font-medium text-base">
                  {option.label || option.value}
                </span>

                {isSelected && (
                  <CheckIcon className="absolute top-3 right-3 h-6 w-6 text-white opacity-90" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Age Range Preference */}
      <div className="space-y-6">
        <Label className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-3">
          <CalendarRange className="h-6 w-6 text-pink-600" />
          Preferred Age Range
        </Label>

        <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
          <div className="space-y-2">
            <Label className="text-base text-slate-600 dark:text-slate-400">
              Minimum Age
            </Label>
            <Input
              type="number"
              min="18"
              max="100"
              value={minAge || ""}
              onChange={(e) =>
                setMinAge(e.target.value === "" ? 0 : parseInt(e.target.value))
              }
              onBlur={handleAgeBlur}
              className={cn(
                "h-16 text-xl text-center rounded-2xl border-2",
                "bg-white/70 dark:bg-slate-800/70 backdrop-blur",
                "border-slate-200 dark:border-slate-700",
                "focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20"
              )}
              placeholder="18"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base text-slate-600 dark:text-slate-400">
              Maximum Age
            </Label>
            <Input
              type="number"
              min="18"
              max="100"
              value={maxAge || ""}
              onChange={(e) =>
                setMaxAge(e.target.value === "" ? 0 : parseInt(e.target.value))
              }
              onBlur={handleAgeBlur}
              className={cn(
                "h-16 text-xl text-center rounded-2xl border-2",
                "bg-white/70 dark:bg-slate-800/70 backdrop-blur",
                "border-slate-200 dark:border-slate-700",
                "focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20"
              )}
              placeholder="30"
            />
          </div>
        </div>

        {/* Visual Range Indicator */}
        <div className="mt-6 text-center">
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Looking for ages{" "}
            <span className="font-bold text-pink-600">{minAge || 18}</span> to{" "}
            <span className="font-bold text-pink-600">{maxAge || 40}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PhysicalStep;
