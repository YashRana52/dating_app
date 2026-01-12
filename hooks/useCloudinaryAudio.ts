import { useState } from "react";

export const useCloudinaryAudio = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadAudio = (audioBlob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      setUploading(true);
      setUploadProgress(0);

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset =
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "dating_app";

      if (!cloudName) {
        reject(new Error("Cloudinary cloud name missing"));
        return;
      }

      const ext = audioBlob.type.split("/")[1] || "webm";

      const audioFile = new File([audioBlob], `audio-${Date.now()}.${ext}`, {
        type: audioBlob.type,
      });

      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("upload_preset", uploadPreset);
      formData.append("resource_type", "video");

      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
      );

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        setUploading(false);
        setUploadProgress(0);

        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status === 200 && data.secure_url) {
            resolve(data.secure_url);
          } else {
            reject(new Error(data?.error?.message || "Upload failed"));
          }
        } catch {
          reject(new Error("Invalid Cloudinary response"));
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        setUploadProgress(0);
        reject(new Error("Network error during upload"));
      };

      xhr.send(formData);
    });
  };

  return {
    uploadAudio,
    uploading,
    uploadProgress,
  };
};
