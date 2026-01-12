"use client";
import { UserProfile } from "@/lib/types";
import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Plus, X } from "lucide-react";
import {
  DIET_OPTIONS,
  DRINKING_OPTIONS,
  fileUtils,
  generateHeightOptions,
  INTERESTS_OPTIONS,
  LOOKING_FOR_OPTIONS,
  PETS_OPTIONS,
  SMOKING_OPTIONS,
  WORKOUT_OPTIONS,
} from "@/lib/common-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useCloudinary } from "@/hooks/useImageCloudinary";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: string;
  currentData: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  field,
  currentData,
  onUpdate,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<UserProfile>(currentData);
  const [newInterest, setNewInterest] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage } = useCloudinary();
  const MAX_PHOTOS = 6;
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  useEffect(() => {
    setFormData(currentData);
  }, [currentData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      onUpdate(formData);
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const addInterest = () => {
    const trimmed = newInterest.trim();
    if (trimmed && !formData.interests.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, trimmed],
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const addLookingFor = (value: string) => {
    if (!formData.lookingFor.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        lookingFor: [...prev.lookingFor, value],
      }));
    }
  };

  const removeLookingFor = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      lookingFor: prev.lookingFor.filter((l) => l !== value),
    }));
  };

  const getTitle = () => {
    switch (field) {
      case "bio":
        return "About You";
      case "work":
        return "Work & Education";
      case "interests":
        return "Interests";
      case "lifestyle":
        return "Lifestyle";
      case "lookingFor":
        return "Looking For";
      default:
        return "Edit Profile";
    }
  };

  const renderEditor = () => {
    switch (field) {
      case "bio":
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-base font-semibold text-white">
                Your bio
              </Label>
              <Textarea
                value={formData.additionalInfo?.bio || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    additionalInfo: {
                      ...prev.additionalInfo,
                      bio: e.target.value,
                    },
                  }))
                }
                placeholder="Two truths and a lie? Your favourite travel story? Go wild..."
                className="min-h-[140px] bg-gray-800/70 border-gray-600 text-white placeholder:text-gray-500 resize-none rounded-xl"
                maxLength={500}
              />
              <p className="text-xs text-gray-400 text-right">
                {(formData.additionalInfo?.bio || "").length}/500
              </p>
            </div>
          </div>
        );

      case "work":
        return (
          <div className="space-y-6">
            {[
              {
                label: "Job Title",
                key: "jobTitle",
                placeholder: "e.g. Product Designer",
              },
              { label: "Company", key: "company", placeholder: "e.g. xAI" },
              {
                label: "Education",
                key: "educationLevel",
                placeholder: "e.g. B.Tech Computer Science",
              },
              {
                label: "University / School",
                key: "university",
                placeholder: "e.g. IIT Bombay",
              },
            ].map((item) => (
              <div key={item.key} className="space-y-2">
                <Label className="text-sm font-medium text-gray-200">
                  {item.label}
                </Label>
                <Input
                  value={
                    formData.additionalInfo?.[
                      item.key as keyof typeof formData.additionalInfo
                    ] || ""
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      additionalInfo: {
                        ...prev.additionalInfo,
                        [item.key]: e.target.value,
                      },
                    }))
                  }
                  placeholder={item.placeholder}
                  className="bg-gray-800/70 border-gray-600 text-white placeholder:text-gray-500 rounded-xl"
                />
              </div>
            ))}
          </div>
        );

      case "interests":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold text-white mb-3 block">
                Your Interests
              </Label>

              {/* Selected Interests */}
              <div className="flex flex-wrap gap-2.5 mb-5">
                {(formData.interests ?? []).map((int: string) => (
                  <div
                    key={int}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                         bg-pink-900/30 border border-pink-600/40
                         text-pink-300 text-sm font-medium"
                  >
                    <span>{int}</span>

                    <button
                      type="button"
                      onClick={() => removeInterest(int)}
                      className="rounded-full hover:bg-pink-800/40 p-0.5 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Popular Picks */}
              <div className="space-y-3">
                <p className="text-sm text-gray-400">Popular picks</p>

                <div className="flex flex-wrap gap-2">
                  {INTERESTS_OPTIONS.map((opt) => {
                    const isSelected = formData.interests?.includes(opt.name);

                    return (
                      <button
                        key={opt.name}
                        type="button"
                        disabled={isSelected}
                        onClick={() => {
                          if (isSelected) return;
                          setFormData((p) => ({
                            ...p,
                            interests: [...(p.interests ?? []), opt.name],
                          }));
                        }}
                        className="px-3.5 py-1.5 text-sm bg-gray-700 hover:bg-gray-600
                             disabled:bg-gray-800 disabled:opacity-50
                             rounded-full transition flex items-center gap-1.5
                             text-gray-200 disabled:text-gray-500"
                      >
                        <span>{opt.icon}</span>
                        <span>{opt.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom */}
                <div className="flex gap-2 mt-4">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addInterest();
                      }
                    }}
                    placeholder="Add your own interest..."
                    className="bg-gray-800/70 border-gray-600 text-white
                         placeholder:text-gray-500 rounded-xl flex-1"
                  />

                  <Button
                    type="button"
                    onClick={addInterest}
                    size="icon"
                    className="bg-gradient-to-r from-pink-500 to-rose-500
                         hover:from-pink-600 hover:to-rose-600 rounded-xl"
                  >
                    <Plus size={18} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      case "lifestyle":
        return (
          <div className="space-y-6 w-full">
            <Label className="text-base font-semibold text-white">
              Your Lifestyle
            </Label>

            {[
              {
                label: "Height",
                value: formData.height,
                options: generateHeightOptions(),
                key: "height",
              },
              {
                label: "Drinking",
                value: formData.drinking,
                options: DRINKING_OPTIONS,
                key: "drinking",
              },
              {
                label: "Smoking",
                value: formData.smoking,
                options: SMOKING_OPTIONS,
                key: "smoking",
              },
              {
                label: "Workout",
                value: formData.workout,
                options: WORKOUT_OPTIONS,
                key: "workout",
              },
              {
                label: "Diet",
                value: formData.diet,
                options: DIET_OPTIONS,
                key: "diet",
              },
              {
                label: "Pets",
                value: formData.pets,
                options: PETS_OPTIONS,
                key: "pets",
              },
            ].map((item) => (
              <div key={item.key} className="space-y-2 w-full">
                <Label className="text-sm font-medium text-gray-200">
                  {item.label}
                </Label>

                <Select
                  value={item.value || ""}
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, [item.key]: val }))
                  }
                >
                  <SelectTrigger className="w-full bg-gray-800/70 border-gray-600 text-white rounded-xl">
                    <SelectValue
                      placeholder={`Select ${item.label.toLowerCase()}`}
                    />
                  </SelectTrigger>

                  <SelectContent className="bg-gray-800 border-gray-700 text-white max-h-60 w-full">
                    {item.options.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className="focus:bg-gray-700"
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        );

      case "lookingFor":
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold text-white mb-3 block">
                Looking For
              </Label>

              {/* Selected Looking For */}
              <div className="flex flex-wrap gap-2.5 mb-5">
                {(formData.lookingFor ?? []).map((lf: string) => (
                  <div
                    key={lf}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                         bg-pink-900/30 border border-pink-600/40
                         text-pink-300 text-sm font-medium"
                  >
                    <span>{lf}</span>

                    <button
                      type="button"
                      onClick={() => removeLookingFor(lf)}
                      className="rounded-full hover:bg-pink-800/40 p-0.5 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-400">What are you open to?</p>

                {/* Options */}
                <div className="flex flex-wrap gap-2">
                  {LOOKING_FOR_OPTIONS.map((opt) => {
                    const value = typeof opt === "string" ? opt : opt.value;
                    const label = typeof opt === "string" ? opt : opt.label;
                    const isSelected = formData.lookingFor?.includes(value);

                    return (
                      <button
                        key={value}
                        type="button"
                        disabled={isSelected}
                        onClick={() => addLookingFor(value)}
                        className="px-3.5 py-1.5 text-sm bg-gray-700 hover:bg-gray-600
                             disabled:bg-gray-800 disabled:opacity-50
                             rounded-full transition
                             text-gray-200 disabled:text-gray-500"
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case "photos":
        // Add new photos
        const handleAddPhotoClick = () => {
          if (fileInputRef.current) {
            fileInputRef.current.click();
          }
        };

        const handleFileInputChange = async (
          e: React.ChangeEvent<HTMLInputElement>
        ) => {
          const files = e.target.files;
          if (!files || files.length === 0) return;

          // Agar max limit cross ho raha hai
          if (formData.photos.length + files.length > MAX_PHOTOS) {
            alert(`You can upload maximum ${MAX_PHOTOS} photos only.`);
            return;
          }

          setUploadingPhotos(true);

          try {
            const newPhotos: string[] = [...formData.photos];

            for (const file of files) {
              // Validate file (tumhare fileUtils se)
              if (!fileUtils.validateFiles([file])) continue;

              // Upload to Cloudinary
              if (uploadImage) {
                const url = await uploadImage(file); // Assuming uploadImage returns URL
                newPhotos.push(url);
              }
            }

            setFormData({ ...formData, photos: newPhotos });
          } catch (error) {
            console.error("Photo upload failed:", error);
            // Optional: Toast notification dikha sakte ho
          } finally {
            setUploadingPhotos(false);
            if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
          }
        };

        // Remove photo
        const handleRemovePhoto = (index: number) => {
          const updatedPhotos = formData.photos.filter((_, i) => i !== index);
          setFormData({ ...formData, photos: updatedPhotos });
        };

        // Optional: Reorder photos (simple drag & drop using array splice)
        const handleDragEnd = (result: any) => {
          if (!result.destination) return;
          const items = Array.from(formData.photos);
          const [reorderedItem] = items.splice(result.source.index, 1);
          items.splice(result.destination.index, 0, reorderedItem);
          setFormData({ ...formData, photos: items });
        };

        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold text-white">
                Profile Photos
              </Label>
              <p className="text-sm text-gray-400">
                {formData.photos.length}/{MAX_PHOTOS}
              </p>
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* Uploaded Photos */}
              {formData.photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-gray-700/50 hover:border-pink-500/50 transition-all duration-300 shadow-lg"
                >
                  <img
                    src={photo}
                    alt={`Profile photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600/80"
                  >
                    <X size={18} />
                  </button>
                  {/* Optional: Drag handle for reorder */}
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    Drag to reorder
                  </div>
                </div>
              ))}

              {/* Add Photo Button (only if less than max) */}
              {formData.photos.length < MAX_PHOTOS && (
                <button
                  type="button"
                  onClick={handleAddPhotoClick}
                  disabled={uploadingPhotos}
                  className="aspect-square rounded-2xl border-2 border-dashed border-gray-600 hover:border-pink-500 hover:bg-pink-950/30 transition-all duration-300 flex flex-col items-center justify-center gap-2 group"
                >
                  {uploadingPhotos ? (
                    <div className="flex flex-col items-center text-gray-400">
                      <div className="w-8 h-8 border-4 border-t-pink-500 border-gray-600 rounded-full animate-spin mb-2" />
                      <span className="text-sm">Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-pink-900/30 flex items-center justify-center group-hover:bg-pink-800/50 transition">
                        <Plus className="w-6 h-6 text-pink-400" />
                      </div>
                      <span className="text-sm text-gray-400 group-hover:text-pink-300 transition">
                        Add Photo
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* Helper Text */}
            <div className="text-xs text-gray-400 space-y-1">
              <p>• Maximum {MAX_PHOTOS} photos allowed</p>
              <p>
                • High-quality photos work best (recommended: 4:5 or 1:1 ratio)
              </p>
              <p>• You can drag photos to reorder them</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-b from-gray-900 to-gray-800 text-white border-gray-700/50 max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-700/50">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
            {getTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-6 space-y-8">{renderEditor()}</div>

        <div className="px-6 pb-6 pt-4 border-t border-gray-700/50 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={saving}
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:text-white transition rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium rounded-xl transition shadow-lg shadow-pink-500/20"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
