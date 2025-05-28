"use client"

//app/admin/dashboard/page.tsx
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Globe, 
  Briefcase, 
  GraduationCap, 
  Shield, 
  Plus,
  FileText,
  Activity,
  LogOut
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

interface User {
  id: string
  username: string
  email: string
  created_at: string
  loginTime: number
}

interface Category {
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  lightColor: string
  textColor: string
  href: string
  key: string
}

interface Stats {
  total: number
  published: number
  categoryStats: {
    [key: string]: number
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<Stats>({
    total: 0,
    published: 0,
    categoryStats: {}
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionData = sessionStorage.getItem('admin_session')
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData)
          setUser(session)
          fetchStats()
        } catch {
          window.location.href = '/admin/login'
        }
      } else {
        window.location.href = '/admin/login'
      }
    }
  }, [])

// Fixed fetchStats function for the dashboard
const fetchStats = async () => {
  try {
    setLoading(true)
    
    // Get total articles count
    const { count: totalCount } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })

    // Get published articles count
    const { count: publishedCount } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')

    // Get category data for stats
    const { data: categoryData } = await supabase
      .from('articles')
      .select('category')

    // Count articles by category
    const categoryStats: { [key: string]: number } = {}
    
    // Initialize category counters
    const AFRICAN_REGIONS = ['Eastern Africa', 'Western Africa', 'Central Africa', 'Northern Africa', 'Southern Africa']
    const BUSINESS_CATEGORIES = ['Agriculture & Agribusiness', 'Mining & Energy', 'Technology & Fintech', 'Infrastructure & Logistics', 'Sustainable Business Practices', 'Market Entry Strategies', 'Risk Management', 'Market Trends & Analysis', 'Emerging Industries', 'Case Studies']
    const SECURITY_CATEGORIES = ['Security Advisories', 'Threat Intelligence', 'Risk Mitigation', 'Best Practices']

    // Count articles by main categories
    let africaCount = 0
    let businessCount = 0
    let scholarshipCount = 0
    let securityCount = 0

    categoryData?.forEach(article => {
      const category = article.category
      if (AFRICAN_REGIONS.includes(category)) {
        africaCount++
      } else if (BUSINESS_CATEGORIES.includes(category)) {
        businessCount++
      } else if (category === 'Scholarship') {  // Fixed: Check for exact 'Scholarship' category
        scholarshipCount++
      } else if (SECURITY_CATEGORIES.includes(category)) {
        securityCount++
      }
    })

    categoryStats.africa = africaCount
    categoryStats.business = businessCount
    categoryStats.scholarship = scholarshipCount
    categoryStats.security = securityCount

    setStats({
      total: totalCount || 0,
      published: publishedCount || 0,
      categoryStats
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
  } finally {
    setLoading(false)
  }
}

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_session')
      router.push('/admin/login')
    }
  }

  const categories: Category[] = [
    {
      name: 'Africa News',
      icon: Globe,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      href: '/admin/africa',
      key: 'africa'
    },
    {
      name: 'Business',
      icon: Briefcase,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600',
      href: '/admin/business',
      key: 'business'
    },
    {
      name: 'Scholarship',
      icon: GraduationCap,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      href: '/admin/scholarship',
      key: 'scholarship'
    },
    {
      name: 'Security',
      icon: Shield,
      color: 'bg-red-500',
      lightColor: 'bg-red-50',
      textColor: 'text-red-600',
      href: '/admin/security',
      key: 'security'
    }
  ]

  if (!user) {
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.username}!</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Last login</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(user.loginTime).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#0F4007] rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Admin Dashboard</h2>
            <p className="text-gray-600 mb-6">Get started by creating your first article or managing content categories.</p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Total Articles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <span className="inline-block w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></span>
                  ) : (
                    stats.total
                  )}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Published</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <span className="inline-block w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></span>
                  ) : (
                    stats.published
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Categories */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Content Categories</h2>
                <p className="text-sm text-gray-500">Manage articles by category</p>
              </div>
              <div className="p-6 space-y-4">
                {categories.map((category) => {
                  const Icon = category.icon
                  const categoryCount = stats.categoryStats[category.key] || 0
                  return (
                    <div
                      key={category.name}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer border border-transparent hover:border-gray-200"
                      onClick={() => router.push(category.href)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${category.lightColor} rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${category.textColor}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{category.name}</p>
                          <p className="text-sm text-gray-500">
                            {loading ? (
                              "Loading..."
                            ) : (
                              `${categoryCount} article${categoryCount !== 1 ? 's' : ''}`
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`${category.href}/create`)
                          }}
                          className="p-2 text-gray-400 hover:text-[#0F4007] hover:bg-green-50 rounded-lg transition-colors duration-200"
                          title="Create new article"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Getting Started */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Getting Started</h2>
                <p className="text-sm text-gray-500">Quick actions to help you get started</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-900 mb-2">Create Your First Article</h3>
                  <p className="text-sm text-blue-700 mb-3">Start by creating content in one of your categories.</p>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.slice(0, 4).map((category) => {
                      const Icon = category.icon
                      return (
                        <Link
                          key={category.name}
                          href={`${category.href}/create`}
                          className="flex items-center gap-2 p-2 text-sm bg-white rounded border hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                        >
                          <Icon className={`w-4 h-4 ${category.textColor}`} />
                          <span className="text-gray-700">{category.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-medium text-green-900 mb-2">View All Articles</h3>
                  <p className="text-sm text-green-700 mb-3">Manage all your content in one place.</p>
                  <Link
                    href="/admin/articles"
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-white text-green-700 rounded border border-green-300 hover:bg-green-50 transition-colors duration-200"
                  >
                    <FileText className="w-4 h-4" />
                    View Articles
                  </Link>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">Need Help?</h3>
                  <p className="text-sm text-gray-600">Check out the documentation or contact support.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}