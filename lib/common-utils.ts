// Common utilities and static data for the dating app

// ============================================================================
// CONSTANTS
// ============================================================================

export const MOBILE_BREAKPOINT = 768;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_PHOTOS = 6;

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
  ACTIVE_TAB: "activeTab",
  ONBOARDING_STEP: "onboarding_step",
  ONBOARDING_PROFILE: "onboarding_profile",
};

// ============================================================================
// ONBOARDING STEPS
// ============================================================================

export const ONBOARDING_STEPS = [
  {
    id: 1,
    title: "Basic Info",
    icon: "👤",
    description: "Tell us about yourself",
  },
  { id: 2, title: "Interests", icon: "❤️", description: "What do you love?" },
  {
    id: 3,
    title: "Physical & Preferences",
    icon: "📏",
    description: "Your preferences",
  },
  { id: 4, title: "Lifestyle", icon: "🏃‍♂️", description: "How you live" },
  { id: 5, title: "Location", icon: "📍", description: "Where are you?" },
  { id: 6, title: "Career & About", icon: "💼", description: "Tell us more" },
  { id: 7, title: "Photos", icon: "📸", description: "Show your best self" },
];

// ============================================================================
// FORM OPTIONS
// ============================================================================

export const INTERESTS_OPTIONS = [
  { name: "Travel", icon: "✈️" },
  { name: "Music", icon: "🎵" },
  { name: "Movies", icon: "🎬" },
  { name: "Sports", icon: "⚽" },
  { name: "Reading", icon: "📚" },
  { name: "Cooking", icon: "👨‍🍳" },
  { name: "Art", icon: "🎨" },
  { name: "Photography", icon: "📸" },
  { name: "Dancing", icon: "💃" },
  { name: "Hiking", icon: "🥾" },
  { name: "Gaming", icon: "🎮" },
  { name: "Fitness", icon: "💪" },
  { name: "Fashion", icon: "👗" },
  { name: "Technology", icon: "💻" },
  { name: "Food", icon: "🍕" },
  { name: "Animals", icon: "🐕" },
  { name: "Yoga", icon: "🧘‍♀️" },
  { name: "Coffee", icon: "☕" },
  { name: "Wine", icon: "🍷" },
  { name: "Beach", icon: "🏖️" },
];

export const GENDER_OPTIONS = [
  { value: "male", label: "Male", icon: "👨" },
  { value: "female", label: "Female", icon: "👩" },
  { value: "non-binary", label: "Non-binary", icon: "🏳️‍⚧️" },
  { value: "other", label: "Other", icon: "🏳️‍🌈" },
];

export const DRINKING_OPTIONS = [
  { value: "never", label: "Never", icon: "🚫" },
  { value: "rarely", label: "Rarely", icon: "🍷" },
  { value: "socially", label: "Socially", icon: "🥂" },
  { value: "regularly", label: "Regularly", icon: "🍺" },
  { value: "prefer not to say", label: "Prefer not to say", icon: "🤐" },
];

export const SMOKING_OPTIONS = [
  { value: "never", label: "Never", icon: "🚫" },
  { value: "rarely", label: "Rarely", icon: "🚬" },
  { value: "socially", label: "Socially", icon: "💨" },
  { value: "regularly", label: "Regularly", icon: "🚭" },
  { value: "trying to quit", label: "Trying to quit", icon: "🎯" },
  { value: "prefer not to say", label: "Prefer not to say", icon: "🤐" },
];

export const WORKOUT_OPTIONS = [
  { value: "never", label: "Never", icon: "😴" },
  { value: "rarely", label: "Rarely", icon: "🏃‍♂️" },
  { value: "weekly", label: "Weekly", icon: "💪" },
  { value: "daily", label: "Daily", icon: "🔥" },
];

export const DIET_OPTIONS = [
  { value: "omnivore", label: "Omnivore", icon: "🍖" },
  { value: "vegetarian", label: "Vegetarian", icon: "🥗" },
  { value: "vegan", label: "Vegan", icon: "🌱" },
  { value: "pescatarian", label: "Pescatarian", icon: "🐟" },
  { value: "keto", label: "Keto", icon: "🥑" },
  { value: "other", label: "Other", icon: "🍽️" },
];

