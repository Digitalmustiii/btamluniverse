"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  Save,
  Globe,
  AlertCircle,
  X,
  ArrowLeft,
  ImageIcon
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import RichTextEditor from '@/components/admin/RichTextEditor'

const REGIONS = {
  'Eastern Africa': ['Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'Burundi', 'Ethiopia', 'Somalia', 'South Sudan', 'Eritrea', 'Djibouti'],
  'Western Africa': ['Nigeria', 'Ghana', 'Senegal', 'Mali', 'Burkina Faso', 'Niger', 'Guinea', 'Sierra Leone', 'Liberia', 'Ivory Coast', 'Togo', 'Benin', 'Gambia', 'Guinea-Bissau', 'Cape Verde', 'Mauritania'],
  'Central Africa': ['DR Congo', 'Cameroon', 'Central African Republic', 'Chad', 'Gabon', 'Equatorial Guinea', 'Republic of Congo', 'São Tomé and Príncipe'],
  'Northern Africa': ['Egypt', 'Libya', 'Tunisia', 'Algeria', 'Morocco', 'Sudan'],
  'Southern Africa': ['South Africa', 'Zimbabwe', 'Botswana', 'Namibia', 'Zambia', 'Malawi', 'Mozambique', 'Angola', 'Lesotho', 'Eswatini', 'Madagascar', 'Mauritius', 'Seychelles', 'Comoros']
}

interface FormData {
  title: string
  thumbnail: string
  category: string
  country: string
  content: string
  excerpt: string
  status: 'draft' | 'published'
}

interface User {
  username: string
  email: string
  role: string
}

export default function CreateAfricaArticle() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    title: '',
    thumbnail: '',
    category: '',
    country: '',
    content: '',
    excerpt: '',
    status: 'draft'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [user, setUser] = useState<User | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    // Check authentication
    if (typeof window !== 'undefined') {
      const sessionData = sessionStorage.getItem('admin_session')
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData) as User
          setUser(session)
        } catch {
          router.push('/admin/login')
        }
      } else {
        router.push('/admin/login')
      }
    }
  }, [router])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file')
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB')
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const fileName = `articles/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
      
      console.log('Uploading file:', fileName, 'Size:', file.size, 'Type:', file.type)
      
      // Upload to Supabase Storage directly with the file
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Supabase upload error:', error)
        throw new Error(`Upload failed: ${error.message}`)
      }

      console.log('Upload successful:', data)

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      console.log('Public URL:', publicUrl)

      if (!publicUrl) {
        throw new Error('Failed to get public URL for uploaded image')
      }

      return publicUrl
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setErrors(prev => ({ ...prev, thumbnail: '' }))

    try {
      // Create preview first
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setThumbnailPreview(result)
        console.log('Preview created successfully')
      }
      reader.readAsDataURL(file)

      // Upload to Supabase Storage
      console.log('Starting upload process...')
      const imageUrl = await uploadImageToSupabase(file)
      
      setFormData(prev => ({ ...prev, thumbnail: imageUrl }))
      console.log('Image URL set in form data:', imageUrl)
      
    } catch (error) {
      console.error('Error in handleThumbnailUpload:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image. Please try again.'
      setErrors(prev => ({ ...prev, thumbnail: errorMessage }))
      setThumbnailPreview('')
      setFormData(prev => ({ ...prev, thumbnail: '' }))
    } finally {
      setUploadingImage(false)
    }
  }

  const generateExcerpt = (content: string): string => {
    // Remove HTML tags and get first 150 characters
    const plainText = content.replace(/<[^>]*>/g, '').trim()
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.thumbnail) {
      newErrors.thumbnail = 'Thumbnail is required'
    }
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    if (!formData.country) {
      newErrors.country = 'Country is required'
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!validateForm()) return

    setLoading(true)
    
    try {
      const articleData = {
        title: formData.title.trim(),
        thumbnail: formData.thumbnail,
        category: formData.category,
        country: formData.country,
        content: formData.content,
        excerpt: formData.excerpt || generateExcerpt(formData.content),
        status,
        author: user?.username || 'Admin',
        views: 0
      }

      console.log('Submitting article data:', articleData)

      const { data, error } = await supabase
        .from('articles')
        .insert([articleData])
        .select()

      if (error) {
        console.error('Database error:', error)
        throw new Error(`Database error: ${error.message}`)
      }

      console.log('Article created successfully:', data)

      // Show success message
      alert(`Article ${status === 'published' ? 'published' : 'saved as draft'} successfully!`)
      
      // Redirect to article list
      router.push('/admin/africa')
      
    } catch (error) {
      console.error('Error creating article:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error creating article. Please try again.'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const clearThumbnail = () => {
    setThumbnailPreview('')
    setFormData(prev => ({ ...prev, thumbnail: '' }))
    setErrors(prev => ({ ...prev, thumbnail: '' }))
  }

  const getCountriesForRegion = (region: string): string[] => {
    return REGIONS[region as keyof typeof REGIONS] || []
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0F4007]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/africa"
                className="flex items-center gap-2 text-gray-600 hover:text-[#0F4007] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Articles
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Article</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Welcome, {user.username}</span>
              <div className="w-8 h-8 bg-[#0F4007] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-8">
            <form className="space-y-8">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Article Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter article title..."
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent transition-all ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Category and Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Region *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      handleInputChange('category', e.target.value)
                      handleInputChange('country', '') // Reset country when region changes
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent transition-all ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Region</option>
                    {Object.keys(REGIONS).map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    disabled={!formData.category}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent transition-all ${
                      errors.country ? 'border-red-500' : 'border-gray-300'
                    } ${!formData.category ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  >
                    <option value="">Select Country</option>
                    {formData.category && getCountriesForRegion(formData.category).map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.country}
                    </p>
                  )}
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Article Thumbnail *
                </label>
                
                {thumbnailPreview ? (
                  <div className="relative">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                      <Image
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={clearThumbnail}
                          className="opacity-0 hover:opacity-100 bg-red-500 text-white p-2 rounded-full transition-opacity duration-200"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      id="thumbnail"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      disabled={uploadingImage}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
                      errors.thumbnail ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-[#0F4007] hover:bg-gray-50'
                    }`}>
                      {uploadingImage ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F4007] mb-2"></div>
                          <p className="text-sm text-gray-600">Uploading image...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
                          <p className="text-lg font-medium text-gray-700 mb-2">Upload Thumbnail</p>
                          <p className="text-sm text-gray-500 text-center px-4">
                            Click to select an image or drag and drop<br />
                            <span className="text-xs">PNG, JPG, GIF up to 5MB</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {errors.thumbnail && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.thumbnail}
                  </p>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Article Excerpt
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (Optional - will be auto-generated if empty)
                  </span>
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Brief description of the article..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent transition-all"
                />
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Article Content *
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => handleInputChange('content', value)}
                    placeholder="Write your article content here..."
                  />
                </div>
                {errors.content && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.content}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <Link
                  href="/admin/africa"
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancel
                </Link>
                
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleSubmit('draft')}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Draft'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleSubmit('published')}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0F4007] hover:bg-[#0d3506] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Globe className="w-4 h-4" />
                    {loading ? 'Publishing...' : 'Publish Article'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}