'use client'

import React, { useState, useEffect, useRef } from "react"
import { useImageContext } from "../context/ImageContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Upload, X } from "lucide-react"


export default function ImageUpload() {
  const { setImage, setPreview, image,clearAll } = useImageContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const storageUrl = import.meta.env.VITE_STORAGE_URL

  useEffect(() => {
    if (!image) {
      setFileName(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [image])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

    clearAll()
    const file = e.target.files?.[0]

    if (file) {
      if (!["image/png", "image/jpeg"].includes(file.type)) {
        setError("Please upload a PNG or JPEG image.")
        return
      }

      setLoading(true)
      setImage(file)
      setFileName(file.name)
      setError(null)
      const formData = new FormData()
      formData.append("image", file)

      try {
        const response = await fetch(`${apiBaseUrl}/upload`, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to upload image")
        }

        const data = await response.json()

        const clientImage = `${storageUrl}/${data.previewUrl}`
        console.log(clientImage)
        setPreview(clientImage)
      } catch (error) {
        console.error("Error uploading image:", error)
        setError("Failed to upload image. Please try again.")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleClear = () => {
    setImage(null)
    setPreview("")
    setFileName(null)


    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle
          className="text-lg font-semibold"
        >Upload Image</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="grid w-full items-center gap-1.5">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              id="image-upload"
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleFileChange}
              disabled={loading}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              {fileName ? 'Change Image' : 'Upload Image'}
            </Button>
            {fileName && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleClear}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {fileName && <p className="text-sm text-muted-foreground mt-1">{fileName}</p>}
          <p className="text-sm text-muted-foreground mt-1">Accepted formats: PNG, JPEG</p>
        </div>
        {loading && (
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </div>
        )}
      </CardContent>
    </Card>
  )
}