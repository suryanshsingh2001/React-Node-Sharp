import { useState } from "react";
import { useImageContext } from "../context/ImageContext";
import FileSaver from "file-saver";

export default function ImageDownload() {
  const { image } = useImageContext();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const downloadUrl = import.meta.env.VITE_DOWNLOAD_URL;

  const [format, setFormat] = useState<"png" | "jpeg">("png");

  const handleDownload = async () => {
    if (!image) return;

    try {
      // Fetch the download URL from the server
      const response = await fetch(`${apiBaseUrl}/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ format }),
      });

      if (!response.ok) {
        throw new Error("Failed to get download URL");
      }

      // Get the URL to download the image
      const { previewUrl } = await response.json();

      console.log("previewUrl:", previewUrl);

      // Directly trigger a download via the URL
      const url = `${downloadUrl}/${previewUrl}`;

      FileSaver.saveAs(url, `processed.${format}`);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className="mt-4">
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value as "png" | "jpeg")}
        className="block w-full p-2 mb-2 border rounded"
      >
        <option value="png">PNG</option>
        <option value="jpeg">JPEG</option>
      </select>
      <button
        onClick={handleDownload}
        disabled={!image}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Download Processed Image
      </button>
    </div>
  );
}
