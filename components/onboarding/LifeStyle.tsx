import { UserProfile } from "@/lib/types";
import { Cigarette, Dog, Dumbbell, Heart, Utensils, Wine } from "lucide-react";
import React from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  DIET_OPTIONS,
  DRINKING_OPTIONS,
  PETS_OPTIONS,
  SMOKING_OPTIONS,
  WORKOUT_OPTIONS,
} from "@/lib/common-utils";
import { cn } from "@/lib/utils";

interface LifeStyleProps {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

function LifeStyle({ profile, updateProfile }: LifeStyleProps) {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative inline-block mb-10">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-2xl opacity-70 animate-pulse" />
          <div className="relative inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 p-1 shadow-2xl">
            <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
              <Heart
                className="h-14 w-14 text-white drop-shadow-2xl"
                fill="currentColor"
                strokeWidth={2}
              />
            </div>
          </div>
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 tracking-tight">
          Tell us about your lifestyle
        </h2>

        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Small details make big connections
        </p>
      </div>

      {/* Lifestyle Selects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Drinking */}
        <ModernLifestyleSelect
          label="Drinking"
          icon={<Wine className="h-7 w-7 text-pink-600" />}
          placeholder="How often do you drink?"
          options={DRINKING_OPTIONS}
          value={profile.drinking || ""}
          onChange={(value) => updateProfile({ drinking: value })}
        />

        {/* Smoking */}
        <ModernLifestyleSelect
          label="Smoking"
          icon={<Cigarette className="h-7 w-7 text-pink-600" />}
          placeholder="Your smoking habits?"
          options={SMOKING_OPTIONS}
          value={profile.smoking || ""}
          onChange={(value) => updateProfile({ smoking: value })}
        />

        {/* Workout */}
        <ModernLifestyleSelect
          label="Workout"
          icon={<Dumbbell className="h-7 w-7 text-pink-600" />}
          placeholder="How active are you?"
          options={WORKOUT_OPTIONS}
          value={profile.workout || ""}
          onChange={(value) => updateProfile({ workout: value })}
        />

        {/* Diet */}
        <ModernLifestyleSelect
          label="Diet"
          icon={<Utensils className="h-7 w-7 text-pink-600" />}
          placeholder="Your dietary preferences?"
          options={DIET_OPTIONS}
          value={profile.diet || ""}
          onChange={(value) => updateProfile({ diet: value })}
        />

        {/* Pets - Full width on mobile */}
        <ModernLifestyleSelect
          label="Pets"
          icon={<Dog className="h-7 w-7 text-pink-600" />}
          placeholder="Do you have pets?"
          options={PETS_OPTIONS}
          value={profile.pets || ""}
          onChange={(value) => updateProfile({ pets: value })}
          className="md:col-span-2 max-w-2xl mx-auto"
        />
      </div>
    </div>
  );
}

// Modern Select Component with Icon in Label + Premium Dropdown
interface ModernLifestyleSelectProps {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  options: { value: string; label: string; icon?: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function ModernLifestyleSelect({
  label,
  icon,
  placeholder,
  options,
  value,
  onChange,
  className,
}: ModernLifestyleSelectProps) {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={cn("space-y-4", className)}>
      <Label className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-4">
        {icon}
        <span>{label}</span>
      </Label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={cn(
            "h-16 text-lg rounded-2xl border-2 transition-all pl-6 pr-12",
            "bg-white/70 dark:bg-slate-800/70 backdrop-blur-md",
            "border-slate-200 dark:border-slate-700",
            "focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20",
            "data-[placeholder]:text-slate-400"
          )}
        >
          <SelectValue placeholder={placeholder}>
            {selectedOption ? (
              <div className="flex items-center gap-4">
                {selectedOption.icon && (
                  <span className="text-2xl">{selectedOption.icon}</span>
                )}
                <span className="font-medium">{selectedOption.label}</span>
              </div>
            ) : null}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="rounded-2xl border-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-2xl">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="py-4 px-6 text-base cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
            >
              <div className="flex items-center gap-5">
                {option.icon && <span className="text-2xl">{option.icon}</span>}
                <span className="font-medium">{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default LifeStyle;
