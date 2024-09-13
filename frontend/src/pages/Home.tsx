import { ImageProvider } from '../components/context/ImageContext'
import ImageUpload from '../components/shared/ImageUpload'
import ImageControls from '../components/shared/ImageControls'
import ImageDownload from '../components/shared/ImageDownload'
import ImagePreview from '../components/shared/ImagePreview'

export default function Home() {
  return (
    <ImageProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Image Processor</h1>
        <ImageUpload />
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <ImageControls />
            <ImageDownload />
          </div>
          <div className="w-full md:w-2/3">
            <ImagePreview />
          </div>
        </div>
      </div>
    </ImageProvider>
  )
}