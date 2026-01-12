"use client";

import { useCloudinary } from "@/hooks/useImageCloudinary";
import { UserProfile } from "@/lib/types";
import { Camera, CheckIcon, ImagePlus, Trash2 } from "lucide-react";
import React, { useRef } from "react";

interface PhotoStepProps {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

function PhotoStep({ profile, updateProfile }: PhotoStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadImage, uploading } = useCloudinary();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // ⬆️ upload to cloudinary
      const cloudinaryUrl = await uploadImage(file);

      if (!cloudinaryUrl) return;

      updateProfile({
        photos: [...profile.photos, cloudinaryUrl],
      });
    } catch (err) {
      console.error("Photo upload failed", err);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = profile.photos.filter((_, i) => i !== index);
    updateProfile({ photos: updatedPhotos });
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
          <Camera className="h-12 w-12 text-white" />
        </div>

        <h2 className="text-4xl font-extrabold text-slate-900 mb-3">
          Add your best photos
        </h2>

        <p className="text-lg text-slate-600">
          Upload at least{" "}
          <span className="font-semibold text-indigo-600">2 photos</span>
        </p>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-10">
        {profile.photos.map((photo, index) => (
          <div
            key={index}
            className="relative group rounded-2xl overflow-hidden shadow-lg"
          >
            <img
              src={photo}
              alt="profile"
              className="w-full h-48 object-cover"
            />

            <button
              onClick={() => handleRemovePhoto(index)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            {index === 0 && (
              <span className="absolute bottom-3 left-3 text-xs px-3 py-1 rounded-full bg-indigo-600 text-white flex items-center gap-1">
                <CheckIcon className="h-3 w-3" />
                Primary
              </span>
            )}
          </div>
        ))}

        {/* Add Photo */}
        {profile.photos.length < 6 && (
          <>
            <button
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="h-48 rounded-2xl border-2 border-dashed border-indigo-300 flex flex-col items-center justify-center text-indigo-600 hover:bg-indigo-50 transition disabled:opacity-50"
            >
              <ImagePlus className="h-10 w-10 mb-2" />
              <span className="font-medium">
                {uploading ? "Uploading..." : "Add Photo"}
              </span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </>
        )}
      </div>

      {/* Info */}
      <div className="text-center text-sm text-slate-500">
        {profile.photos.length < 2 ? (
          <p className="text-red-500">
            Please upload at least 2 photos to continue
          </p>
        ) : (
          <p className="text-emerald-600">
            Looking good! You can add up to 6 photos ✨
          </p>
        )}
      </div>
    </div>
  );
}

export default PhotoStep;
