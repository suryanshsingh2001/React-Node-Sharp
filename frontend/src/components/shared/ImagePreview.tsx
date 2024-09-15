import  { useState, useCallback } from 'react';
import Cropper, {Area} from 'react-easy-crop';
import { useImageContext } from '../context/ImageContext';

export default function ImagePreview() {
  const { preview, setPreview } = useImageContext();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [cropEnabled, setCropEnabled] = useState(false);


  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const storageUrl = import.meta.env.VITE_STORAGE_URL;

  const onCropComplete = useCallback((croppedArea : Area, croppedAreaPixels : any) => {
    setCroppedArea(croppedArea);
  }, []);

  const cropImage = async () => {
    if (!croppedArea) return;

    // Send cropped data to backend
    try {
      const response = await fetch(`${apiBaseUrl}/crop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ croppedArea }),
      });


      const data = await response.json();

      console.log('Cropped image:', data.previewUrl);
      setPreview(`${storageUrl}/${data.previewUrl}`); 


      setCropEnabled(false);
    } catch (error) {
      console.error('Error cropping image', error);
    } finally {
      setCroppedArea(null);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {preview ? (
        <div>
          {!cropEnabled ? (
            <img src={preview} alt="Preview" className="w-full h-auto" />
          ) : (
            <div className="relative w-full h-80 bg-gray-100">
              {/* This container needs explicit height and relative positioning */}
              <Cropper
                image={preview}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3} // You can adjust this aspect ratio
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                style={{ containerStyle: { height: '100%' } }} // Ensure container height fills
              />
            </div>
          )}
          <div className="mt-2">
            <button
              className="btn-primary"
              onClick={() => setCropEnabled(!cropEnabled)}
            >
              {cropEnabled ? 'Disable Crop' : 'Enable Crop'}
            </button>
            {cropEnabled && (
              <button className="btn-primary ml-2" onClick={cropImage}>
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
