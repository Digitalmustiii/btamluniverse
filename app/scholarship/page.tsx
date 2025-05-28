"use client"

// app/scholarships/page.tsx
import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Footer from '@/app/components/Footer'
import Header from '../components/Header'
import { Calendar, ArrowLeft, DollarSign, Globe, MapPin, GraduationCap, Users } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

interface Scholarship {
  id: string
  title: string
  thumbnail: string
  category: string
  country: string
  continent: string
  author: string
  created_at: string
  status: 'published' | 'draft'
  views: number
  content?: string
  excerpt?: string
  updated_at?: string
  scholarship_types?: string
  funding_types?: string
  amount?: string
  deadline?: string
  application_url?: string
}

const CONTINENTS = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania']

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [filteredScholarships, setFilteredScholarships] = useState<Scholarship[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [selectedContinent, setSelectedContinent] = useState<string>('All')

  const filterScholarships = useCallback(() => {
    if (selectedContinent === 'All') {
      setFilteredScholarships(scholarships)
    } else {
      setFilteredScholarships(scholarships.filter(s => s.continent === selectedContinent))
    }
  }, [scholarships, selectedContinent])

  useEffect(() => {
    loadScholarships()
  }, [])

  useEffect(() => {
    filterScholarships()
  }, [filterScholarships])

  const loadScholarships = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('category', 'Scholarship')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        setError('Failed to load scholarships. Please try again later.')
        setScholarships([])
      } else {
        setScholarships(data || [])
      }
    } catch (error) {
      console.error('Error loading scholarships:', error)
      setError('Failed to load scholarships. Please try again later.')
      setScholarships([])
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

  const handleImageError = (scholarshipId: string) => {
    setImageErrors(prev => ({ ...prev, [scholarshipId]: true }))
  }

  const getFallbackImage = () => {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' text-anchor='middle' dominant-baseline='middle' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3EImage unavailable%3C/text%3E%3C/svg%3E"
  }

  const handleScholarshipClick = async (scholarship: Scholarship) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ views: scholarship.views + 1 })
        .eq('id', scholarship.id)

      if (error) console.error('Error updating views:', error)

      const updatedScholarships = scholarships.map(s => 
        s.id === scholarship.id ? { ...s, views: s.views + 1 } : s
      )
      setScholarships(updatedScholarships)
      setSelectedScholarship({ ...scholarship, views: scholarship.views + 1 })
    } catch (error) {
      console.error('Error updating scholarship views:', error)
      setSelectedScholarship(scholarship)
    }
  }

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  const formatDeadline = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    })
  }

  const parseMultipleValues = (value: string): string[] => {
    return value ? value.split(', ').filter(v => v.trim()) : []
  }

  if (selectedScholarship) {
    const scholarshipTypes = parseMultipleValues(selectedScholarship.scholarship_types || '')
    const fundingTypes = parseMultipleValues(selectedScholarship.funding_types || '')

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => setSelectedScholarship(null)}
            className="flex items-center gap-2 text-[#0F4007] hover:text-[#1a6b0f] mb-8 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Scholarships
          </button>

          <article className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="relative h-64 md:h-96">
              <Image
                src={imageErrors[selectedScholarship.id] ? getFallbackImage() : getImageUrl(selectedScholarship.thumbnail)}
                alt={selectedScholarship.title}
                fill
                className="object-cover"
                onError={() => handleImageError(selectedScholarship.id)}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 flex gap-3">
                <span className="px-3 py-1 bg-[#0F4007] text-white rounded-full text-sm font-medium">
                  {selectedScholarship.country}
                </span>
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                  {selectedScholarship.continent}
                </span>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {selectedScholarship.title}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  {scholarshipTypes.length > 0 && (
                    <div className="flex items-start gap-3">
                      <GraduationCap className="w-5 h-5 text-[#0F4007] mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-gray-900 mb-2">Scholarship Types</div>
                        <div className="flex flex-wrap gap-2">
                          {scholarshipTypes.map((type, index) => (
                            <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {fundingTypes.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-[#0F4007] mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-gray-900 mb-2">Funding Types</div>
                        <div className="flex flex-wrap gap-2">
                          {fundingTypes.map((type, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {selectedScholarship.amount && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-[#0F4007]" />
                      <div>
                        <div className="font-semibold text-gray-900">Amount</div>
                        <div className="text-gray-600">{selectedScholarship.amount}</div>
                      </div>
                    </div>
                  )}

                  {selectedScholarship.deadline && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-[#0F4007]" />
                      <div>
                        <div className="font-semibold text-gray-900">Deadline</div>
                        <div className="text-red-600 font-medium">{formatDeadline(selectedScholarship.deadline)}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#0F4007]" />
                    <div>
                      <div className="font-semibold text-gray-900">Location</div>
                      <div className="text-gray-600">{selectedScholarship.country}, {selectedScholarship.continent}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg max-w-none mb-8">
                {selectedScholarship.content ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedScholarship.content }} />
                ) : (
                  <div className="text-gray-600 leading-relaxed">
                    <p className="mb-4">
                      This scholarship provides an excellent opportunity for students to pursue their academic goals 
                      in {selectedScholarship.country}. 
                    </p>
                    <p>
                      For more detailed information and application requirements, please visit the official application portal.
                    </p>
                  </div>
                )}
              </div>

              {selectedScholarship.application_url && (
                <div className="bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] rounded-xl p-6 text-center">
                  <h3 className="text-white text-xl font-bold mb-4">Ready to Apply?</h3>
                  <a
                    href={selectedScholarship.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-[#0F4007] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                    Apply Now
                  </a>
                </div>
              )}
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
            Scholarship Opportunities
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Discover fully funded scholarships and educational opportunities from around the world
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setSelectedContinent('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedContinent === 'All'
                  ? 'bg-[#0F4007] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              All Continents
            </button>
            {CONTINENTS.map(continent => (
              <button
                key={continent}
                onClick={() => setSelectedContinent(continent)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedContinent === continent
                    ? 'bg-[#0F4007] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {continent}
              </button>
            ))}
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
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Something went wrong</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">{error}</p>
              <button
                onClick={loadScholarships}
                className="inline-flex items-center px-6 py-3 bg-[#0F4007] text-white rounded-lg hover:bg-[#0d3506] transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : filteredScholarships.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#0F4007] to-[#1a6b0f] rounded-full flex items-center justify-center mx-auto mb-8">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                {selectedContinent === 'All' ? 'No Scholarships Available' : `No Scholarships in ${selectedContinent}`}
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                {selectedContinent === 'All' 
                  ? "We're working on bringing you scholarship opportunities from around the world"
                  : `No scholarship opportunities available in ${selectedContinent} at the moment`
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScholarships.map((scholarship) => {
                const scholarshipTypes = parseMultipleValues(scholarship.scholarship_types || '')
                
                return (
                  <article
                    key={scholarship.id}
                    onClick={() => handleScholarshipClick(scholarship)}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={imageErrors[scholarship.id] ? getFallbackImage() : getImageUrl(scholarship.thumbnail)}
                        alt={scholarship.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() => handleImageError(scholarship.id)}
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2 py-1 bg-[#0F4007] text-white rounded-full text-xs font-medium">
                          {scholarship.country}
                        </span>
                        <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-medium">
                          {scholarship.continent}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#0F4007] transition-colors">
                        {scholarship.title}
                      </h3>

                      <div className="space-y-3 mb-4">
                        {scholarshipTypes.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {scholarshipTypes.slice(0, 2).map((type, index) => (
                              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                {type}
                              </span>
                            ))}
                            {scholarshipTypes.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                +{scholarshipTypes.length - 2} more
                              </span>
                            )}
                          </div>
                        )}

                        {scholarship.deadline && (
                          <div className="flex items-center gap-2 text-red-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">Deadline: {formatDeadline(scholarship.deadline)}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-gray-500">
                        Published {formatDateShort(scholarship.created_at)}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}