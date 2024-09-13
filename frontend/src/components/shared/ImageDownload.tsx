import { useState } from 'react'
import { useImageContext } from '../context/ImageContext'

export default function ImageDownload() {
  const { image } = useImageContext()
  const [format, setFormat] = useState<'png' | 'jpeg'>('png')

  const handleDownload = async () => {
    if (!image) return

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ format }),
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `processed_image.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  return (
    <div className="mt-4">
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value as 'png' | 'jpeg')}
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
  )
}