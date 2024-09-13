import React, { useState } from "react";
import { useImageContext } from "../context/ImageContext";

export default function ImageUpload() {
  const { setImage, setPreview } = useImageContext();
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const storageUrl = import.meta.env.VITE_STORAGE_URL;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validate file type
      if (!["image/png", "image/jpeg"].includes(file.type)) {
        setError("Please upload a PNG or JPEG image.");
        return;
      }

      setLoading(true); // Start loading
      setImage(file);
      setError(null); // Clear previous errors
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch(`${apiBaseUrl}/upload`, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }




        const data = await response.json();

        const clientImage = `${storageUrl}/${data.previewUrl}`;
        console.log(clientImage);
        setPreview(clientImage);
      } catch (error) {
        console.error("Error uploading image:", error);
        setError("Failed to upload image. Please try again.");
      } finally {
        setLoading(false); // End loading
      }
    }
  };

  return (
    <div className="mb-4">
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleFileChange}

        disabled={loading}
        className={`block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100 ${
            loading && "cursor-not-allowed opacity-50"
          }`}
      />
      {loading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
    </div>
  );
}