export const PETS_OPTIONS = [
  { value: "dog lover", label: "Dog lover", icon: "🐕" },
  { value: "cat lover", label: "Cat lover", icon: "🐱" },
  { value: "both", label: "Both", icon: "🐾" },
  { value: "neither", label: "Neither", icon: "🚫" },
  { value: "prefer not to say", label: "Prefer not to say", icon: "🤐" },
];

export const LOOKING_FOR_OPTIONS = [
  { value: "relationship", label: "Long-term relationship", icon: "💕" },
  { value: "casual", label: "Something casual", icon: "😊" },
  { value: "friendship", label: "New friends", icon: "👥" },
  { value: "not-sure", label: "Still figuring it out", icon: "🤔" },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// File validation utilities
export const fileUtils = {
  isValidImage: (file: File): boolean => {
    return file.type.startsWith("image/");
  },

  isValidSize: (file: File, maxSizeMB: number = 10): boolean => {
    return file.size <= maxSizeMB * 1024 * 1024;
  },

  validateFiles: (
    files: FileList | File[] | null, // ✅ accept File[] too
    maxFiles: number = MAX_PHOTOS
  ): File[] => {
    if (!files) return [];

    return Array.from(files).filter((file) => {
      return fileUtils.isValidImage(file) && fileUtils.isValidSize(file);
    });
  },
};

// Profile completion calculation
export const calculateProfileCompletion = (profile: any): number => {
  const fields = [
    profile.name,
    profile.additionalInfo?.bio,
    profile.additionalInfo?.jobTitle,
    profile.additionalInfo?.educationLevel,
    profile.additionalInfo?.university,
    profile.additionalInfo?.company,
    profile.photos?.length > 0,
    profile.interests?.length > 0,
    profile.height,
    profile.drinking,
    profile.smoking,
    profile.workout,
  ];

  const completed = fields.filter(Boolean).length;
  return Math.round((completed / fields.length) * 100);
};

// Local storage utilities
export const localStorageUtils = {
  get: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  },

  set: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
  },

  remove: (key: string): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },

  clear: (): void => {
    if (typeof window === "undefined") return;
    localStorage.clear();
  },
};

// Height options generator
export const generateHeightOptions = (): Array<{
  value: string;
  label: string;
}> => {
  const options = [];

  // Feet 4'0" to 6'11"
  for (let feet = 4; feet <= 6; feet++) {
    for (let inches = 0; inches < 12; inches++) {
      if (feet === 6 && inches > 11) break;

      const totalInches = feet * 12 + inches;
      const cm = Math.round(totalInches * 2.54);

      options.push({
        value: `${feet}'${inches.toString().padStart(2, "0")}"`,
        label: `${feet}'${inches.toString().padStart(2, "0")}" (${cm}cm)`,
      });
    }
  }

  return options;
};

// Age range options
export const generateAgeRangeOptions = (): Array<{
  value: string;
  label: string;
}> => {
  const options = [];

  for (let age = 18; age <= 100; age++) {
    options.push({
      value: age.toString(),
      label: age.toString(),
    });
  }

  return options;
};

// Distance options
export const DISTANCE_OPTIONS = [
  { value: "1", label: "1 mile" },
  { value: "5", label: "5 miles" },
  { value: "10", label: "10 miles" },
  { value: "25", label: "25 miles" },
  { value: "50", label: "50 miles" },
  { value: "100", label: "100 miles" },
  { value: "250", label: "250+ miles" },
];

// Weight options generator
export const generateWeightOptions = (): Array<{
  value: string;
  label: string;
}> => {
  return Array.from({ length: 100 }, (_, i) => {
    const lbs = 100 + i * 2;
    const kg = Math.round(lbs * 0.453592);
    return {
      value: `${lbs} lbs (${kg} kg)`,
      label: `${lbs} lbs (${kg} kg)`,
    };
  });
};

// ============================================================================
// RESPONSIVE UTILITIES
// ============================================================================

