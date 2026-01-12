"use client";
import { useState } from "react";

export const useCloudinary = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "dating_app"
      );

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) throw new Error("Missing Cloudinary cloud name");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Cloudinary error", data);
        throw new Error(data.error?.message || "Upload failed");
      }

      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image", error);
      throw error;
    } finally {
      setUploadProgress(0);
      setUploading(false);
    }
  };

  // upload multiple images
  const uploadMultipleImage = async (files: File[]): Promise<string[]> => {
    return Promise.all(files.map((file) => uploadImage(file)));
  };

  return {
    uploadImage,
    uploadMultipleImage,
    uploading,
    uploadProgress,
  };
};
