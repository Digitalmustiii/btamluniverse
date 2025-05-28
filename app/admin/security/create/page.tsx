"use client"

// app/admin/security/create/page.tsx
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Save, Eye, X, Shield, AlertTriangle, Lock, FileText, 
   ImageIcon, AlertCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="border rounded-lg p-4 min-h-[300px] bg-gray-50 animate-pulse">Loading editor...</div>
})

const SECURITY_CATEGORIES = [
  { value: 'Security Advisories', label: 'Security Advisories', icon: AlertTriangle, color: 'text-red-600' },
  { value: 'Threat Intelligence', label: 'Threat Intelligence', icon: Eye, color: 'text-orange-600' },
  { value: 'Risk Mitigation', label: 'Risk Mitigation', icon: Shield, color: 'text-yellow-600' },
  { value: 'Best Practices', label: 'Best Practices', icon: Lock, color: 'text-green-600' }
]

const AFRICAN_COUNTRIES = [
 "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde",
    "Cameroon", "Central African Republic", "Chad", "Comoros", "Democratic Republic of the Congo",
    "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia",
    "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya",
    "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania",
    "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Republic of the Congo",
    "Rwanda", "São Tomé and Príncipe", "Senegal", "Seychelles", "Sierra Leone", "Somalia",
    "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda",
    "Zambia", "Zimbabwe"
].sort()

const THREAT_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' }
]

interface FormData {
  title: string
  content: string
  thumbnail: string
  category: string
  country: string
  threatLevel: string
  tags: string[]
  excerpt: string
  status: 'draft' | 'published'
}

interface User {
  username: string
  email: string
  role: string
}

export default function CreateSecurityPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    title: '', content: '', thumbnail: '', category: '', country: '', 
    threatLevel: '', tags: [], excerpt: '', status: 'draft'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [user, setUser] = useState<User | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
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

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file')
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB')
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const fileName = `security/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
      
      const { error } = await supabase.storage
        .from('images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (error) {
        throw new Error(`Upload failed: ${error.message}`)
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

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
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      const imageUrl = await uploadImageToSupabase(file)
      setFormData(prev => ({ ...prev, thumbnail: imageUrl }))
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image. Please try again.'
      setErrors(prev => ({ ...prev, thumbnail: errorMessage }))
      setThumbnailPreview('')
      setFormData(prev => ({ ...prev, thumbnail: '' }))
    } finally {
      setUploadingImage(false)
    }
  }

  const clearThumbnail = () => {
    setThumbnailPreview('')
    setFormData(prev => ({ ...prev, thumbnail: '' }))
    setErrors(prev => ({ ...prev, thumbnail: '' }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const generateExcerpt = (content: string): string => {
    const plainText = content.replace(/<[^>]*>/g, '').trim()
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.thumbnail) newErrors.thumbnail = 'Thumbnail is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.country) newErrors.country = 'Country is required'
    if (!formData.content.trim()) newErrors.content = 'Content is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!validateForm()) return

    setLoading(true)
    
    try {
      const securityData = {
        title: formData.title.trim(),
        thumbnail: formData.thumbnail,
        category: formData.category,
        country: formData.country,
        content: formData.content,
        excerpt: formData.excerpt.trim() || generateExcerpt(formData.content),
        status,
        author: user?.username || 'Admin',
        views: 0,
        // Security-specific data
        threat_level: formData.threatLevel || null,
        tags: formData.tags.join(', ') || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const cleanedData = Object.fromEntries(
        Object.entries(securityData).map(([key, value]) => [
          key, 
          value === '' ? null : value
        ])
      )

      const { error } = await supabase
        .from('articles')
        .insert([cleanedData])
        .select()

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      alert(`Security article ${status === 'published' ? 'published' : 'saved as draft'} successfully!`)
      router.push('/admin/security')
      
    } catch (error) {
      console.error('Error creating security article:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error creating article. Please try again.'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
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
                href="/admin/security"
                className="flex items-center gap-2 text-gray-600 hover:text-[#0F4007] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Security
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#0F4007]" />
                <h1 className="text-2xl font-bold text-gray-900">Create Security Update</h1>
              </div>
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
                  Security Update Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter security update title..."
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

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Security Update Thumbnail *
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

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Security Category *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SECURITY_CATEGORIES.map((category) => {
                    const IconComponent = category.icon
                    return (
                      <div
                        key={category.value}
                        onClick={() => handleInputChange('category', category.value)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.category === category.value
                            ? 'border-[#0F4007] bg-[#0F4007]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className={`w-5 h-5 ${category.color}`} />
                          <h3 className="font-medium text-gray-900">{category.label}</h3>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {errors.category && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Country and Threat Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country Focus *
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent transition-all ${
                      errors.country ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Country</option>
                    {AFRICAN_COUNTRIES.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.country}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Threat Level
                  </label>
                  <select
                    value={formData.threatLevel}
                    onChange={(e) => handleInputChange('threatLevel', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent transition-all"
                  >
                    <option value="">Select Threat Level</option>
                    {THREAT_LEVELS.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add a tag..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-[#0F4007] text-white rounded-lg hover:bg-[#0d3506] transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-blue-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Security Update Excerpt
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (Optional - will be auto-generated if empty)
                  </span>  
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Brief description of the security update..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent transition-all"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Security Update Content *
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value: string) => handleInputChange('content', value)}
                    placeholder="Write detailed security information, threat analysis, mitigation steps, etc..."
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
                  href="/admin/security"
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
                    <FileText className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Draft'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleSubmit('published')}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0F4007] hover:bg-[#0d3506] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Publishing...' : 'Publish Security Update'}
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