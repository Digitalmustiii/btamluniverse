"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Footer from '@/app/components/Footer'
import Header from '../../components/Header'
import { Calendar, ArrowLeft, Clock } from 'lucide-react'
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

export default function CaseStudiesPage() {
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
        .eq('category', 'Case Studies')
        .eq('status', 'published')
        .in('country', AFRICA_REGIONS)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        setError('Failed to load case studies. Please try again later.')
        setArticles([])
      } else {
        setArticles(data || [])
      }
    } catch (error) {
      console.error('Error loading articles:', error)
      setError('Failed to load case studies. Please try again later.')
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (thumbnail: string): string => {
    if (!thumbnail) return '/placeholder-image.jpg'
    
    if (thumbnail.startsWith('http')) {
      return thumbnail
    }
    
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(thumbnail)
    
    return data.publicUrl || '/placeholder-image.jpg'
  }

  const handleImageError = (articleId: string) => {
    setImageErrors(prev => ({ ...prev, [articleId]: true }))
  }

  const getFallbackImage = () => {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' text-anchor='middle' dominant-baseline='middle' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3EImage unavailable%3C/text%3E%3C/svg%3E"
  }

  const handleArticleClick = async (article: Article) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ views: article.views + 1 })
        .eq('id', article.id)

      if (error) {
        console.error('Error updating views:', error)
      }

      const updatedArticles = articles.map(a => 
        a.id === article.id ? { ...a, views: a.views + 1 } : a
      )
      setArticles(updatedArticles)
      setSelectedArticle({ ...article, views: article.views + 1 })
    } catch (error) {
      console.error('Error updating article views:', error)
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
            Back to Business Case Studies
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
                      This case study provides comprehensive analysis of business success stories and 
                      strategic insights from {selectedArticle.country}, examining key factors that 
                      contributed to growth and market leadership.
                    </p>
                    <p className="mb-4">
                      Our research team conducts in-depth interviews with business leaders, analyzes 
                      market data, and identifies replicable strategies that can inspire other 
                      entrepreneurs across Africa.
                    </p>
                    <p>
                      Stay tuned for the complete case study analysis and actionable insights.
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
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight
              bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] bg-clip-text text-transparent">
            Business Case Studies
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-6">
            In-depth analysis of successful business ventures, lessons learned, and strategic insights 
            from across Africa&apos;s most innovative companies and entrepreneurs.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] mx-auto rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F4007]"></div>
          </div>
        ) : error ? (
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
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#0F4007] to-[#1a6b0f] rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Case Studies Coming Soon
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                We&apos;re building comprehensive coverage of Africa&apos;s most successful business stories. 
                Check back soon for insights on:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Success Stories
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Detailed analysis of breakthrough companies and their growth strategies
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Market Entry Strategies
                  </h3>
                  <p className="text-gray-600 text-sm">
                    How international companies successfully entered African markets
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Innovation Leadership
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Technology adoption and digital transformation success stories
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Sustainable Practices
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Environmental and social impact initiatives that drove business growth
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
          <div className="space-y-8">
            {/* Desktop Layout */}
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

            {/* Tablet Layout */}
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

            {/* Mobile Layout */}
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

        {!loading && articles.length === 0 && (
          <div className="mt-16 bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Stay Informed
            </h3>
            <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
              Be the first to know when we launch our business case studies section. 
              Sign up for updates and never miss inspiring success stories from African businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-gray-800"
              />
              <button className="bg-white text-green-800 font-semibold px-6 py-3 rounded-full hover:bg-green-50 transition-colors duration-200">
                Notify Me
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}