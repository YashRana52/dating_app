"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  ArrowRight,
  ArrowLeftCircle,
  CheckIcon,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

import BasicInfoStep from "@/components/onboarding/BasicInfoStep";
import InterestedStep from "@/components/onboarding/InterestedStep";
import JobEducationBioStep from "@/components/onboarding/JobEducationBioStep";
import LifeStyle from "@/components/onboarding/LifeStyle";
import LocationStep from "@/components/onboarding/LocationStep";
import PhotoStep from "@/components/onboarding/PhotoStep";
import PhysicalStep from "@/components/onboarding/PhysicalStep";

import { ONBOARDING_STEPS } from "@/lib/common-utils";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useOnboarding } from "@/hooks/useOnboarding";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserProfile } from "@/lib/types";

function Page() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false); // Prevent race conditions

  const { user, logout } = useFirebaseAuth();
  const {
    currentStep,
    profile,
    updateProfile,
    nextStep,
    prevStep,
    goToStep,
    setCurrentStep,
    getOverallCompletion,
    getStepCompletion,
    resetOnboarding,
  } = useOnboarding();

  const steps = ONBOARDING_STEPS;

  // Logout
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Error logging out");
      console.error(error);
    }
  };

  // Save final profile
  const handleSaveProfile = async () => {
    if (!user?.uid) {
      toast.error("User not authenticated");
      return;
    }
    if (!profile.photos || profile.photos.length < 2) {
      toast.error("Please add at least 2 photos");
      return;
    }

    setSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        ...profile,
        uid: user.uid,
        email: user.email,
        profileComplete: true,
        isOnline: true,
        createdAt: new Date(),
        lastSeen: new Date(),
        isVerifiedProfile: true,
      });

      toast.success("Welcome to the dating world!");
      router.push("/");
    } catch (error) {
      toast.error("Error saving profile");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // Initialize: Load profile + FORCE step 1
  useEffect(() => {
    if (!user?.uid || initialized) return;

    const init = async () => {
      try {
        // Reset state first
        resetOnboarding();

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;

          if (data.profileComplete) {
            toast.success("Profile already complete!");
            router.push("/");
            return;
          }

          // Load existing data
          updateProfile(data);
        }

        // ALWAYS start from Step 1
        setCurrentStep(1);
        setInitialized(true);
      } catch (error) {
        console.error("Error initializing onboarding:", error);
        toast.error("Failed to load profile");
        resetOnboarding();
        setCurrentStep(1);
        setInitialized(true);
      }
    };

    init();
  }, [
    user?.uid,
    initialized,
    updateProfile,
    setCurrentStep,
    resetOnboarding,
    router,
  ]);

  // Safe renderStep – NO setState inside render
  const renderStep = useCallback(() => {
    // Step 6 guard
    if (currentStep === 6) {
      const prevComplete = [1, 2, 3, 4, 5].every((s) => getStepCompletion(s));
      if (!prevComplete) {
        // Don't change state here – just show Step 1
        return (
          <BasicInfoStep profile={profile} updateProfile={updateProfile} />
        );
      }
    }

    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep profile={profile} updateProfile={updateProfile} />
        );
      case 2:
        return (
          <InterestedStep profile={profile} updateProfile={updateProfile} />
        );
      case 3:
        return <PhysicalStep profile={profile} updateProfile={updateProfile} />;
      case 4:
        return <LifeStyle profile={profile} updateProfile={updateProfile} />;
      case 5:
        return <LocationStep profile={profile} updateProfile={updateProfile} />;
      case 6:
        return (
          <JobEducationBioStep
            profile={profile}
            updateProfile={updateProfile}
          />
        );
      case 7:
        return <PhotoStep profile={profile} updateProfile={updateProfile} />;
      default:
        return (
          <BasicInfoStep profile={profile} updateProfile={updateProfile} />
        );
    }
  }, [currentStep, profile, updateProfile, getStepCompletion]);

  const canProceed = getStepCompletion(currentStep);
  const isLastStep = currentStep === steps.length;

  // Show loader until initialized
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto mb-4" />
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Loading onboarding...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950">
      {/* MOBILE LAYOUT */}
      <div className="md:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 shadow-lg sticky top-0 z-50">
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={handleLogout}
              className="p-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 hover:bg-white/70 dark:hover:bg-slate-700/70 transition shadow-md"
            >
              <ArrowLeftCircle className="h-6 w-6 text-slate-700 dark:text-slate-300" />
            </button>

            <div className="text-center">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                Complete Your Profile
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {getOverallCompletion()}% Complete
              </p>
            </div>

            <div className="w-12" />
          </div>

          <Progress
            value={getOverallCompletion()}
            className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 mb-6"
          />

          {/* Mobile Steps */}
          <div className="flex items-center gap-2">
            {steps.map((step, index) => {
              const completed = getStepCompletion(step.id);
              const active = currentStep === step.id;
              const isLast = index === steps.length - 1;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => {
                      const accessible =
                        step.id === 1 || getStepCompletion(step.id - 1);
                      if (accessible) goToStep(step.id);
                    }}
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-md ${
                      active
                        ? "bg-indigo-600 text-white scale-110 ring-4 ring-indigo-300/40"
                        : completed
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {completed ? <CheckIcon className="h-5 w-5" /> : step.id}
                  </button>

                  {!isLast && (
                    <div className="flex-1 h-1 mx-1 rounded-full bg-slate-300 dark:bg-slate-600 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          completed
                            ? "bg-emerald-500 w-full"
                            : active
                            ? "bg-indigo-600 w-1/2"
                            : "w-0"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden md:flex min-h-screen">
        <aside className="w-96 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-r border-white/20 dark:border-slate-700/50 shadow-2xl p-8 flex flex-col">
          {/* Sidebar content same as before – unchanged */}
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Complete Profile
            </h1>
            <button
              onClick={handleLogout}
              className="p-4 rounded-2xl bg-white/30 dark:bg-slate-800/40 backdrop-blur hover:bg-white/50 dark:hover:bg-slate-700/60 transition-all shadow-inner"
            >
              <ArrowLeftCircle className="h-7 w-7 text-slate-700 dark:text-slate-200" />
            </button>
          </div>

          <div className="relative w-44 h-44 mx-auto mb-12">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                strokeWidth="12"
                className="text-slate-200/40 dark:text-slate-700/40"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#grad)"
                strokeWidth="12"
                strokeDasharray="263.89"
                strokeDashoffset={263.89 * (1 - getOverallCompletion() / 100)}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-5xl font-bold text-indigo-700 dark:text-indigo-300">
                {Math.round(getOverallCompletion())}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400 -mt-1">
                %
              </span>
            </div>
          </div>

          <nav className="flex-1 space-y-4">
            {steps.map((step, index) => {
              const completed = getStepCompletion(step.id);
              const active = currentStep === step.id;
              const isLast = index === steps.length - 1;

              return (
                <div key={step.id} className="relative">
                  <button
                    onClick={() => {
                      const accessible =
                        step.id === 1 || getStepCompletion(step.id - 1);
                      if (accessible) goToStep(step.id);
                    }}
                    className={`w-full flex items-center space-x-5 rounded-2xl px-6 py-5 transition-all duration-300 group ${
                      active
                        ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 shadow-xl scale-105"
                        : completed
                        ? "bg-emerald-500/10 hover:bg-emerald-500/20"
                        : "bg-white/30 dark:bg-slate-800/30 hover:bg-white/50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <div
                      className={`relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                        active
                          ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white scale-110"
                          : completed
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {completed ? (
                        <CheckIcon className="h-7 w-7" />
                      ) : (
                        step.icon
                      )}
                    </div>

                    <div className="text-left flex-1">
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {step.title}
                      </p>
                      <p
                        className={`text-sm ${
                          completed
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {completed ? "Completed ✓" : "Pending"}
                      </p>
                    </div>
                  </button>

                  {!isLast && (
                    <div className="absolute left-7 top-20 w-0.5 h-16 bg-slate-300 dark:bg-slate-600">
                      <div
                        className={`w-full transition-all duration-700 ${
                          completed
                            ? "bg-emerald-500 h-full"
                            : active
                            ? "bg-indigo-500 h-1/2"
                            : "h-0"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 md:p-12 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 px-10 py-6 border-b border-white/20 dark:border-slate-700/30">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
                  {steps.find((s) => s.id === currentStep)?.title ||
                    "Complete Your Profile"}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Step {currentStep} of {steps.length}
                </p>
              </div>

              <div className="p-8 md:p-12 min-h-[400px]">
                {renderStep()}

                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-12">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`group flex items-center space-x-3 px-8 py-4 rounded-2xl font-medium transition-all duration-300 ${
                      currentStep === 1
                        ? "bg-slate-200/50 dark:bg-slate-800/50 text-slate-400 cursor-not-allowed"
                        : "bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-700/80 shadow-lg hover:shadow-xl hover:-translate-y-1"
                    }`}
                  >
                    <ArrowLeft
                      className={`h-5 w-5 transition-transform group-hover:-translate-x-1 ${
                        currentStep === 1
                          ? ""
                          : "text-indigo-600 dark:text-indigo-400"
                      }`}
                    />
                    <span>Previous</span>
                  </button>

                  {isLastStep ? (
                    <button
                      onClick={handleSaveProfile}
                      disabled={
                        !canProceed || saving || profile.photos?.length < 2
                      }
                      className={`group relative overflow-hidden px-10 py-4 rounded-2xl font-semibold text-white shadow-2xl transition-all duration-500 ${
                        canProceed && !saving && profile.photos?.length >= 2
                          ? "bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 hover:scale-105"
                          : "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-70"
                      }`}
                    >
                      <span className="relative z-10 flex items-center space-x-3">
                        {saving ? (
                          <>
                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Saving Profile...</span>
                          </>
                        ) : (
                          <>
                            <span>Complete Profile</span>
                            <CheckIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
                          </>
                        )}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={nextStep}
                      disabled={!canProceed}
                      className={`group relative overflow-hidden px-10 py-4 rounded-2xl font-semibold text-white shadow-2xl transition-all duration-500 ${
                        canProceed
                          ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-105"
                          : "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-70"
                      }`}
                    >
                      <span className="relative z-10 flex items-center space-x-3">
                        <span>Next Step</span>
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
