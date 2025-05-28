//app/security/page.tsx
"use client"

// app/security/page.tsx
import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Footer from '@/app/components/Footer'
import Header from '../components/Header'
import { 
  Calendar, ArrowLeft, Shield, AlertTriangle, Eye, Lock,
  Clock
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

interface SecurityArticle {
  id: string
  title: string
  thumbnail: string
  category: string
  created_at: string
  status: 'published' | 'draft'
  content?: string
  excerpt?: string
  updated_at?: string
  threat_level?: string
  tags?: string
}

const SECURITY_CATEGORIES = [
  { value: 'Security Advisories', label: 'Security Advisories', icon: AlertTriangle, color: 'text-red-600 bg-red-100' },
  { value: 'Threat Intelligence', label: 'Threat Intelligence', icon: Eye, color: 'text-orange-600 bg-orange-100' },
  { value: 'Risk Mitigation', label: 'Risk Mitigation', icon: Shield, color: 'text-yellow-600 bg-yellow-100' },
  { value: 'Best Practices', label: 'Best Practices', icon: Lock, color: 'text-green-600 bg-green-100' }
]

const THREAT_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' }
]

export default function SecurityPage() {
  const [articles, setArticles] = useState<SecurityArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<SecurityArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<SecurityArticle | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const filterArticles = useCallback(() => {
    let filtered = articles

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(a => a.category === selectedCategory)
    }

    setFilteredArticles(filtered)
  }, [articles, selectedCategory])

  useEffect(() => {
    loadSecurityArticles()
  }, [])

  useEffect(() => {
    filterArticles()
  }, [filterArticles])

  const loadSecurityArticles = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .in('category', ['Security Advisories', 'Threat Intelligence', 'Risk Mitigation', 'Best Practices'])
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        setError('Failed to load security updates. Please try again later.')
        setArticles([])
      } else {
        setArticles(data || [])
      }
    } catch (error) {
      console.error('Error loading security articles:', error)
      setError('Failed to load security updates. Please try again later.')
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (thumbnail: string): string => {
    if (!thumbnail) return '/placeholder-image.jpg'
    if (thumbnail.startsWith('http')) return thumbnail
    
    const { data } = supabase.storage.from('images').getPublicUrl(thumbnail)
    return data.publicUrl || '/placeholder-image.jpg'
  }

  const handleImageError = (articleId: string) => {
    setImageErrors(prev => ({ ...prev, [articleId]: true }))
  }

  const getFallbackImage = () => {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' text-anchor='middle' dominant-baseline='middle' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3EImage unavailable%3C/text%3E%3C/svg%3E"
  }

  const handleArticleClick = async (article: SecurityArticle) => {
    setSelectedArticle(article)
  }

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  const parseMultipleValues = (value: string): string[] => {
    return value ? value.split(', ').filter(v => v.trim()) : []
  }

  const getCategoryInfo = (category: string) => {
    return SECURITY_CATEGORIES.find(cat => cat.value === category) || SECURITY_CATEGORIES[0]
  }

  const getThreatLevelInfo = (level: string) => {
    return THREAT_LEVELS.find(t => t.value === level)
  }

  if (selectedArticle) {
    const categoryInfo = getCategoryInfo(selectedArticle.category)
    const CategoryIcon = categoryInfo.icon
    const threatInfo = getThreatLevelInfo(selectedArticle.threat_level || '')
    const tags = parseMultipleValues(selectedArticle.tags || '')

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => setSelectedArticle(null)}
            className="flex items-center gap-2 text-[#0F4007] hover:text-[#1a6b0f] mb-8 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Security Updates
          </button>

          <article className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="relative h-64 md:h-96">
              <Image
                src={imageErrors[selectedArticle.id] ? getFallbackImage() : getImageUrl(selectedArticle.thumbnail)}
                alt={selectedArticle.title}
                fill
                className="object-cover"
                onError={() => handleImageError(selectedArticle.id)}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 flex gap-3">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${categoryInfo.color}`}>
                  <CategoryIcon className="w-4 h-4" />
                  {selectedArticle.category}
                </div>
                {threatInfo && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${threatInfo.color}`}>
                    {threatInfo.label} Risk
                  </span>
                )}
              </div>
            </div>

            <div className="p-8 md:p-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {selectedArticle.title}
              </h1>

              <div className="mb-8">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#0F4007]" />
                  <div>
                    <div className="font-semibold text-gray-900">Published</div>
                    <div className="text-gray-600">{formatDateShort(selectedArticle.created_at)}</div>
                  </div>
                </div>
              </div>

              {tags.length > 0 && (
                <div className="mb-8">
                  <div className="font-semibold text-gray-900 mb-3">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="prose prose-lg max-w-none">
                {selectedArticle.content ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
                ) : selectedArticle.excerpt ? (
                  <div className="text-gray-600 leading-relaxed">
                    <p>{selectedArticle.excerpt}</p>
                  </div>
                ) : (
                  <div className="text-gray-600 leading-relaxed">
                    <p>This security update provides important information about security best practices and threat intelligence.</p>
                  </div>
                )}
              </div>
            </div>
          </article>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight
              bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] bg-clip-text text-transparent">
            Security Updates
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Stay informed with the latest security advisories, threat intelligence, and best practices
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-[#0F4007] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              All Categories
            </button>
            {SECURITY_CATEGORIES.map(category => {
              const Icon = category.icon
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-[#0F4007] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              )
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F4007]"></div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Something went wrong</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">{error}</p>
              <button
                onClick={loadSecurityArticles}
                className="inline-flex items-center px-6 py-3 bg-[#0F4007] text-white rounded-lg hover:bg-[#0d3506] transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#0F4007] to-[#1a6b0f] rounded-full flex items-center justify-center mx-auto mb-8">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">No Security Updates Found</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                No security updates match your current filters. Try adjusting your search criteria.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => {
              const categoryInfo = getCategoryInfo(article.category)
              const CategoryIcon = categoryInfo.icon
              const threatInfo = getThreatLevelInfo(article.threat_level || '')
              
              return (
                <article
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={imageErrors[article.id] ? getFallbackImage() : getImageUrl(article.thumbnail)}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={() => handleImageError(article.id)}
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                        <CategoryIcon className="w-3 h-3" />
                        {article.category.split(' ')[0]}
                      </div>
                      {threatInfo && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${threatInfo.color}`}>
                          {threatInfo.label}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#0F4007] transition-colors">
                      {article.title}
                    </h3>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Published {formatDateShort(article.created_at)}</span>
                      </div>
                    </div>

                    {article.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}