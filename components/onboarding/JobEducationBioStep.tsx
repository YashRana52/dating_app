import { UserProfile } from "@/lib/types";
import {
  GraduationCap,
  Briefcase,
  Building2,
  BookOpen,
  School,
  FileText,
} from "lucide-react";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";

interface JobEducationBioStepProps {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

function JobEducationBioStep({
  profile,
  updateProfile,
}: JobEducationBioStepProps) {
  const additionalInfo = profile.additionalInfo ?? {};
  const updateAdditionalInfo = (
    updates: Partial<UserProfile["additionalInfo"]>
  ) => {
    updateProfile({
      additionalInfo: {
        ...additionalInfo,
        ...updates,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-2xl mb-8">
          <div className="w-full h-full rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center">
            <GraduationCap className="h-12 w-12 text-white" />
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Career & Education
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Tell us about your professional journey and academic background.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-12">
        {/* Job Title & Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group">
            <Label className="flex items-center gap-3 text-lg font-medium mb-3 text-foreground">
              <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                <Briefcase className="h-5 w-5" />
              </div>
              Job Title
            </Label>
            <Input
              value={additionalInfo.jobTitle || ""}
              onChange={(e) =>
                updateAdditionalInfo({ jobTitle: e.target.value })
              }
              placeholder="e.g. Senior Software Engineer"
              className={cn(
                "h-14 text-lg rounded-2xl border-2",
                "bg-background/80 backdrop-blur-sm",
                "border-border/50",
                "focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20",
                "transition-all duration-300",
                "group-focus-within:shadow-lg group-focus-within:shadow-indigo-500/10"
              )}
            />
          </div>

          <div className="group">
            <Label className="flex items-center gap-3 text-lg font-medium mb-3 text-foreground">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                <Building2 className="h-5 w-5" />
              </div>
              Company
            </Label>
            <Input
              value={additionalInfo.company || ""}
              onChange={(e) =>
                updateAdditionalInfo({ company: e.target.value })
              }
              placeholder="e.g. Google, StartupXYZ"
              className={cn(
                "h-14 text-lg rounded-2xl border-2",
                "bg-background/80 backdrop-blur-sm",
                "border-border/50",
                "focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20",
                "transition-all duration-300",
                "group-focus-within:shadow-lg group-focus-within:shadow-purple-500/10"
              )}
            />
          </div>
        </div>

        {/* Education */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group">
            <Label className="flex items-center gap-3 text-lg font-medium mb-3 text-foreground">
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                <BookOpen className="h-5 w-5" />
              </div>
              Education Level
            </Label>
            <Input
              value={additionalInfo.educationLevel || ""}
              onChange={(e) =>
                updateAdditionalInfo({ educationLevel: e.target.value })
              }
              placeholder="e.g. Bachelor's, Master's, PhD"
              className={cn(
                "h-14 text-lg rounded-2xl border-2",
                "bg-background/80 backdrop-blur-sm",
                "border-border/50",
                "focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20",
                "transition-all duration-300",
                "group-focus-within:shadow-lg group-focus-within:shadow-emerald-500/10"
              )}
            />
          </div>

          <div className="group">
            <Label className="flex items-center gap-3 text-lg font-medium mb-3 text-foreground">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                <School className="h-5 w-5" />
              </div>
              University / College
            </Label>
            <Input
              value={additionalInfo.university || ""}
              onChange={(e) =>
                updateAdditionalInfo({ university: e.target.value })
              }
              placeholder="e.g. Stanford University"
              className={cn(
                "h-14 text-lg rounded-2xl border-2",
                "bg-background/80 backdrop-blur-sm",
                "border-border/50",
                "focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20",
                "transition-all duration-300",
                "group-focus-within:shadow-lg group-focus-within:shadow-amber-500/10"
              )}
            />
          </div>
        </div>

        {/* Bio */}
        <div className="group">
          <Label className="flex items-center gap-3 text-lg font-medium mb-3 text-foreground">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
              <FileText className="h-5 w-5" />
            </div>
            Short Bio
          </Label>
          <Textarea
            rows={5}
            value={additionalInfo.bio || ""}
            onChange={(e) => updateAdditionalInfo({ bio: e.target.value })}
            placeholder="A brief introduction about yourself, your passions, and expertise..."
            className={cn(
              "min-h-[160px] rounded-2xl border-2 text-base",
              "bg-background/80 backdrop-blur-sm",
              "border-border/50 resize-none",
              "focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20",
              "transition-all duration-300",
              "group-focus-within:shadow-lg group-focus-within:shadow-rose-500/10"
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default JobEducationBioStep;
