"use client";

import EditProfileModal from "@/components/EditProfileModal";

import {
  calculateProfileCompletion,
  localStorageUtils,
  STORAGE_KEYS,
} from "@/lib/common-utils";
import { auth, db } from "@/lib/firebase";
import { UserProfile } from "@/lib/types";
import { signOut } from "firebase/auth";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import {
  ArrowLeft,
  Briefcase,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Cigarette,
  Dessert,
  Dog,
  DumbbellIcon,
  Edit3,
  GraduationCap,
  MessageCircle,
  Ruler,
  University,
  Wine,
} from "lucide-react";
import { useRouter } from "next/navigation";

import React, { ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ProfilePageProps {
  profile: UserProfile;
  onUpdate?: (updates: Partial<UserProfile>) => void;
  isOwnProfile?: boolean;
  onBack?: () => void;
  onStartChat?: () => void;
}

function ProfilePage({
  profile,
  onBack,
  onUpdate,
  isOwnProfile,
  onStartChat,
}: ProfilePageProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<string>("");
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showLoading, setShowLoading] = useState(true);

  const router = useRouter();

  const handleEditField = (field: string) => {
    if (!isOwnProfile) return;
    setEditingField(field);
    setEditModalOpen(true);
  };

  const nextImage = () => {
    if (profile?.photos?.length) {
      setCurrentPhotoIndex((prev) =>
        Math.min(prev + 1, profile.photos.length - 1)
      );
    }
  };
  const prevImage = () => {
    if (profile?.photos?.length) {
      setCurrentPhotoIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        try {
          await updateDoc(userRef, {
            isOnline: false,
            lastSeen: serverTimestamp(),
          });
        } catch (error) {
          toast.error("Error logging out");
        }
      }
      await signOut(auth);
      localStorageUtils.set(STORAGE_KEYS.ACTIVE_TAB, "discovery");
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Error logging out");
      console.error(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (showLoading || !profile) {
    return (
      <div className="relative h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(236,72,153,0.15),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_70%,rgba(99,102,241,0.15),transparent_55%)]" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex flex-col items-center gap-10">
            {/* Ripple rings */}
            <div className="relative">
              <div className="absolute inset-[-70px] rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-ping opacity-60" />
              <div className="absolute inset-[-40px] rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-ping opacity-70" />
              <div className="absolute inset-[-18px] rounded-full bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 animate-pulse" />

              {/* Main chat bubble */}
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-600/40 animate-pulse">
                <svg
                  className="w-14 h-14 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3C6.48 3 2 6.94 2 11.8c0 2.48 1.2 4.7 3.14 6.25L4 22l4.21-2.2c1.17.32 2.43.5 3.79.5 5.52 0 10-3.94 10-8.8S17.52 3 12 3z" />
                </svg>

                <div className="absolute inset-0 rounded-full border-4 border-white/25 animate-ping" />
              </div>
            </div>

            {/* Text */}
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-pulse">
                Loading profile…
              </h2>
              <p className="text-white/50 text-base font-medium">
                Getting your profile ready
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black flex items-start justify-center p-4 md:p-6">
      <div className="w-full max-w-md mx-auto relative">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="absolute -top-14 left-0 z-10 p-3 rounded-full bg-black/40 backdrop-blur-lg border border-white/10 text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        )}

        {/* Main Card */}
        <div className="relative rounded-3xl overflow-hidden bg-gray-900/40 backdrop-blur-xl border border-white/5 shadow-2xl shadow-black/60">
          {/* Photo Area */}
          <div className="relative aspect-[4/5.6] md:aspect-[9/13] overflow-hidden">
            {profile.photos?.length > 0 ? (
              <>
                <img
                  src={profile.photos[currentPhotoIndex]}
                  alt={profile.name}
                  className="w-full h-full object-cover transition-all duration-700 ease-out"
                />

                {/* Gradient Overlay - bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

                {/* Name + Age + Verify */}
                <div className="absolute bottom-6 left-6 right-6 z-10">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
                      {profile.name}
                    </h1>
                    <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                      <span className="text-2xl font-bold text-white">
                        {profile.age}
                      </span>
                      {profile.isVerifiedProfile && (
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-0.5 rounded-full">
                          <img
                            src="/verify.png"
                            alt="verified"
                            className="w-7 h-7"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Navigation Arrows - bigger & more premium */}
                {profile.photos?.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-lg border border-white/10 text-white hover:bg-black/50 transition-all duration-300 hover:scale-110 active:scale-95"
                    >
                      <ChevronLeft className="h-8 w-8" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-lg border border-white/10 text-white hover:bg-black/50 transition-all duration-300 hover:scale-110 active:scale-95"
                    >
                      <ChevronRight className="h-8 w-8" />
                    </button>
                  </>
                )}

                {/* Dots indicator */}
                {profile.photos?.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
                    {profile.photos.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-400 ${
                          i === currentPhotoIndex
                            ? "bg-white scale-125 shadow-lg shadow-white/30"
                            : "bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center">
                <span className="text-gray-500 text-xl">No photos yet</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-5 pt-6 pb-8 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex gap-4">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-medium text-lg bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-900/30 hover:shadow-pink-800/40 hover:scale-[1.02] active:scale-95 transition-all duration-300"
              >
                {showDetails ? (
                  <>
                    Hide Details <ChevronUp className="h-5 w-5" />
                  </>
                ) : (
                  <>
                    About {profile.name.split(" ")[0]}{" "}
                    <ChevronDown className="h-5 w-5" />
                  </>
                )}
              </button>

              {isOwnProfile ? (
                <button
                  onClick={() => handleEditField("photos")}
                  className="flex-1 py-4 px-6 rounded-2xl font-medium text-lg border border-white/20 bg-white/5 backdrop-blur-lg text-white hover:bg-white/10 transition-all duration-300"
                >
                  <Camera className="inline mr-2 h-5 w-5" />
                  Photos
                </button>
              ) : (
                onStartChat && (
                  <button
                    onClick={onStartChat}
                    className="flex-1 py-4 px-6 rounded-2xl font-medium text-lg border border-pink-500/30 bg-pink-500/10 backdrop-blur-lg text-pink-300 hover:bg-pink-500/20 hover:border-pink-400/50 transition-all duration-300"
                  >
                    <MessageCircle className="inline mr-2 h-5 w-5" />
                    Message
                  </button>
                )
              )}
            </div>
          </div>

          {/* Expanded Details Section */}
          {showDetails && (
            <div className="px-5 pb-10 space-y-6 animate-fade-in-up">
              {/* Quick Edit Button for own profile */}
              {isOwnProfile && (
                <div className="flex justify-center -mt-3 mb-4">
                  <button
                    onClick={() => handleEditField("profile")}
                    className="px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-white/90 hover:bg-white/15 text-sm font-medium flex items-center gap-2 transition-all"
                  >
                    <Edit3 size={16} />
                    Edit Profile • {calculateProfileCompletion(profile)}%
                  </button>
                </div>
              )}

              <ProfileSection
                title="About Me"
                editable={isOwnProfile}
                onEdit={() => handleEditField("bio")}
              >
                {profile?.additionalInfo?.bio ||
                  (isOwnProfile
                    ? "Write something about yourself..."
                    : "No bio yet")}
              </ProfileSection>

              <ProfileSection
                title="Job & Education"
                editable={isOwnProfile}
                onEdit={() => handleEditField("work")}
              >
                <InfoRow
                  icon={<Briefcase size={18} />}
                  label="Job"
                  value={profile?.additionalInfo?.jobTitle || "—"}
                />
                <InfoRow
                  icon={<GraduationCap size={18} />}
                  label="Education"
                  value={profile?.additionalInfo?.educationLevel || "—"}
                />
                <InfoRow
                  icon={<University size={18} />}
                  label="university"
                  value={profile?.additionalInfo?.university || "—"}
                />
              </ProfileSection>

              <ProfileSection
                title="Interests"
                editable={isOwnProfile}
                onEdit={() => handleEditField("interests")}
              >
                {profile?.interests?.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.interests.map((item) => (
                      <span
                        key={item}
                        className="px-3.5 py-1.5 bg-pink-900/30 text-pink-300 rounded-full text-sm border border-pink-800/40"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  "No interests added yet"
                )}
              </ProfileSection>

              <ProfileSection
                title="Lifestyle"
                editable={isOwnProfile}
                onEdit={() => handleEditField("lifestyle")}
              >
                <InfoRow
                  icon={<Ruler size={18} />}
                  label="Height"
                  value={profile?.height || "—"}
                />
                <InfoRow
                  icon={<DumbbellIcon size={18} />}
                  label="Exercise"
                  value={profile?.workout || "—"}
                />
                <InfoRow
                  icon={<Wine size={18} />}
                  label="Drinking"
                  value={profile?.drinking || "—"}
                />
                <InfoRow
                  icon={<Cigarette size={18} />}
                  label="Smoking"
                  value={profile?.smoking || "—"}
                />
                <InfoRow
                  icon={<Dessert size={18} />}
                  label="Diet"
                  value={profile?.diet || "—"}
                />
              </ProfileSection>

              <ProfileSection
                title="Looking for"
                editable={isOwnProfile}
                onEdit={() => handleEditField("lookingFor")}
              >
                {profile?.lookingFor?.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.lookingFor.map((item) => (
                      <span
                        key={item}
                        className="px-3.5 py-1.5 bg-rose-900/30 text-rose-300 rounded-full text-sm border border-rose-800/40"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  "Not specified yet"
                )}
              </ProfileSection>
            </div>
          )}
          {isOwnProfile && onUpdate && (
            <EditProfileModal
              isOpen={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              field={editingField}
              currentData={profile}
              onUpdate={onUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

const ProfileSection = ({
  title,
  children,
  editable = false,
  onEdit,
}: {
  title: string;
  children: ReactNode;
  editable?: boolean;
  onEdit?: () => void;
}) => (
  <div
    className={`bg-black/30 backdrop-blur-lg rounded-2xl p-5 border border-white/8 ${
      editable ? "hover:border-white/20 cursor-pointer transition-colors" : ""
    }`}
    onClick={editable ? onEdit : undefined}
  >
    <div className="flex justify-between items-center mb-3.5">
      <h3 className="text-lg font-semibold text-white/90">{title}</h3>
      {editable && <Edit3 size={18} className="text-white/50" />}
    </div>
    <div className="text-gray-300 text-[15px] leading-relaxed">{children}</div>
  </div>
);

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | number | undefined;
}) => (
  <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
    <div className="flex items-center gap-3 text-gray-400">
      {icon}
      <span>{label}</span>
    </div>
    <span className="text-white/90 font-medium">{value}</span>
  </div>
);
