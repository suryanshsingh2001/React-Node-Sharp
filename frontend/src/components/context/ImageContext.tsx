import React, { createContext, useState, useContext } from "react";

interface ImageContextType {
  image: File | null;
  setImage: (file: File | null) => void;
  preview: string;
  setPreview: (url: string) => void;
  brightness: number;
  setBrightness: (value: number) => void;
  contrast: number;
  setContrast: (value: number) => void;
  saturation: number;
  setSaturation: (value: number) => void;
  rotation: number;
  setRotation: (value: number) => void;
  clearAll: () => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Function to clear all the states
  const clearAll = async () => {
    setImage(null);
    setPreview("");
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setRotation(0);

    const response = await fetch(`${apiBaseUrl}/reset`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to clear image");
    }

    console.log("Image cleared successfully");
  };

  return (
    <ImageContext.Provider
      value={{
        image,
        setImage,
        preview,
        setPreview,
        brightness,
        setBrightness,
        contrast,
        setContrast,
        saturation,
        setSaturation,
        rotation,
        setRotation,
        clearAll, // Add the clearAll function to the context value
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error("useImageContext must be used within an ImageProvider");
  }
  return context;
};
