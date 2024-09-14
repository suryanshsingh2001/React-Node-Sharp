'use client'

import { ImageProvider } from '../components/context/ImageContext'
import ImageUpload from '../components/shared/ImageUpload'
import ImageControls from '../components/shared/ImageControls'
import ImageDownload from '../components/shared/ImageDownload'
import ImagePreview from '../components/shared/ImagePreview'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/layout/ToggleButton'
import { Github } from 'lucide-react'


export default function Home() {
  return (
    <ImageProvider>
      <div className="container mx-auto p-2 space-y-6">
      <header className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold">Image Processor</h1>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Button variant="ghost" size="icon" asChild>
              <a href="https://github.com/yourusername/image-processor" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <ImageUpload />
            <ImageControls />
            <ImageDownload />
          </div>
          <div className="lg:col-span-8">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Image Preview</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-4rem)]">
                <ImagePreview />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ImageProvider>
  )
}