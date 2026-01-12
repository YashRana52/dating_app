"use client";

import { ONBOARDING_STEPS } from "@/lib/common-utils";
import { UserProfile } from "@/lib/types";
import { useState, useCallback } from "react";

export type { UserProfile };

export const useOnboarding = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [profile, setProfile] = useState<UserProfile>({
    uid: "",
    name: "",
    email: "",
    age: 18,
    gender: "",
    phone: "",
    interests: [],
    height: "",
    weight: "",
    lookingFor: [],
    ageRange: [18, 40],
    drinking: "",
    smoking: "",
    workout: "",
    diet: "",
    pets: "",
    location: {
      latitude: 0,
      longitude: 0,
      city: "",
      state: "",
      country: "",
      address: "",
    },
    photos: [],
    additionalInfo: {
      jobTitle: "",
      company: "",
      educationLevel: "",
      university: "",
      bio: "",
    },
    isVerifiedProfile: false,
    profileComplete: false,
    isOnline: false,
  });

  /* ---------- Helpers ---------- */
  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, ONBOARDING_STEPS.length));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  // Improved: Avoid recursion in step 6 to prevent potential stack issues
  // Direct checks for previous steps
  const getStepCompletion = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 1:
          return Boolean(
            profile.name?.trim() &&
              profile.age > 0 &&
              profile.gender?.trim() &&
              profile.phone?.trim()
          );
        case 2:
          return Boolean(
            Array.isArray(profile.interests) && profile.interests.length > 0
          );
        case 3:
          return Boolean(
            profile.height?.trim() &&
              profile.weight?.trim() &&
              Array.isArray(profile.lookingFor) &&
              profile.lookingFor.length > 0 &&
              Array.isArray(profile.ageRange) &&
              profile.ageRange.length === 2
          );
        case 4:
          return Boolean(
            profile.drinking?.trim() &&
              profile.smoking?.trim() &&
              profile.workout?.trim() &&
              profile.diet?.trim() &&
              profile.pets?.trim()
          );
        case 5:
          return Boolean(
            profile.location?.latitude !== 0 &&
              profile.location?.longitude !== 0 &&
              profile.location?.city?.trim()
          );
        case 6:
          // Direct previous steps check (no recursion)
          const prevStepsComplete =
            Boolean(
              profile.name?.trim() &&
                profile.age > 0 &&
                profile.gender?.trim() &&
                profile.phone?.trim()
            ) &&
            Boolean(
              Array.isArray(profile.interests) && profile.interests.length > 0
            ) &&
            Boolean(
              profile.height?.trim() &&
                profile.weight?.trim() &&
                Array.isArray(profile.lookingFor) &&
                profile.lookingFor.length > 0 &&
                Array.isArray(profile.ageRange) &&
                profile.ageRange.length === 2
            ) &&
            Boolean(
              profile.drinking?.trim() &&
                profile.smoking?.trim() &&
                profile.workout?.trim() &&
                profile.diet?.trim() &&
                profile.pets?.trim()
            ) &&
            Boolean(
              profile.location?.latitude !== 0 &&
                profile.location?.longitude !== 0 &&
                profile.location?.city?.trim()
            );

          return (
            prevStepsComplete &&
            Boolean(
              profile.additionalInfo?.jobTitle?.trim() &&
                profile.additionalInfo?.company?.trim() &&
                profile.additionalInfo?.educationLevel?.trim() &&
                profile.additionalInfo?.university?.trim() &&
                profile.additionalInfo?.bio?.trim()
            )
          );
        case 7:
          return Boolean(
            Array.isArray(profile.photos) && profile.photos.length >= 2
          );
        default:
          return false;
      }
    },
    [profile]
  );

  const getOverallCompletion = useCallback((): number => {
    const totalSteps = ONBOARDING_STEPS.length;
    const completedSteps = ONBOARDING_STEPS.filter((step) =>
      getStepCompletion(step.id)
    ).length;
    return totalSteps ? Math.round((completedSteps / totalSteps) * 100) : 0;
  }, [getStepCompletion]); // Better dependency: on getStepCompletion

  const goToStep = useCallback(
    (step: number) => {
      if (step < 1 || step > ONBOARDING_STEPS.length) return;

      // Strict sequential access
      if (step > 1 && step !== 6 && !getStepCompletion(step - 1)) {
        return;
      }

      // Special for step 6
      if (step === 6) {
        const prevComplete =
          getStepCompletion(1) &&
          getStepCompletion(2) &&
          getStepCompletion(3) &&
          getStepCompletion(4) &&
          getStepCompletion(5);
        if (!prevComplete) return;
      }

      setCurrentStep(step);
    },
    [getStepCompletion]
  );

  const resetOnboarding = useCallback(() => {
    setCurrentStep(1);
    setProfile({
      uid: "",
      name: "",
      email: "",
      age: 18,
      gender: "",
      phone: "",
      interests: [],
      height: "",
      weight: "",
      lookingFor: [],
      ageRange: [18, 40],
      drinking: "",
      smoking: "",
      workout: "",
      diet: "",
      pets: "",
      location: {
        latitude: 0,
        longitude: 0,
        city: "",
        state: "",
        country: "",
        address: "",
      },
      photos: [],
      additionalInfo: {
        jobTitle: "",
        company: "",
        educationLevel: "",
        university: "",
        bio: "",
      },
      isVerifiedProfile: false,
      profileComplete: false,
      isOnline: false,
    });
  }, []);

  return {
    currentStep,
    setCurrentStep,
    profile,
    updateProfile,
    nextStep,
    prevStep,
    goToStep,
    getStepCompletion,
    getOverallCompletion,
    resetOnboarding,
  };
};
