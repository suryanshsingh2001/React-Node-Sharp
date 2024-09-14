import { useImageContext } from '../context/ImageContext'

export default function ImagePreview() {
  const { preview } = useImageContext()
  console.log(preview)

  return (
    <div className="border rounded-lg overflow-hidden">
      {preview ? (
        <img src={preview} alt="Preview" className="w-full h-auto" />
      ) : (
        <div className=" flex items-center justify-center bg-gray-100 text-gray-400 h-screen">
          No image uploaded
        </div>
      )}
    </div>
  )
}