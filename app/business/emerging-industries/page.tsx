// app/business/emerging-industries/page.tsx
"use client"

// app/business/emerging-industries/page.tsx
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Footer from '@/app/components/Footer'
import Header from '../../components/Header'
import { Calendar, ArrowLeft, Clock, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

interface Article {
  id: string
  title: string
  thumbnail: string
  category: string
  country: string
  author: string
  created_at: string
  status: 'published' | 'draft'
  views: number
  content?: string
  excerpt?: string
  updated_at?: string
}

const AFRICA_REGIONS = [
  'Eastern Africa',
  'Western Africa', 
  'Central Africa',
  'Northern Africa',
  'Southern Africa',
  'Continental'
]

export default function EmergingIndustriesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('category', 'Emerging Industries')
        .eq('status', 'published')
        .in('country', AFRICA_REGIONS) // Using country field to store region
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        setError('Failed to load articles. Please try again later.')
        setArticles([])
      } else {
        setArticles(data || [])
      }
    } catch (error) {
      console.error('Error loading articles:', error)
      setError('Failed to load articles. Please try again later.')
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  // Function to get proper image URL from Supabase
  const getImageUrl = (thumbnail: string): string => {
    if (!thumbnail) return '/placeholder-image.jpg' // fallback image
    
    // If the thumbnail is already a full URL (public URL), return as is
    if (thumbnail.startsWith('http')) {
      return thumbnail
    }
    
    // If it's a storage path, get the public URL
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(thumbnail)
    
    return data.publicUrl || '/placeholder-image.jpg'
  }

  // Function to handle image loading errors
  const handleImageError = (articleId: string) => {
    setImageErrors(prev => ({ ...prev, [articleId]: true }))
  }

  // Function to get fallback image
  const getFallbackImage = () => {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' text-anchor='middle' dominant-baseline='middle' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3EImage unavailable%3C/text%3E%3C/svg%3E"
  }

  const handleArticleClick = async (article: Article) => {
    try {
      // Update view count in Supabase
      const { error } = await supabase
        .from('articles')
        .update({ views: article.views + 1 })
        .eq('id', article.id)

      if (error) {
        console.error('Error updating views:', error)
      }

      // Update local state
      const updatedArticles = articles.map(a => 
        a.id === article.id ? { ...a, views: a.views + 1 } : a
      )
      setArticles(updatedArticles)
      setSelectedArticle({ ...article, views: article.views + 1 })
    } catch (error) {
      console.error('Error updating article views:', error)
      // Still show the article even if view count update fails
      setSelectedArticle(article)
    }
  }

  const handleBackToList = () => {
    setSelectedArticle(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'GMT'
    }) + ' GMT'
  }

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 text-[#0F4007] hover:text-[#1a6b0f] mb-8 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Emerging Industries News
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
              <div className="absolute bottom-6 left-6 text-white">
                <span className="px-3 py-1 bg-[#0F4007] rounded-full text-sm font-medium">
                  {selectedArticle.country}
                </span>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {selectedArticle.title}
              </h1>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-8 flex-wrap">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(selectedArticle.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(selectedArticle.created_at)}</span>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                {selectedArticle.content ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
                ) : (
                  <div className="text-gray-600 leading-relaxed">
                    <p className="mb-4">
                      This article provides comprehensive coverage of the latest developments in emerging industries 
                      across {selectedArticle.country}, bringing you insights into innovative sectors, disruptive 
                      technologies, and new business models shaping Africa&apos;s economic future.
                    </p>
                    <p className="mb-4">
                      Our team of business analysts and industry experts track the most promising emerging sectors, 
                      from renewable energy and biotechnology to creative industries and digital platforms, ensuring 
                      you stay ahead of transformative trends.
                    </p>
                    <p>
                      Stay tuned for more detailed coverage and analysis as this story develops.
                    </p>
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
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <TrendingUp className="w-12 h-12 text-[#0F4007] mr-4" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight
                bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] bg-clip-text text-transparent">
              Emerging Industries
            </h1>
          </div>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-6">
            Explore Africa&apos;s most promising emerging industries, from innovative startups and disruptive 
            technologies to new business models and economic opportunities shaping the continent&apos;s future.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] mx-auto rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F4007]"></div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Something went wrong
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                {error}
              </p>
              
              <button
                onClick={loadArticles}
                className="inline-flex items-center px-6 py-3 bg-[#0F4007] text-white rounded-lg hover:bg-[#0d3506] transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : articles.length === 0 ? (
          /* No Articles Found */
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#0F4007] to-[#1a6b0f] rounded-full flex items-center justify-center mx-auto mb-8">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Emerging Industries News Coming Soon
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                We&apos;re working on bringing you comprehensive coverage of Africa&apos;s most promising emerging 
                industries and innovative business sectors. Check back soon for insights on:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Tech Innovation
                  </h3>
                  <p className="text-gray-600 text-sm">
                    AI, blockchain, IoT, and other cutting-edge technologies transforming African markets
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Green Economy
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Renewable energy, clean tech, sustainable manufacturing, and environmental solutions
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    Creative Industries
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Gaming, entertainment, digital content, fashion, and cultural exports
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                    Healthcare Innovation
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Telemedicine, biotech, medical devices, and health-tech solutions
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                    E-commerce & Digital
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Online marketplaces, digital payments, logistics tech, and platform economy
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                    Social Impact
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Impact investing, social enterprises, and businesses addressing societal challenges
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-sm text-gray-500 mb-4">Coverage across African regions:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-500 max-w-2xl mx-auto">
                  {AFRICA_REGIONS.map((region, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="font-semibold text-gray-700">
                        {region}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Articles List */
          <div className="space-y-8">
            {/* Desktop Layout - 4 columns grid like Reuters */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-4">
              {articles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
                >
                  <div className="relative h-32 overflow-hidden">
                    <Image
                      src={imageErrors[article.id] ? getFallbackImage() : getImageUrl(article.thumbnail)}
                      alt={article.title}
                      fill
                      className="object-cover"
                      onError={() => handleImageError(article.id)}
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-[#0F4007] text-white rounded text-xs font-medium">
                        {article.country}
                      </span>
                    </div>
                  </div>

                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-3 leading-tight group-hover:text-[#0F4007] transition-colors duration-200">
                      {article.title}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatDateShort(article.created_at)}</span>
                      <span>{formatTime(article.created_at)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Tablet Layout - 3 columns */}
            <div className="hidden md:grid lg:hidden md:grid-cols-3 gap-4">
              {articles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
                >
                  <div className="relative h-36 overflow-hidden">
                    <Image
                      src={imageErrors[article.id] ? getFallbackImage() : getImageUrl(article.thumbnail)}
                      alt={article.title}
                      fill
                      className="object-cover"
                      onError={() => handleImageError(article.id)}
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-[#0F4007] text-white rounded text-xs font-medium">
                        {article.country}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#0F4007] transition-colors duration-200">
                      {article.title}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatDateShort(article.created_at)}</span>
                      <span>{formatTime(article.created_at)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Mobile Layout - List view like Reuters */}
            <div className="md:hidden space-y-3">
              {articles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
                >
                  <div className="flex gap-3 p-3">
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="px-2 py-1 bg-[#0F4007] text-white rounded text-xs font-medium">
                          {article.country}
                        </span>
                      </div>
                      
                      <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-3 leading-tight group-hover:text-[#0F4007] transition-colors duration-200">
                        {article.title}
                      </h3>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDateShort(article.created_at)}</span>
                        <span>{formatTime(article.created_at)}</span>
                      </div>
                    </div>

                    <div className="w-20 h-20 flex-shrink-0 relative">
                      <Image
                        src={imageErrors[article.id] ? getFallbackImage() : getImageUrl(article.thumbnail)}
                        alt={article.title}
                        fill
                        className="object-cover rounded"
                        onError={() => handleImageError(article.id)}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Signup - Only show when no articles */}
        {!loading && articles.length === 0 && (
          <div className="mt-16 bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Stay Ahead of the Curve
            </h3>
            <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
              Be the first to discover Africa&apos;s most promising emerging industries and innovative business 
              opportunities. Sign up for updates and never miss the next big trend.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-gray-800"
              />
              <button className="bg-white text-green-800 font-semibold px-6 py-3 rounded-full hover:bg-green-50 transition-colors duration-200">
                Get Notified
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}