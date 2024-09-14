import { useEffect } from "react";
import { useImageContext } from "../context/ImageContext";

export default function ImageControls() {


  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const storageUrl = import.meta.env.VITE_STORAGE_URL;
  const {
    brightness,
    setBrightness,
    contrast,
    setContrast,
    saturation,
    setSaturation,
    rotation,
    setRotation,
    setPreview,
  } = useImageContext();

  // Separate useEffect hooks for each manipulation task
  useEffect(() => {
    const updateBrightness = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/brightness`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ brightness }),
        });
        const data = await response.json();
      
        setPreview(`${storageUrl}/${data.previewUrl}`);
      } catch (error) {
        console.error("Error processing brightness:", error);
      }
    };

    if (brightness !== 100) updateBrightness();
  }, [brightness]);

  useEffect(() => {
    const updateContrast = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/contrast`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contrast }),
        });
        const data = await response.json();
        setPreview(`${storageUrl}/${data.previewUrl}`);

        console.log(data.previewUrl);
      } catch (error) {
        console.error("Error processing contrast:", error);
      }
    };

    if (contrast !== 100) updateContrast();
  }, [contrast]);

  useEffect(() => {
    const updateSaturation = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/saturation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ saturation }),
        });
        const data = await response.json();
        setPreview(`${storageUrl}/${data.previewUrl}`);

        console.log(data.previewUrl);
      } catch (error) {
        console.error("Error processing saturation:", error);
      }
    };

    if (saturation !== 100) updateSaturation();
  }, [saturation]);

  useEffect(() => {
    const updateRotation = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/rotate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rotation }),
        });
        const data = await response.json();
        setPreview(`${storageUrl}/${data.previewUrl}`);
      } catch (error) {
        console.error("Error rotating image:", error);
      }
    };

    if (rotation !== 0) updateRotation();
  }, [rotation]);

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="brightness"
          className="block text-sm font-medium text-gray-700"
        >
          Brightness
        </label>
        <input
          type="range"
          id="brightness"
          min="0"
          max="200"
          value={brightness}
          onChange={(e) => setBrightness(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <label
          htmlFor="contrast"
          className="block text-sm font-medium text-gray-700"
        >
          Contrast
        </label>
        <input
          type="range"
          id="contrast"
          min="0"
          max="200"
          value={contrast}
          onChange={(e) => setContrast(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <label
          htmlFor="saturation"
          className="block text-sm font-medium text-gray-700"
        >
          Saturation
        </label>
        <input
          type="range"
          id="saturation"
          min="0"
          max="200"
          value={saturation}
          onChange={(e) => setSaturation(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <label
          htmlFor="rotation"
          className="block text-sm font-medium text-gray-700"
        >
          Rotation
        </label>
        <input
          type="range"
          id="rotation"
          min="0"
          max="360"
          value={rotation}
          onChange={(e) => setRotation(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}
