import { useState } from "react";
import { useImageContext } from "../context/ImageContext";
import FileSaver from "file-saver";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ImageDownload() {
  const { image, clearAll, contrast, saturation, brightness, rotation } = useImageContext();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const downloadUrl = import.meta.env.VITE_DOWNLOAD_URL;

  const [format, setFormat] = useState<"png" | "jpeg">("png");

  const handleDownload = async () => {
    if (!image) return;

    try {
      const response = await fetch(`${apiBaseUrl}/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ format, contrast, saturation, brightness, rotation }),
      });

      if (!response.ok) {
        throw new Error("Failed to get download URL");
      }

      const { url } = await response.json();
      console.log("previewUrl:", url);

      const exportUrl = `${downloadUrl}/${url}`;

      console.log("Downloading image from:", exportUrl);
      FileSaver.saveAs(exportUrl, `processed.${format}`);

      clearAll();

      console.log("Image downloaded successfully");

    

    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle  
          className="text-lg font-semibold"
        >Export Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          value={format}
          onValueChange={(value) => setFormat(value as "png" | "jpeg")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="jpeg">JPEG</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleDownload} disabled={!image} className="w-full">
          <Download className="mr-2 h-4 w-4" /> Download
        </Button>
      </CardContent>
    </Card>
  );
}
