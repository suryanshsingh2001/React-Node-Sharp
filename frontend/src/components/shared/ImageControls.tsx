import { useEffect, useState } from "react"
import { useImageContext } from "../context/ImageContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

// Debounce function to limit the frequency of API calls
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timer: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

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

  // State to store debounced values
  const [debouncedValues, setDebouncedValues] = useState({
    brightness,
    contrast,
    saturation,
    rotation,
  })

  // Debounced API call for updating image based on slider input
  const updateImage = debounce(async (endpoint: string, value: number) => {
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
    } catch (error) {
      console.error(`Error updating ${endpoint}:`, error)
    }
  }, 300) // 300ms delay

  // Unified useEffect to handle all updates
  useEffect(() => {
    const { brightness, contrast, saturation, rotation } = debouncedValues

    if (brightness !== 100) updateImage("brightness", brightness)
    if (contrast !== 100) updateImage("contrast", contrast)
    if (saturation !== 100) updateImage("saturation", saturation)
    if (rotation !== 0) updateImage("rotate", rotation)
  }, [debouncedValues])

  // Slider change handler that updates both local and debounced state
  const handleSliderChange = (type: string, value: number) => {
    setDebouncedValues((prev) => ({ ...prev, [type]: value }))

    // Update individual states in the context
    switch (type) {
      case "brightness":
        setBrightness(value)
        break
      case "contrast":
        setContrast(value)
        break
      case "saturation":
        setSaturation(value)
        break
      case "rotation":
        setRotation(value)
        break
      default:
        break
    }
  }

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
            onValueChange={(value) => handleSliderChange("brightness", value[0])}
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
            onValueChange={(value) => handleSliderChange("contrast", value[0])}
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
            onValueChange={(value) => handleSliderChange("saturation", value[0])}
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
            onValueChange={(value) => handleSliderChange("rotation", value[0])}
          />
        </div>
      </CardContent>
    </Card>
  )
}
