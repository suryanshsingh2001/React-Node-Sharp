import { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { useImageContext } from "../context/ImageContext";
import { Button } from "../ui/button";
import { Crop } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function ImagePreview() {
  const { preview, setPreview } = useImageContext();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [cropEnabled, setCropEnabled] = useState(false);
  const [naturalWidth, setNaturalWidth] = useState<number | null>(null);
  const [naturalHeight, setNaturalHeight] = useState<number | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const storageUrl = import.meta.env.VITE_STORAGE_URL;

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const onMediaLoaded = useCallback(
    (mediaSize: {
      width: number;
      height: number;
      naturalWidth: number;
      naturalHeight: number;
    }) => {
      setNaturalWidth(mediaSize.naturalWidth);
      setNaturalHeight(mediaSize.naturalHeight);
    },
    []
  );

  const cropImage = async () => {
    if (!croppedAreaPixels || naturalWidth === null || naturalHeight === null)
      return;

    try {
      const response = await fetch(`${apiBaseUrl}/crop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          croppedAreaPixels,
          zoom,
          naturalWidth,
          naturalHeight,
        }),
      });

      const data = await response.json();

      console.log("Cropped image:", data.previewUrl);
      setPreview(`${storageUrl}/${data.previewUrl}`);

      setCropEnabled(false);
    } catch (error) {
      console.error("Error cropping image", error);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Preview</CardTitle>
        {preview && (
          <div className="flex flex-row gap-2">
            <Button
              variant={cropEnabled ? "secondary" : "default"}
              onClick={() => setCropEnabled(!cropEnabled)}
              size="sm"
            >
              <Crop className="mr-2 h-4 w-4" />
              {cropEnabled ? "Exit Crop" : "Crop Image"}
            </Button>
            {cropEnabled && (
              <Button onClick={cropImage} size="sm">
                Crop and Upload
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
        <div className="border rounded-lg overflow-hidden relative">
          {preview ? (
            <>
              {!cropEnabled ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full"
                />
              ) : (
                <div className="relative w-full h-[calc(100vh-200px)]">
                  <Cropper
                    image={preview}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onMediaLoaded={onMediaLoaded}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full w-full">
              <img src="https://placehold.co/600x400?text=Your+Image+Comes+Here&font=Raleway" alt="No data" 
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
