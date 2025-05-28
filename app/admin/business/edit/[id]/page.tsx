"use client"

// app/admin/business/edit/[id]/page.tsx
import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
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

const BUSINESS_CATEGORIES = [
  'Agriculture & Agribusiness',
  'Mining & Energy',
  'Technology & Fintech',
  'Infrastructure & Logistics',
  'Sustainable Business Practices',
  'Market Entry Strategies',
  'Risk Management',
  'Market Trends & Analysis',
  'Emerging Industries',
  'Case Studies'
]

const AFRICA_REGIONS = [
  'Eastern Africa',
  'Western Africa',
  'Central Africa',
  'Northern Africa',
  'Southern Africa',
  'Continental'
]

interface FormData {
  title: string
  thumbnail: string
  category: string
  region: string
  content: string
  excerpt: string
  status: 'draft' | 'published'
}

interface Article extends FormData {
  id: string
  author: string
  created_at: string
  updated_at: string
  views: number
}

interface User {
  username: string
  email: string
  role: string
}

export default function EditBusinessArticle() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    thumbnail: '',
    category: '',
    region: '',
    content: '',
    excerpt: '',
    status: 'draft'
  })
  const [originalArticle, setOriginalArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [user, setUser] = useState<User | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  const loadArticle = useCallback(async () => {
    if (!articleId) return
    
    setLoading(true)
    
    try {
      console.log('Loading article with ID:', articleId)

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single()

      if (error) {
        console.error('Database error:', error)
        throw new Error(`Database error: ${error.message || 'Unknown error'}`)
      }

      if (data) {
        console.log('Article loaded successfully:', data)
        setOriginalArticle({
          ...data,
          region: data.country || data.region // Map country field back to region for business articles
        })
        setFormData({
          title: data.title || '',
          thumbnail: data.thumbnail || '',
          category: data.category || '',
          region: data.country || data.region || '', // Map country field back to region
          content: data.content || '',
          excerpt: data.excerpt || '',
          status: data.status || 'draft'
        })
        setThumbnailPreview(data.thumbnail || '')
      } else {
        throw new Error('Article not found')
      }
    } catch (error) {
      console.error('Error loading article:', error)
      alert('Error loading article. Redirecting to article list.')
      router.push('/admin/business')
    } finally {
      setLoading(false)
    }
  }, [articleId, router])

  useEffect(() => {
    // Check authentication
    if (typeof window !== 'undefined') {
      const sessionData = sessionStorage.getItem('admin_session')
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData) as User
          setUser(session)
          // Load article data after authentication is confirmed
          loadArticle()
        } catch {
          router.push('/admin/login')
          return
        }
      } else {
        router.push('/admin/login')
        return
      }
    }
  }, [loadArticle, router])

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
    if (!formData.region) {
      newErrors.region = 'Region is required'
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!validateForm() || !originalArticle) return

    setSaving(true)
    
    try {
      const updatedData = {
        title: formData.title.trim(),
        thumbnail: formData.thumbnail,
        category: formData.category,
        country: formData.region, // Using country field to store region for business articles
        content: formData.content,
        excerpt: formData.excerpt || generateExcerpt(formData.content),
        status,
        updated_at: new Date().toISOString()
      }

      console.log('Updating business article:', updatedData)

      const { data, error } = await supabase
        .from('articles')
        .update(updatedData)
        .eq('id', articleId)
        .select()

      if (error) {
        console.error('Database error:', error)
        throw new Error(`Database error: ${error.message || 'Unknown error'}`)
      }

      console.log('Business article updated successfully:', data)

      // Show success message
      alert(`Article ${status === 'published' ? 'published' : 'saved as draft'} successfully!`)
      
      // Redirect to article list
      router.push('/admin/business')
      
    } catch (error) {
      console.error('Error updating business article:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error updating article. Please try again.'
      alert(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const clearThumbnail = () => {
    setThumbnailPreview('')
    setFormData(prev => ({ ...prev, thumbnail: '' }))
    setErrors(prev => ({ ...prev, thumbnail: '' }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0F4007]"></div>
      </div>
    )
  }

  if (!user || !originalArticle) {
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
                href="/admin/business"
                className="flex items-center gap-2 text-gray-600 hover:text-[#0F4007] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Business News
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Business Article</h1>
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
                  placeholder="Enter business article title..."
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

              {/* Category and Region */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent transition-all ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Category</option>
                    {BUSINESS_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
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
                    Africa Region *
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent transition-all ${
                      errors.region ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Region</option>
                    {AFRICA_REGIONS.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  {errors.region && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.region}
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
                          <p className="text-lg font-medium text-gray-700 mb-2">Upload New Thumbnail</p>
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
                  placeholder="Brief description of the business article..."
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
                    placeholder="Write your business article content here..."
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
                  href="/admin/business"
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancel
                </Link>
                
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleSubmit('draft')}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Draft'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleSubmit('published')}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0F4007] hover:bg-[#0d3506] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Globe className="w-4 h-4" />
                    {saving ? 'Publishing...' : 'Publish Article'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Article Info */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Author:</span> {originalArticle.author}
            </div>
            <div>
              <span className="font-medium">Created:</span> {new Date(originalArticle.created_at).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span> {new Date(originalArticle.updated_at).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Status:</span> 
              <span className={`ml-1 px-2 py-1 text-xs font-medium rounded-full ${
                originalArticle.status === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {originalArticle.status}
              </span>
            </div>
            <div>
              <span className="font-medium">Views:</span> {originalArticle.views.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}