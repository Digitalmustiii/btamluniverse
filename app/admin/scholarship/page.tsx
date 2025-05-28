"use client"

// app/admin/scholarship/page.tsx
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  Plus,
  Edit,
  Trash2,
  Search,
  GraduationCap,
  Calendar,
  User,
  Globe,
  DollarSign,
  ArrowLeft
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

interface Scholarship {
  id: string
  title: string
  thumbnail: string
  continent: string
  country: string
  scholarship_types: string
  funding_types: string
  deadline: string
  author: string
  created_at: string
  status: 'published' | 'draft'
  amount?: string
  application_url?: string
}

interface User {
  username: string
  email: string
  role: string
}

const CONTINENTS = [
  'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'
]

const SCHOLARSHIP_TYPES = [
  'Undergraduate', 'Masters', 'PhD', 'Language Program', 'Research Fellowship',
  'Exchange Program', 'Professional Development', 'Certificate Program',
  'Summer Program', 'General Scholarship'
]

const FUNDING_TYPES = [
  'Fully Funded', 'Partial Funding', 'Tuition Only', 'Living Expenses Only',
  'Travel Grant', 'Research Grant', 'Merit-Based', 'Need-Based'
]

export default function AdminScholarshipPage() {
  const router = useRouter()
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedContinent, setSelectedContinent] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedFunding, setSelectedFunding] = useState('')
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check authentication
    if (typeof window !== 'undefined') {
      const sessionData = sessionStorage.getItem('admin_session')
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData) as User
          setUser(session)
          loadScholarships()
        } catch {
          router.push('/admin/login')
        }
      } else {
        router.push('/admin/login')
      }
    }
  }, [router])

  const loadScholarships = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('category', 'Scholarship')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading scholarships:', error)
        setScholarships([])
      } else {
        setScholarships(data || [])
      }
    } catch (error) {
      console.error('Error loading scholarships:', error)
      setScholarships([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteScholarship = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        const { error } = await supabase
          .from('articles')
          .delete()
          .eq('id', id)

        if (error) {
          alert('Error deleting scholarship: ' + error.message)
        } else {
          setScholarships(prev => prev.filter(scholarship => scholarship.id !== id))
          alert('Scholarship deleted successfully!')
        }
      } catch (error) {
        console.error('Error deleting scholarship:', error)
        alert('Error deleting scholarship. Please try again.')
      }
    }
  }

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.continent.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesContinent = !selectedContinent || scholarship.continent === selectedContinent
    const matchesType = !selectedType || scholarship.scholarship_types.includes(selectedType)
    const matchesFunding = !selectedFunding || scholarship.funding_types.includes(selectedFunding)
    
    return matchesSearch && matchesContinent && matchesType && matchesFunding
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0F4007]"></div>
      </div>
    )
  }

  if (!user) {
    return null
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
                <GraduationCap className="w-5 h-5 text-[#0F4007]" />
                <h1 className="text-2xl font-bold text-gray-900">Scholarships</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/scholarship/create"
                className="flex items-center gap-2 px-4 py-2 bg-[#0F4007] text-white rounded-lg hover:bg-[#0d3506] transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                New Scholarship
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Welcome, {user.username}</span>
                <div className="w-8 h-8 bg-[#0F4007] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
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
                <p className="text-sm text-gray-600">Total Scholarships</p>
                <p className="text-2xl font-bold text-gray-900">{scholarships.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">
                  {scholarships.filter(s => s.status === 'published').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {scholarships.filter(s => s.status === 'draft').length}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search scholarships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedContinent}
              onChange={(e) => setSelectedContinent(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent"
            >
              <option value="">All Continents</option>
              {CONTINENTS.map(continent => (
                <option key={continent} value={continent}>{continent}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent"
            >
              <option value="">All Types</option>
              {SCHOLARSHIP_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={selectedFunding}
              onChange={(e) => setSelectedFunding(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent"
            >
              <option value="">All Funding Types</option>
              {FUNDING_TYPES.map(funding => (
                <option key={funding} value={funding}>{funding}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Scholarships List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Scholarships ({filteredScholarships.length})
            </h2>
          </div>
          
          {filteredScholarships.length === 0 ? (
            <div className="p-12 text-center">
              <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No scholarships found</h3>
              <p className="text-gray-500 mb-6">
                {scholarships.length === 0 
                  ? "Get started by adding your first scholarship opportunity."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              <Link
                href="/admin/scholarship/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F4007] text-white rounded-lg hover:bg-[#0d3506] transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                Add Scholarship
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredScholarships.map((scholarship) => (
                <div key={scholarship.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={scholarship.thumbnail}
                          alt={scholarship.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {scholarship.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            <span>{scholarship.country}, {scholarship.continent}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4" />
                            <span>{scholarship.scholarship_types.split(', ')[0]}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{scholarship.funding_types.split(', ')[0]}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{scholarship.author}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        scholarship.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {scholarship.status}
                      </span>
                      
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/scholarship/edit/${scholarship.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit scholarship"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteScholarship(scholarship.id, scholarship.title)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete scholarship"
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