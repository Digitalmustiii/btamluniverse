"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { Save, Eye, AlertCircle, X, Calendar, DollarSign, Globe, ArrowLeft, ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="border rounded-lg p-4 min-h-[500px] bg-gray-50 animate-pulse">Loading editor...</div>
})

const CONTINENTS = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania']
const SCHOLARSHIP_TYPES = ['Undergraduate', 'Masters', 'PhD', 'Language Program', 'Research Fellowship', 'Exchange Program', 'Professional Development', 'Certificate Program', 'Summer Program', 'General Scholarship']
const FUNDING_TYPES = ['Fully Funded', 'Partial Funding', 'Tuition Only', 'Living Expenses Only', 'Travel Grant', 'Research Grant', 'Merit-Based', 'Need-Based']

interface FormData {
  title: string; thumbnail: string; continent: string; country: string
  scholarshipTypes: string[]; fundingTypes: string[]; amount: string
  deadline: string; applicationUrl: string; content: string; excerpt: string
  status: 'draft' | 'published'
}

interface User { username: string; email: string; role: string }

export default function EditScholarship() {
  const router = useRouter()
  const params = useParams()
  const scholarshipId = params.id as string

  const [formData, setFormData] = useState<FormData>({
    title: '', thumbnail: '', continent: '', country: '', scholarshipTypes: [], 
    fundingTypes: [], amount: '', deadline: '', applicationUrl: '', content: '', 
    excerpt: '', status: 'draft'
  })
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [user, setUser] = useState<User | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [notFound, setNotFound] = useState(false)

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

  useEffect(() => {
    const loadScholarship = async () => {
      if (!scholarshipId) return

      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', scholarshipId)
          .eq('category', 'Scholarship')
          .single()

        if (error || !data) {
          setNotFound(true)
          return
        }

        const scholarshipTypes = data.scholarship_types ? 
          data.scholarship_types.split(', ').filter(Boolean) : []
        const fundingTypes = data.funding_types ? 
          data.funding_types.split(', ').filter(Boolean) : []

        setFormData({
          title: data.title || '', thumbnail: data.thumbnail || '', continent: data.continent || '',
          country: data.country || '', scholarshipTypes, fundingTypes, amount: data.amount || '',
          deadline: data.deadline || '', applicationUrl: data.application_url || '',
          content: data.content || '', excerpt: data.excerpt || '', status: data.status || 'draft'
        })
        setThumbnailPreview(data.thumbnail || '')
      } catch {
        setNotFound(true)
      } finally {
        setInitialLoading(false)
      }
    }

    if (scholarshipId) {
      loadScholarship()
    }
  }, [scholarshipId])

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleMultiSelect = (field: 'scholarshipTypes' | 'fundingTypes', value: string) => {
    setFormData(prev => {
      const currentValues = prev[field]
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value]
      return { ...prev, [field]: newValues }
    })
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    if (!file.type.startsWith('image/')) throw new Error('Please select a valid image file')
    if (file.size > 5 * 1024 * 1024) throw new Error('Image size must be less than 5MB')

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `scholarships/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
    
    const { error } = await supabase.storage
      .from('images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false })

    if (error) throw new Error(`Upload failed: ${error.message}`)

    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName)
    if (!publicUrl) throw new Error('Failed to get public URL for uploaded image')
    return publicUrl
  }

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setErrors(prev => ({ ...prev, thumbnail: '' }))

    try {
      const reader = new FileReader()
      reader.onload = (e) => setThumbnailPreview(e.target?.result as string)
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

  const generateExcerpt = (content: string): string => {
    const plainText = content.replace(/<[^>]*>/g, '').trim()
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText
  }

  const clearThumbnail = () => {
    setThumbnailPreview('')
    setFormData(prev => ({ ...prev, thumbnail: '' }))
    setErrors(prev => ({ ...prev, thumbnail: '' }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.thumbnail) newErrors.thumbnail = 'Thumbnail is required'
    if (!formData.continent) newErrors.continent = 'Continent is required'
    if (!formData.country.trim()) newErrors.country = 'Country is required'
    if (formData.scholarshipTypes.length === 0) newErrors.scholarshipTypes = 'At least one scholarship type is required'
    if (formData.fundingTypes.length === 0) newErrors.fundingTypes = 'At least one funding type is required'
    if (!formData.deadline) newErrors.deadline = 'Deadline is required'
    if (!formData.content.trim()) newErrors.content = 'Content is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!validateForm()) return
    setLoading(true)
    
    try {
      const scholarshipData = {
        title: formData.title.trim(), thumbnail: formData.thumbnail, category: 'Scholarship',
        country: formData.country.trim(), content: formData.content,
        excerpt: formData.excerpt.trim() || generateExcerpt(formData.content), status,
        author: user?.username || 'Admin', continent: formData.continent,
        scholarship_types: formData.scholarshipTypes.join(', '),
        funding_types: formData.fundingTypes.join(', '),
        amount: formData.amount.trim() || null, deadline: formData.deadline,
        application_url: formData.applicationUrl.trim() || null,
        updated_at: new Date().toISOString()
      }

      const cleanedData = Object.fromEntries(
        Object.entries(scholarshipData).map(([key, value]) => [key, value === '' ? null : value])
      )

      const { error } = await supabase
        .from('articles')
        .update(cleanedData)
        .eq('id', scholarshipId)

      if (error) throw new Error(`Database error: ${error.message}`)

      alert(`Scholarship ${status === 'published' ? 'published' : 'saved as draft'} successfully!`)
      router.push('/admin/scholarship')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error updating scholarship. Please try again.'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0F4007]"></div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Scholarship Not Found</h2>
          <p className="text-gray-600 mb-6">The scholarship you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/admin/scholarship" className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F4007] text-white rounded-lg hover:bg-[#0d3506] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Scholarships
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/scholarship" className="flex items-center gap-2 text-gray-600 hover:text-[#0F4007] transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Back to Scholarships
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Scholarship</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Welcome, {user.username}</span>
              <div className="w-8 h-8 bg-[#0F4007] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{user.username.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-8">
            <form className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Scholarship Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent transition-all ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.title && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Scholarship Thumbnail *</label>
                {thumbnailPreview ? (
                  <div className="relative">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                      <Image src={thumbnailPreview} alt="Thumbnail preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                        <button type="button" onClick={clearThumbnail} className="opacity-0 hover:opacity-100 bg-red-500 text-white p-2 rounded-full transition-opacity duration-200"><X className="w-5 h-5" /></button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <input type="file" accept="image/*" onChange={handleThumbnailUpload} disabled={uploadingImage} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${errors.thumbnail ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-[#0F4007] hover:bg-gray-50'}`}>
                      {uploadingImage ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F4007] mb-2"></div>
                          <p className="text-sm text-gray-600">Uploading image...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
                          <p className="text-lg font-medium text-gray-700 mb-2">Upload Thumbnail</p>
                          <p className="text-sm text-gray-500 text-center px-4">Click to select an image or drag and drop<br /><span className="text-xs">PNG, JPG, GIF up to 5MB</span></p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {errors.thumbnail && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.thumbnail}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Continent *</label>
                  <select
                    value={formData.continent}
                    onChange={(e) => handleInputChange('continent', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent transition-all ${errors.continent ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Continent</option>
                    {CONTINENTS.map(continent => <option key={continent} value={continent}>{continent}</option>)}
                  </select>
                  {errors.continent && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.continent}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent transition-all ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.country && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.country}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Scholarship Types * (Select multiple)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg bg-gray-50">
                  {SCHOLARSHIP_TYPES.map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors">
                      <input type="checkbox" checked={formData.scholarshipTypes.includes(type)} onChange={() => handleMultiSelect('scholarshipTypes', type)} className="w-4 h-4 text-[#0F4007] border-gray-300 rounded focus:ring-[#0F4007]" />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
                {formData.scholarshipTypes.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.scholarshipTypes.map(type => (
                      <span key={type} className="inline-flex items-center gap-1 px-3 py-1 bg-[#0F4007] text-white text-sm rounded-full">
                        {type}
                        <button type="button" onClick={() => handleMultiSelect('scholarshipTypes', type)} className="hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
                {errors.scholarshipTypes && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.scholarshipTypes}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Funding Types * (Select multiple)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg bg-gray-50">
                  {FUNDING_TYPES.map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors">
                      <input type="checkbox" checked={formData.fundingTypes.includes(type)} onChange={() => handleMultiSelect('fundingTypes', type)} className="w-4 h-4 text-[#0F4007] border-gray-300 rounded focus:ring-[#0F4007]" />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
                {formData.fundingTypes.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.fundingTypes.map(type => (
                      <span key={type} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                        {type}
                        <button type="button" onClick={() => handleMultiSelect('fundingTypes', type)} className="hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
                {errors.fundingTypes && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.fundingTypes}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Scholarship Amount (Optional)</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      placeholder="e.g., $50,000, Full tuition, Variable"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Application Deadline *</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent transition-all ${errors.deadline ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  </div>
                  {errors.deadline && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.deadline}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Application URL (Optional)</label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    value={formData.applicationUrl}
                    onChange={(e) => handleInputChange('applicationUrl', e.target.value)}
                    placeholder="https://example.com/apply"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Scholarship Excerpt
                  <span className="text-sm font-normal text-gray-500 ml-2">(Optional - will be auto-generated if empty)</span>  
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Brief description of the scholarship..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Scholarship Details *</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value: string) => handleInputChange('content', value)}
                    placeholder="Write detailed information about the scholarship, eligibility criteria, application process, etc..."
                  />
                </div>
                {errors.content && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.content}</p>}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <Link href="/admin/scholarship" className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors">Cancel</Link>
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
                    <Eye className="w-4 h-4" />
                    {loading ? 'Publishing...' : 'Publish Scholarship'}
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