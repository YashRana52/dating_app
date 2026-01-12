"use client";

import React from "react";
import { UserProfile } from "@/lib/types";
import { User, Phone, Users, Cake } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { GENDER_OPTIONS } from "@/lib/common-utils";

interface BasicInfoStepProps {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

export default function BasicInfoStep({
  profile,
  updateProfile,
}: BasicInfoStepProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl mb-5">
          <User className="h-8 w-8" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Let's get to know you
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
          Just a few basic details to personalize your experience
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-8">
        {/* Full Name */}
        <div className="space-y-2.5">
          <Label
            htmlFor="name"
            className="text-base font-medium flex items-center gap-2"
          >
            <User className="h-4.5 w-4.5 text-indigo-600" />
            Full Name
          </Label>
          <Input
            id="name"
            value={profile.name ?? ""}
            onChange={(e) => updateProfile({ name: e.target.value })}
            placeholder="Yash Rana"
            className={cn(
              "h-13 text-base rounded-xl border-muted-foreground/30",
              "transition-all duration-200",
              "focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500",
              "bg-background/60 backdrop-blur-sm"
            )}
          />
        </div>

        {/* Age + Gender – side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* Age Input */}
          <div className="space-y-2.5">
            <Label
              htmlFor="age"
              className="text-base font-medium flex items-center gap-2"
            >
              <Cake className="h-4.5 w-4.5 text-indigo-600" />
              Age
            </Label>
            <Input
              id="age"
              type="number"
              min={13}
              max={120}
              value={profile.age ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                updateProfile({ age: val === "" ? undefined : Number(val) });
              }}
              placeholder="25"
              className={cn(
                "h-13 text-base rounded-xl border-muted-foreground/30",
                "transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                "focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500",
                "bg-background/60 backdrop-blur-sm"
              )}
            />
            <p className="text-xs text-muted-foreground">
              Must be 18+ years old
            </p>
          </div>

          {/* Gender Selection */}
          <div className="space-y-2.5">
            <Label className="text-base font-medium flex items-center gap-2">
              <Users className="h-4.5 w-4.5 text-indigo-600" />
              Gender
            </Label>

            <div className="grid grid-cols-3 gap-3">
              {GENDER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateProfile({ gender: option.value })}
                  className={cn(
                    "group relative flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all duration-200",
                    profile.gender === option.value
                      ? "border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/30 shadow-sm"
                      : "border-border/60 hover:border-indigo-400/70 hover:bg-accent/40",
                    "active:scale-[0.98]"
                  )}
                >
                  <span className="text-3xl transition-transform group-hover:scale-110">
                    {option.icon}
                  </span>
                  <span className="text-sm font-medium">{option.label}</span>

                  {profile.gender === option.value && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center border-2 border-background">
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-2.5">
          <Label
            htmlFor="phone"
            className="text-base font-medium flex items-center gap-2"
          >
            <Phone className="h-4.5 w-4.5 text-indigo-600" />
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={profile.phone ?? ""}
            onChange={(e) => updateProfile({ phone: e.target.value })}
            placeholder="+91 98765 43210"
            className={cn(
              "h-13 text-base rounded-xl border-muted-foreground/30",
              "transition-all duration-200",
              "focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500",
              "bg-background/60 backdrop-blur-sm"
            )}
          />
        </div>
      </div>
    </div>
  );
}
