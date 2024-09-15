import { useEffect, useState } from "react"
import { useImageContext } from "../context/ImageContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

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

  const [debouncedValues, setDebouncedValues] = useState({
    brightness,
    contrast,
    saturation,
    rotation,
  })

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
  }, 300)

  useEffect(() => {
    const { brightness, contrast, saturation, rotation } = debouncedValues

    if (brightness !== 100) updateImage("brightness", brightness)
    if (contrast !== 100) updateImage("contrast", contrast)
    if (saturation !== 100) updateImage("saturation", saturation)
    if (rotation !== 0) updateImage("rotation", rotation)
  }, [debouncedValues])

  const handleSliderChange = (type: string, value: number) => {
    setDebouncedValues((prev) => ({ ...prev, [type]: value }))
    updateContextValue(type, value)
  }

  const handleInputChange = (type: string, value: string) => {
    const numValue = Number(value)
    if (!isNaN(numValue)) {
      setDebouncedValues((prev) => ({ ...prev, [type]: numValue }))
      updateContextValue(type, numValue)
    }
  }

  const updateContextValue = (type: string, value: number) => {
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

  const renderControl = (
    type: string,
    value: number,
    min: number,
    max: number,
    step: number
  ) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</Label>
        <Input
          type="number"
          id={`${type}-input`}
          value={value}
          onChange={(e) => handleInputChange(type, e.target.value)}
          className="w-20 text-right"
          min={min}
          max={max}
          step={step}
        />
      </div>
      <Slider
        id={type}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(value) => handleSliderChange(type, value[0])}
      />
    </div>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Image Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderControl("brightness", brightness, 0, 200, 1)}
        {renderControl("contrast", contrast, 0, 200, 1)}
        {renderControl("saturation", saturation, 0, 200, 1)}
        {renderControl("rotation", rotation, 0, 360, 1)}
      </CardContent>
    </Card>
  )
}