export const responsiveUtils = {
  isMobile: (): boolean => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  },

  isTablet: (): boolean => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < 1024;
  },

  isDesktop: (): boolean => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 1024;
  },
};

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export const validationUtils = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  },

  isValidAge: (age: number): boolean => {
    return age >= 18 && age <= 100;
  },

  isValidName: (name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length <= 50;
  },
};

// ============================================================================
// GEOLOCATION UTILITIES
// ============================================================================

export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

export const getLastSeenText = (lastSeen: any) => {
  if (!lastSeen) return "Last seen: today";

  let lastSeenDate: Date;

  // Handle different timestamp formats
  if (lastSeen.toDate) {
    // Firestore Timestamp object with toDate() method
    lastSeenDate = lastSeen.toDate();
  } else if (lastSeen.seconds && lastSeen.nanoseconds !== undefined) {
    // Raw timestamp object with seconds and nanoseconds
    const milliseconds =
      lastSeen.seconds * 1000 + Math.floor(lastSeen.nanoseconds / 1000000);
    lastSeenDate = new Date(milliseconds);
  } else {
    return "Last seen: today";
  }

  const now = new Date();
  const diffMs = now.getTime() - lastSeenDate.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "Last seen just now";
  if (diffMinutes < 60)
    return `Last seen ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24)
    return `Last seen ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `Last seen ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

// ============================================================================
// CHAT UTILITIES
// ============================================================================

export const QUICK_REACTIONS = ["❤️", "👍", "😂", "😮", "😢"];

export const CHAT_ACTIONS = ["like", "superlike"];

// ============================================================================
// DISCOVERY UTILITIES
// ============================================================================

export const GENDER_FILTERS = {
  male: ["female", "non-binary", "other"],
  female: ["male", "non-binary", "other"],
  "non-binary": ["male", "female", "other"],
  other: ["male", "female", "non-binary"],
  default: ["male", "female", "non-binary", "other"],
};

export const DISCOVERY_CONSTANTS = {
  MAX_VISIBLE_PROFILES: 3,
  Z_INDEX_BASE: 10,
  SCALE_FACTOR: 0.02,
  TRANSLATE_Y_FACTOR: 4,
};

// ============================================================================
// ONBOARDING CONSTANTS
// ============================================================================

export const ONBOARDING_CONSTANTS = {
  TOTAL_STEPS: 7,
  DEFAULT_AGE_MIN: 18,
  DEFAULT_AGE_MAX: 35,
  MIN_AGE: 18,
};

// ============================================================================
// PLACEHOLDER UTILITIES
// ============================================================================

export const PLACEHOLDERS = {
  AVATAR: "/placeholder.svg",
  AVATAR_SMALL: "/placeholder.svg?height=56&width=56",
  AVATAR_LARGE: "/placeholder.svg?height=128&width=128",
};

// ============================================================================
// MARKETING DATA
// ============================================================================

export const STATS_DATA = [
  { label: "2M+", sub: "Happy Couples" },
  { label: "15M+", sub: "Active Users" },
  { label: "1M+", sub: "Matches Daily" },
];

// ============================================================================
// FORMAT UTILITIES
// ============================================================================

export const formatUtils = {
  formatAge: (birthDate: Date): number => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1;
    }

    return age;
  },

  formatDistance: (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${Math.round(distance)}km`;
  },

  formatDate: (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  },
};

// ============================================================================
// COMPONENT CONSTANTS
// ============================================================================

// Action Icons
export const ACTION_ICONS = {
  cancel: "/cancel.png",
  star: "/star.png",
  heart: "/heart.png",
  message: "/message.png",
};

// Navigation Items
export const NAV_ITEMS = [
  { id: "discovery", icon: "Flame", label: "Discover" },
  { id: "matches", icon: "Heart", label: "Matches" },
  { id: "messages", icon: "MessageCircle", label: "Messages" },
  { id: "profile", icon: "UserIcon", label: "Profile" },
];

// Loader Size Classes
export const LOADER_SIZE_CLASSES = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};
