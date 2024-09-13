    import React from 'react'
    import { useImageContext } from '../context/ImageContext'

    export default function ImageUpload() {
    const { setImage, setPreview } = useImageContext()

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
        setImage(file)
        const formData = new FormData()
        formData.append('image', file)

        try {
            const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            })
            const data = await response.json()
            setPreview(data.previewUrl)
        } catch (error) {
            console.error('Error uploading image:', error)
        }
        }
    }

    return (
        <div className="mb-4">
        <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
        />
        </div>
    )
    }