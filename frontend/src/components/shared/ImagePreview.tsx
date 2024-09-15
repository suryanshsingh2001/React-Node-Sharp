import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { useImageContext } from '../context/ImageContext';

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

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onMediaLoaded = useCallback((mediaSize: { width: number; height: number; naturalWidth: number; naturalHeight: number }) => {
    setNaturalWidth(mediaSize.naturalWidth);
    setNaturalHeight(mediaSize.naturalHeight);
  }, []);

  const cropImage = async () => {
    if (!croppedAreaPixels || naturalWidth === null || naturalHeight === null) return;

    try {
      const response = await fetch(`${apiBaseUrl}/crop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          croppedAreaPixels,
          zoom,
          naturalWidth,
          naturalHeight
        }),
      });

      const data = await response.json();

      console.log('Cropped image:', data.previewUrl);
      setPreview(`${storageUrl}/${data.previewUrl}`);
      
      setCropEnabled(false);
    } catch (error) {
      console.error('Error cropping image', error);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {preview ? (
        <div>
          {!cropEnabled ? (
            <img src={preview} alt="Preview" className="w-full h-auto" />
          ) : (
            <div className="relative w-full h-[calc(100vh-200px)]">
              <Cropper
                image={preview}
                crop={crop}
             
                aspect={4 / 3}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onMediaLoaded={onMediaLoaded}
              />
            </div>
          )}
          <div className="mt-2 space-y-2">
            <button
              className="btn-primary w-full"
              onClick={() => setCropEnabled(!cropEnabled)}
            >
              {cropEnabled ? 'Disable Crop' : 'Enable Crop'}
            </button>
            {cropEnabled && (
              <button className="btn-primary w-full" onClick={cropImage}>
                Crop and Upload
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center bg-gray-100 text-gray-400 h-80">
          No image uploaded
        </div>
      )}
    </div>
  );
}