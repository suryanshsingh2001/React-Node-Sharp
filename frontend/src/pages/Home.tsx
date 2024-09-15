"use client";

import { ImageProvider } from "../components/context/ImageContext";
import ImageUpload from "../components/shared/ImageUpload";
import ImageControls from "../components/shared/ImageControls";
import ImageDownload from "../components/shared/ImageDownload";
import ImagePreview from "../components/shared/ImagePreview";

export default function Home() {
  return (
    <ImageProvider>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <ImageUpload />
          <ImageControls />
          <ImageDownload />
        </div>
        <div className="lg:col-span-8">
          <ImagePreview />
        </div>
      </div>
    </ImageProvider>
  );
}
