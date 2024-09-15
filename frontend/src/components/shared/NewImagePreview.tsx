import { useState, useCallback } from "react"
import Cropper, { Area } from "react-easy-crop"
import { useImageContext } from "../context/ImageContext"
import { Button } from "../ui/button"
import { Crop, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export default function ImagePreview() {
  const { preview, setPreview } = useImageContext()
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [cropEnabled, setCropEnabled] = useState(false)
  const [naturalWidth, setNaturalWidth] = useState<number | null>(null)
  const [naturalHeight, setNaturalHeight] = useState<number | null>(null)

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const storageUrl = import.meta.env.VITE_STORAGE_URL

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  const onMediaLoaded = useCallback(
    (mediaSize: {
      width: number
      height: number
      naturalWidth: number
      naturalHeight: number
    }) => {
      setNaturalWidth(mediaSize.naturalWidth)
      setNaturalHeight(mediaSize.naturalHeight)
    },
    []
  )

  const cropImage = async () => {
    if (!croppedAreaPixels || naturalWidth === null || naturalHeight === null)
      return

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
      })

      const data = await response.json()

      console.log("Cropped image:", data.previewUrl)
      setPreview(`${storageUrl}/${data.previewUrl}`)

      setCropEnabled(false)
    } catch (error) {
      console.error("Error cropping image", error)
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <CardTitle>Preview</CardTitle>
          {preview && (
            <div className="flex space-x-2">
              <Button
                variant={cropEnabled ? "secondary" : "default"}
                onClick={() => setCropEnabled(!cropEnabled)}
                size="sm"
              >
                <Crop className="mr-2 h-4 w-4" />
                {cropEnabled ? "Disable Crop" : "Crop"}
              </Button>
              {cropEnabled && (
                <Button onClick={cropImage} size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
        <div className="border rounded-lg overflow-hidden relative h-full">
          {preview ? (
            <>
              {!cropEnabled ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="relative w-full h-full">
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
            <div className="flex items-center justify-center bg-gray-100 text-gray-400 h-full">

              <img
                  src={"https://placehold.co/600x400?text=Your+Image+Comes+Here"}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}