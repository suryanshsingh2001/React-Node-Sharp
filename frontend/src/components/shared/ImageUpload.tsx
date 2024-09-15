
import React, { useState } from "react"
import { useImageContext } from "../context/ImageContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"

export default function ImageUpload() {
  const { setImage, setPreview } = useImageContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const storageUrl = import.meta.env.VITE_STORAGE_URL

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      if (!["image/png", "image/jpeg"].includes(file.type)) {
        setError("Please upload a PNG or JPEG image.")
        return
      }

      setLoading(true)
      setImage(file)
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
        setPreview(clientImage)


        //I want to clear form data after uploading image
      } catch (error) {
        console.error("Error uploading image:", error)
        setError("Failed to upload image. Please try again.")
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Card className="w-full flex flex-col max-w-sm space-x-4">
      <CardHeader>
        <CardTitle>Upload Image</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Input
            id="image-upload"
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleFileChange}
            disabled={loading}
            className={loading ? "cursor-not-allowed opacity-50" : ""}
          />
        </div>
        {loading && (
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </div>
        )}
      </CardContent>
    </Card>
  )
}