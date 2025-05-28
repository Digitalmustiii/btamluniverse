"use client"

// app/admin/security/page.tsx
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  Plus, Edit, Trash2, Eye, Search, Shield, Calendar, User, 
  AlertTriangle, Lock, Globe
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

interface SecurityArticle {
  id: string
  title: string
  thumbnail: string
  category: 'Security Advisories' | 'Threat Intelligence' | 'Risk Mitigation' | 'Best Practices'
  country: string
  author: string
  created_at: string
  status: 'published' | 'draft'
  views: number
  threat_level?: 'low' | 'medium' | 'high' | 'critical'
}

interface User {
  username: string
  email: string
  role: string
}

const SECURITY_CATEGORIES = [
  'Security Advisories', 'Threat Intelligence', 'Risk Mitigation', 'Best Practices'
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

export default function AdminSecurityPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<SecurityArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      if (typeof window === 'undefined') return

      const sessionData = sessionStorage.getItem('admin_session')
      if (!sessionData) {
        router.push('/admin/login')
        return
      }

      try {
        const session = JSON.parse(sessionData) as User
        setUser(session)
        await loadSecurityArticles()
      } catch (error) {
        console.error('Auth error:', error)
        router.push('/admin/login')
      }
    }

    checkAuthAndLoadData()
  }, [router])

  const loadSecurityArticles = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .in('category', SECURITY_CATEGORIES)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      setArticles(data || [])
    } catch (error) {
      console.error('Error loading security articles:', error)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this security article?')) return

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setArticles(prev => prev.filter(article => article.id !== id))
      alert('Security article deleted successfully!')
    } catch (error) {
      console.error('Error deleting article:', error)
      alert('Error deleting article. Please try again.')
    }
  }

  const getThreatLevelColor = (level?: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.country.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || article.category === selectedCategory
    const matchesCountry = !selectedCountry || article.country === selectedCountry
    
    return matchesSearch && matchesCategory && matchesCountry
  })

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
                <Shield className="w-5 h-5 text-[#0F4007]" />
                <h1 className="text-2xl font-bold text-gray-900">Security Intelligence</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Welcome, {user.username}</span>
                  <div className="w-8 h-8 bg-[#0F4007] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              <Link
                href="/admin/security/create"
                className="flex items-center gap-2 px-4 py-2 bg-[#0F4007] text-white rounded-lg hover:bg-[#0d3506] transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                New Security Update
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#0F4007] to-[#1a5c0e] rounded-lg p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Comprehensive Security Intelligence</h2>
          </div>
          <p className="text-lg mb-6 opacity-90">
            Access timely information on regional security developments, cybersecurity threats, and risk mitigation strategies tailored for businesses operating in African markets.
          </p>
          <div className="flex items-center gap-2 text-lg font-medium">
            <Shield className="w-6 h-6" />
            <span>Stay Protected & Informed</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Updates</p>
                <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {SECURITY_CATEGORIES.map((category, index) => {
            const colors = [
              { bg: 'bg-red-100', text: 'text-red-600', icon: AlertTriangle },
              { bg: 'bg-orange-100', text: 'text-orange-600', icon: Eye },
              { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: Shield },
              { bg: 'bg-green-100', text: 'text-green-600', icon: Lock }
            ]
            const color = colors[index]
            const IconComponent = color.icon
            const count = articles.filter(a => a.category === category).length

            return (
              <div key={category} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{category}</p>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                  </div>
                  <div className={`w-12 h-12 ${color.bg} rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 ${color.text}`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search security updates..."
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
              <option value="">All Categories</option>
              {SECURITY_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent"
            >
              <option value="">All Countries</option>
              {AFRICAN_COUNTRIES.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Articles List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Security Updates ({filteredArticles.length})
            </h2>
          </div>
          
          {filteredArticles.length === 0 ? (
            <div className="p-12 text-center">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No security updates found</h3>
              <p className="text-gray-500 mb-6">
                {articles.length === 0 
                  ? "Get started by creating your first security intelligence update."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              <Link
                href="/admin/security/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F4007] text-white rounded-lg hover:bg-[#0d3506] transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                Create Security Update
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredArticles.map((article) => (
                <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
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
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <div className="flex items-center gap-1">
                            <Shield className="w-4 h-4" />
                            <span>{article.category}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
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
                      {article.threat_level && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getThreatLevelColor(article.threat_level)}`}>
                          {article.threat_level.toUpperCase()}
                        </span>
                      )}
                      
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        article.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {article.status}
                      </span>
                      
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/security/edit/${article.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit security update"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete security update"
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