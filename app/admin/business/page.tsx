"use client"

// app/admin/business/page.tsx
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  Plus,
  Edit,
  Trash2,
  Search,
  Briefcase,
  Calendar,
  User,
  ArrowLeft
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

interface Article {
  id: string
  title: string
  thumbnail: string
  category: string
  country: string // This stores the region for business articles
  author: string
  created_at: string
  status: 'published' | 'draft'
}

interface User {
  username: string
  email: string
  role: string
}

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

export default function AdminBusinessPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [user, setUser] = useState<User | null>(null)

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

    // Load articles
    loadArticles()
  }, [router])

  const loadArticles = async () => {
    setLoading(true)
    try {
      // Filter articles to only include business categories
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .in('category', BUSINESS_CATEGORIES)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading business articles:', error)
        throw error
      }

      console.log('Loaded business articles:', data)
      setArticles(data || [])
    } catch (error) {
      console.error('Error loading business articles:', error)
      alert('Error loading business articles. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this business article?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting article:', error)
        throw error
      }

      // Remove from local state
      setArticles(prev => prev.filter(article => article.id !== id))
      alert('Business article deleted successfully!')
    } catch (error) {
      console.error('Error deleting article:', error)
      alert('Error deleting business article. Please try again.')
    }
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.country.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || article.category === selectedCategory
    const matchesRegion = !selectedRegion || article.country === selectedRegion
    
    return matchesSearch && matchesCategory && matchesRegion
  })

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0F4007]"></div>
      </div>
    )
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
                className="flex items-center gap-2 text-gray-600 hover:text-[#0F4007] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#0F4007]" />
                <h1 className="text-2xl font-bold text-gray-900">Business News</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Welcome, {user.username}</span>
                <div className="w-8 h-8 bg-[#0F4007] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <Link
                href="/admin/business/create"
                className="flex items-center gap-2 px-4 py-2 bg-[#0F4007] text-white rounded-lg hover:bg-[#0d3506] transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                New Article
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Business Articles</p>
                <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
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
                <Briefcase className="w-6 h-6 text-green-600" />
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
                placeholder="Search business articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent"
            >
              <option value="">All Business Categories</option>
              {BUSINESS_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent"
            >
              <option value="">All Regions</option>
              {AFRICA_REGIONS.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Articles List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Business Articles ({filteredArticles.length})
            </h2>
          </div>
          
          {filteredArticles.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No business articles found</h3>
              <p className="text-gray-500 mb-6">
                {articles.length === 0 
                  ? "Get started by creating your first business article."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              <Link
                href="/admin/business/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F4007] text-white rounded-lg hover:bg-[#0d3506] transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                Create Business Article
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredArticles.map((article) => (
                <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                        <Image
                          src={article.thumbnail}
                          alt={article.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
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
                          href={`/admin/business/edit/${article.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit business article"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete business article"
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