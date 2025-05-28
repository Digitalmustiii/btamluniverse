"use client"

// app/admin/africa/page.tsx
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Globe,
  Calendar,
  User
} from 'lucide-react'
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
}

const REGIONS = {
  'Eastern Africa': ['Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'Burundi', 'Ethiopia', 'Somalia', 'South Sudan', 'Eritrea', 'Djibouti'],
  'Western Africa': ['Nigeria', 'Ghana', 'Senegal', 'Mali', 'Burkina Faso', 'Niger', 'Guinea', 'Sierra Leone', 'Liberia', 'Ivory Coast', 'Togo', 'Benin', 'Gambia', 'Guinea-Bissau', 'Cape Verde', 'Mauritania'],
  'Central Africa': ['DR Congo', 'Cameroon', 'Central African Republic', 'Chad', 'Gabon', 'Equatorial Guinea', 'Republic of Congo', 'São Tomé and Príncipe'],
  'Northern Africa': ['Egypt', 'Libya', 'Tunisia', 'Algeria', 'Morocco', 'Sudan'],
  'Southern Africa': ['South Africa', 'Zimbabwe', 'Botswana', 'Namibia', 'Zambia', 'Malawi', 'Mozambique', 'Angola', 'Lesotho', 'Eswatini', 'Madagascar', 'Mauritius', 'Seychelles', 'Comoros']
}

// Get all African regions for filtering
const AFRICAN_REGIONS = Object.keys(REGIONS)

export default function AdminAfricaPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')

  useEffect(() => {
    // Check authentication
    if (typeof window !== 'undefined') {
      const sessionData = sessionStorage.getItem('admin_session')
      if (!sessionData) {
        router.push('/admin/login')
        return
      }
    }

    // Load articles from database
    loadArticles()
  }, [router])

  const loadArticles = async () => {
    setLoading(true)
    try {
      // Only fetch articles where category is one of the African regions
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .in('category', AFRICAN_REGIONS) // Filter only African regions
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading articles:', error)
        setArticles([])
      } else {
        // Additional client-side filtering to ensure we only get Africa articles
        const africaArticles = (data || []).filter(article => 
          AFRICAN_REGIONS.includes(article.category)
        )
        setArticles(africaArticles)
      }
    } catch (error) {
      console.error('Error loading articles:', error)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteArticle = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        const { error } = await supabase
          .from('articles')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Error deleting article:', error)
          alert('Failed to delete article. Please try again.')
        } else {
          // Remove from local state
          setArticles(prev => prev.filter(article => article.id !== id))
          alert('Article deleted successfully!')
        }
      } catch (error) {
        console.error('Error deleting article:', error)
        alert('Failed to delete article. Please try again.')
      }
    }
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRegion = !selectedRegion || article.category === selectedRegion
    
    const matchesCountry = !selectedCountry || article.country === selectedCountry
    
    return matchesSearch && matchesRegion && matchesCountry
  })

  const getCountriesForRegion = (region: string): string[] => {
    return REGIONS[region as keyof typeof REGIONS] || []
  }

  if (loading) {
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
                href="/admin/dashboard"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Back to Dashboard
              </Link>
              <div className="w-px h-6 bg-gray-300" />
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#0F4007]" />
                <h1 className="text-2xl font-bold text-gray-900">Africa News</h1>
              </div>
            </div>
            <Link
              href="/admin/africa/create"
              className="flex items-center gap-2 px-4 py-2 bg-[#0F4007] text-white rounded-lg hover:bg-[#0d3506] transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              New Article
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Africa Articles</p>
                <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">
                  {articles.filter(a => a.status === 'published').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {articles.filter(a => a.status === 'draft').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Edit className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value)
                setSelectedCountry('')
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent"
            >
              <option value="">All Regions</option>
              {AFRICAN_REGIONS.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>

            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent"
              disabled={!selectedRegion}
            >
              <option value="">All Countries</option>
              {selectedRegion && getCountriesForRegion(selectedRegion).map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Articles List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Africa Articles ({filteredArticles.length})
            </h2>
          </div>
          
          {filteredArticles.length === 0 ? (
            <div className="p-12 text-center">
              <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Africa articles found</h3>
              <p className="text-gray-500 mb-6">
                {articles.length === 0 
                  ? "Get started by creating your first Africa news article."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              <Link
                href="/admin/africa/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F4007] text-white rounded-lg hover:bg-[#0d3506] transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                Create Article
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredArticles.map((article) => (
                <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={article.thumbnail || '/placeholder-image.jpg'}
                          alt={article.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            <span>{article.category}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{article.country}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(article.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{article.author}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        article.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {article.status}
                      </span>
                      
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/africa/edit/${article.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit article"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}