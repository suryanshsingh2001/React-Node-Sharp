import { useEffect } from "react";
import { useImageContext } from "../context/ImageContext";

export default function ImageControls() {
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

  useEffect(() => {
    const updatePreview = async () => {
      try {
        const response = await fetch("/api/process", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ brightness, contrast, saturation, rotation }),
        });
        const data = await response.json();
        setPreview(data.previewUrl);
      } catch (error) {
        console.error("Error processing image:", error);
      }
    };

    updatePreview();
  }, [brightness, contrast, saturation, rotation]);

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
