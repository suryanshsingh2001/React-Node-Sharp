import { useImageContext } from "../context/ImageContext";
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
// import getCroppedImg from '../utils/cropImage' // A utility function to get the cropped image

export default function ImagePreview() {
  const { preview, setPreview } = useImageContext();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const storageUrl = import.meta.env.VITE_STORAGE_URL;

  // When the user stops cropping, we store the cropped area
  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedArea(croppedAreaPixels);
    },
    []
  );

  // Send the cropped area to the backend
  const handleCropSave = async () => {
    if (croppedArea) {
      try {
        // Send the crop data to the backend
        const response = await fetch(`${apiBaseUrl}/crop`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            croppedArea,
          }),
        });
        const data = await response.json();

        // Update the preview with the newly cropped image
        setPreview(`${storageUrl}/${data.previewUrl}?t=${Date.now()}`);
        setIsCropping(false); // Disable cropping mode
      } catch (error) {
        console.error("Error cropping image:", error);
      }
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden relative">
      {isCropping ? (
        <>
          {/* Cropper component */}
          <Cropper
          
            image={preview}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3} // You can change aspect ratio
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
          {/* Save crop button */}
          <Button onClick={handleCropSave} className="absolute top-2 right-2">
            Save Crop
          </Button>
        </>
      ) : (
        <>
          {/* Preview */}
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-auto" />
          ) : (
            <div className=" flex items-center justify-center bg-gray-100 text-gray-400 h-80">
              No image uploaded
            </div>
          )}
          {/* Crop button */}
          <Button
            onClick={() => setIsCropping(true)}
            className="absolute top-2 right-2"
          >
            Crop
          </Button>
        </>
      )}
    </div>
  );
}
