"use client"

// app/admin/articles/page.tsx
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
  Briefcase,
  GraduationCap,
  Shield,
  Calendar,
  User,
  Filter
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

const CATEGORY_GROUPS = {
  'Africa News': ['Eastern Africa', 'Western Africa', 'Central Africa', 'Northern Africa', 'Southern Africa'],
  'Business': ['Agriculture & Agribusiness', 'Mining & Energy', 'Technology & Fintech', 'Infrastructure & Logistics', 'Sustainable Business Practices', 'Market Entry Strategies', 'Risk Management', 'Market Trends & Analysis', 'Emerging Industries', 'Case Studies'],
  'Scholarship': ['Undergraduate', 'Masters', 'PhD', 'Language Program', 'Research Fellowship', 'Exchange Program', 'Professional Development', 'Certificate Program', 'Summer Program', 'General Scholarship', 'Scholarship'],
  'Security': ['Security Advisories', 'Threat Intelligence', 'Risk Mitigation', 'Best Practices']
}

const getCategoryIcon = (category: string) => {
  if (CATEGORY_GROUPS['Africa News'].includes(category)) return Globe
  if (CATEGORY_GROUPS['Business'].includes(category)) return Briefcase
  if (CATEGORY_GROUPS['Scholarship'].includes(category)) return GraduationCap
  if (CATEGORY_GROUPS['Security'].includes(category)) return Shield
  return Globe
}

const getCategoryGroup = (category: string): string => {
  for (const [group, categories] of Object.entries(CATEGORY_GROUPS)) {
    if (categories.includes(category)) return group
  }
  return 'Other'
}

const getCategoryColor = (category: string) => {
  const group = getCategoryGroup(category)
  switch (group) {
    case 'Africa News': return 'bg-blue-100 text-blue-800'
    case 'Business': return 'bg-green-100 text-green-800'
    case 'Scholarship': return 'bg-purple-100 text-purple-800'
    case 'Security': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function AdminArticlesPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    // Check authentication
    if (typeof window !== 'undefined') {
      const sessionData = sessionStorage.getItem('admin_session')
      if (!sessionData) {
        router.push('/admin/login')
        return
      }
    }

    loadArticles()
  }, [router])

  const loadArticles = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading articles:', error)
        setArticles([])
      } else {
        setArticles(data || [])
      }
    } catch (error) {
      console.error('Error loading articles:', error)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteArticle = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        const { error } = await supabase
          .from('articles')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Error deleting article:', error)
          alert('Failed to delete article. Please try again.')
        } else {
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
    
    const articleGroup = getCategoryGroup(article.category)
    const matchesGroup = !selectedGroup || articleGroup === selectedGroup
    
    const matchesStatus = !selectedStatus || article.status === selectedStatus
    
    return matchesSearch && matchesGroup && matchesStatus
  })

  // Calculate stats using the same logic as dashboard
  const totalArticles = articles.length
  const publishedArticles = articles.filter(a => a.status === 'published').length
  const draftArticles = articles.filter(a => a.status === 'draft').length

  // Count articles by category group using corrected logic
  const articlesByGroup = Object.keys(CATEGORY_GROUPS).reduce((acc, group) => {
    if (group === 'Scholarship') {
      // Special handling for scholarship - check for exact 'Scholarship' category or scholarship subcategories
      acc[group] = articles.filter(article => 
        article.category === 'Scholarship' || CATEGORY_GROUPS['Scholarship'].includes(article.category)
      ).length
    } else {
      acc[group] = articles.filter(article => getCategoryGroup(article.category) === group).length
    }
    return acc
  }, {} as Record<string, number>)

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
                <Eye className="w-5 h-5 text-[#0F4007]" />
                <h1 className="text-2xl font-bold text-gray-900">All Articles</h1>
              </div>
            </div>
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-[#0F4007] text-white rounded-lg hover:bg-[#0A3005] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Article
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{totalArticles}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600">{publishedArticles}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-yellow-600">{draftArticles}</p>
              </div>
              <Edit className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-purple-600">{Object.keys(CATEGORY_GROUPS).length}</p>
              </div>
              <Filter className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Category Overview */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Articles by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(articlesByGroup).map(([group, count]) => {
              const Icon = group === 'Africa News' ? Globe : 
                          group === 'Business' ? Briefcase :
                          group === 'Scholarship' ? GraduationCap : Shield
              return (
                <div key={group} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Icon className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{group}</p>
                    <p className="text-sm text-gray-500">{count} articles</p>
                  </div>
                </div>
              )
            })}
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
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent"
            >
              <option value="">All Categories</option>
              {Object.keys(CATEGORY_GROUPS).map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Articles List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Articles ({filteredArticles.length})
            </h2>
          </div>
          
          {filteredArticles.length === 0 ? (
            <div className="p-12 text-center">
              <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-500 mb-6">
                {articles.length === 0 
                  ? "Get started by creating your first article."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F4007] text-white rounded-lg hover:bg-[#0A3005] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Article
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredArticles.map((article) => {
                const Icon = getCategoryIcon(article.category)
                const categoryGroup = getCategoryGroup(article.category)
                return (
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
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <div className="flex items-center gap-1">
                              <Icon className="w-4 h-4" />
                              <span>{categoryGroup}</span>
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
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(article.category)}`}>
                            {article.category}
                          </span>
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
                        <button
                          onClick={() => router.push(`/admin/articles/${article.id}/edit`)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit article"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article.id, article.title)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}