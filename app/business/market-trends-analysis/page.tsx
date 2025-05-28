// app/business/marekt-trends-analysis/page.tsx
"use client"

// app/business/market-entry-strategies/page.tsx
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Footer from '@/app/components/Footer'
import Header from '../../components/Header'
import { Calendar, ArrowLeft, Clock, TrendingUp, Globe, Target } from 'lucide-react'
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

export default function MarketEntryStrategiesPage() {
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
        .eq('category', 'Market Entry Strategies')
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
            className="flex items-center gap-2 text-from-[#0F4007] to-[#1a6b0f] hover:text-from-[#0F4007] mb-8 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Market Entry Strategies
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
                <span className="px-3 py-1 bg-from-[#0F4007] to-[#1a6b0f] rounded-full text-sm font-medium">
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
                      This article provides comprehensive insights into market entry strategies for businesses 
                      looking to expand into {selectedArticle.country}, covering regulatory frameworks, 
                      competitive landscapes, and strategic partnerships.
                    </p>
                    <p className="mb-4">
                      Our business analysts and market experts deliver actionable intelligence on navigating 
                      African markets, identifying opportunities, and mitigating risks for successful market entry.
                    </p>
                    <p>
                      Stay updated as we continue to monitor market developments and provide strategic guidance.
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
            <Target className="w-12 h-12 text-from-[#0F4007] to-[#1a6b0f] mr-4" />
            <TrendingUp className="w-10 h-10 text-from-[#0F4007] to-[#1a6b0f]" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight
              bg-gradient-to-r from-from-[#0F4007] to-[#1a6b0f] bg-clip-text text-transparent">
            Market Entry Strategies
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed mb-6">
            Navigate African markets with confidence. Get expert insights on market entry strategies, 
            regulatory frameworks, competitive analysis, and partnership opportunities across the continent. 
            Your gateway to successful business expansion in Africa.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-from-[#0F4007] to-[#1a6b0f] mx-auto rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-from-[#0F4007] to-[#1a6b0f]"></div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-10 h-10 text-from-[#0F4007] to-[#1a6b0f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="inline-flex items-center px-6 py-3 bg-from-[#0F4007] text-white rounded-lg hover:bg-from-[#0F4007] to-[#1a6b0f] transition-colors duration-200"
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
                <Globe className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Market Intelligence Coming Soon
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                We&apos;re preparing comprehensive market entry strategies and business intelligence for African markets. 
                Our expert analysis will cover:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 shadow-sm border border-blue-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-from-[#0F4007] to-[#1a6b0f]rounded-full mr-3"></span>
                    Regulatory Frameworks
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Navigate complex regulatory environments, compliance requirements, and legal considerations
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 shadow-sm border border-green-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Market Analysis
                  </h3>
                  <p className="text-gray-600 text-sm">
                    In-depth competitive landscape analysis, market sizing, and consumer behavior insights
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-6 shadow-sm border border-purple-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-from-[#0F4007] to-[#1a6b0f] rounded-full mr-3"></span>
                    Strategic Partnerships
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Connect with local partners, distributors, and key stakeholders for market success
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6 shadow-sm border border-orange-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-from-[#0F4007] to-[#1a6b0f] rounded-full mr-3"></span>
                    Risk Assessment
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Comprehensive risk analysis including political, economic, and operational factors
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Regional Coverage</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 max-w-3xl mx-auto">
                  {AFRICA_REGIONS.map((region, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                      <div className="font-semibold text-gray-700 flex items-center">
                        <div className="w-2 h-2 bg-from-[#0F4007] to-[#1a6b0f] rounded-full mr-2"></div>
                        {region}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 p-6 bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] rounded-xl text-white">
                <h3 className="text-lg font-semibold mb-2">Expert Market Intelligence</h3>
                <p className="text-blue-100 text-sm">
                  Our team of market analysts, business consultants, and regional experts will provide 
                  actionable insights to help you enter African markets successfully.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Articles List */
          <div className="space-y-8">
            {/* Desktop Layout - 4 columns grid */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-4">
              {articles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:bg-gray-50 transition-all duration-200 cursor-pointer group hover:shadow-md"
                >
                  <div className="relative h-32 overflow-hidden">
                    <Image
                      src={imageErrors[article.id] ? getFallbackImage() : getImageUrl(article.thumbnail)}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={() => handleImageError(article.id)}
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-from-[#0F4007] to-[#1a6b0f] text-white rounded text-xs font-medium">
                        {article.country}
                      </span>
                    </div>
                  </div>

                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-3 leading-tight group-hover:text-from-[#0F4007] to-[#1a6b0f]transition-colors duration-200">
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
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:bg-gray-50 transition-all duration-200 cursor-pointer group hover:shadow-md"
                >
                  <div className="relative h-36 overflow-hidden">
                    <Image
                      src={imageErrors[article.id] ? getFallbackImage() : getImageUrl(article.thumbnail)}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={() => handleImageError(article.id)}
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-from-[#0F4007] to-[#1a6b0f] text-white rounded text-xs font-medium">
                        {article.country}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-from-[#0F4007] to-[#1a6b0f]transition-colors duration-200">
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

            {/* Mobile Layout - List view */}
            <div className="md:hidden space-y-3">
              {articles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:bg-gray-50 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex gap-3 p-3">
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="px-2 py-1 bg-from-[#0F4007] to-[#1a6b0f] text-white rounded text-xs font-medium">
                          {article.country}
                        </span>
                      </div>
                      
                      <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-3 leading-tight group-hover:text-blue-600 transition-colors duration-200">
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
          <div className="mt-16 bg-gradient-to-r from-from-[#0F4007] to-[#1a6b0f] rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Stay Ahead of the Market
            </h3>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Get exclusive market intelligence, entry strategies, and business insights delivered 
              directly to your inbox. Be the first to access our comprehensive market analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-gray-800"
              />
              <button className="bg-white text-from-[#0F4007] to-[#1a6b0f] font-semibold px-6 py-3 rounded-full hover:bg-blue-50 transition-colors duration-200 shadow-lg">
                Get Updates
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}