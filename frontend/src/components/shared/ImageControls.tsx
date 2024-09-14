'use client'

import { useEffect } from "react"
import { useImageContext } from "../context/ImageContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

export default function ImageControls() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const storageUrl = import.meta.env.VITE_STORAGE_URL
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
  } = useImageContext()

  const updateImage = async (endpoint: string, value: number, setter: (value: number) => void) => {
    try {
      const response = await fetch(`${apiBaseUrl}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [endpoint]: value }),
      })
      const data = await response.json()
      setPreview(`${storageUrl}/${data.previewUrl}`)
      setter(value)
    } catch (error) {
      console.error(`Error processing ${endpoint}:`, error)
    }
  }

  useEffect(() => {
    if (brightness !== 100) updateImage("brightness", brightness, setBrightness)
  }, [brightness])

  useEffect(() => {
    if (contrast !== 100) updateImage("contrast", contrast, setContrast)
  }, [contrast])

  useEffect(() => {
    if (saturation !== 100) updateImage("saturation", saturation, setSaturation)
  }, [saturation])

  useEffect(() => {
    if (rotation !== 0) updateImage("rotate", rotation, setRotation)
  }, [rotation])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Image Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="brightness">Brightness</Label>
          <Slider
            id="brightness"
            min={0}
            max={200}
            step={1}
            value={[brightness]}
            onValueChange={(value) => setBrightness(value[0])}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contrast">Contrast</Label>
          <Slider
            id="contrast"
            min={0}
            max={200}
            step={1}
            value={[contrast]}
            onValueChange={(value) => setContrast(value[0])}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="saturation">Saturation</Label>
          <Slider
            id="saturation"
            min={0}
            max={200}
            step={1}
            value={[saturation]}
            onValueChange={(value) => setSaturation(value[0])}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rotation">Rotation</Label>
          <Slider
            id="rotation"
            min={0}
            max={360}
            step={1}
            value={[rotation]}
            onValueChange={(value) => setRotation(value[0])}
          />
        </div>
      </CardContent>
    </Card>
  )
}