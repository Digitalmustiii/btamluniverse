//components/ImageUpload
import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, FileImage } from 'lucide-react'

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  currentImage?: string
  onRemoveImage?: () => void
  label?: string
}

export default function ImageUpload({ 
  onImageSelect, 
  currentImage, 
  onRemoveImage,
  label = "Upload Thumbnail"
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    onImageSelect(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onRemoveImage?.()
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {preview ? (
        <div className="relative">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 z-10"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`relative w-full h-48 border-2 border-dashed rounded-lg transition-colors duration-200 cursor-pointer hover:border-[#0F4007] hover:bg-green-50 ${
            dragActive ? 'border-[#0F4007] bg-green-50' : 'border-gray-300 bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <div className="p-3 bg-white rounded-full shadow-sm mb-3">
              {dragActive ? (
                <Upload className="w-6 h-6 text-[#0F4007]" />
              ) : (
                <FileImage className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <p className="text-sm font-medium mb-1">
              {dragActive ? 'Drop image here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-400">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      )}
    </div>
  )
}