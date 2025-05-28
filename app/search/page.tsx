'use client'
import React, { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Search, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Shield, 
  FileText, 
  Calendar,
  ExternalLink,
  Home,
  ArrowLeft
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

interface Article {
  id: string
  title: string
  content: string
  category: string
  image?: string
  status: string
  created_at: string
}

interface StaticPage {
  title: string
  url: string
  type: string
  description?: string
}

interface SearchResults {
  regional_articles: Article[]
  business_articles: Article[]
  scholarships: Article[]
  security: Article[]
  static_pages: StaticPage[]
}

const SEARCH_KEYWORDS = {
  continents: ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'],
  scholarshipTypes: ['Undergraduate', 'Masters', 'PhD', 'Language Program', 'Research Fellowship', 'Exchange Program', 'Professional Development', 'Certificate Program', 'Summer Program', 'General Scholarship','School'],
  fundingTypes: ['Fully Funded', 'Partial Funding', 'Tuition Only', 'Living Expenses Only', 'Travel Grant', 'Research Grant', 'Merit-Based', 'Need-Based'],
  securityLevels: ['Low', 'Medium', 'High', 'Critical'],
  africanCountries: ['Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Comoros', 'Democratic Republic of the Congo', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Republic of the Congo', 'Rwanda', 'São Tomé and Príncipe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'],
  businessCategories: ['Agriculture', 'Agribusiness', 'Mining', 'Energy', 'Technology', 'Fintech', 'Infrastructure', 'Logistics', 'Sustainable Business', 'Market Entry', 'Risk Management', 'Market Trends', 'Analysis', 'Emerging Industries', 'Case Studies'],
  securityCategories: ['Security Advisories', 'Threat Intelligence', 'Risk Mitigation', 'Best Practices', 'Alert', 'Monitoring']
}

const AFRICAN_REGIONS = ['Eastern Africa', 'Western Africa', 'Central Africa', 'Northern Africa', 'Southern Africa']
const BUSINESS_CATEGORIES = ['Agriculture & Agribusiness', 'Mining & Energy', 'Technology & Fintech', 'Infrastructure & Logistics', 'Sustainable Business Practices', 'Market Entry Strategies', 'Risk Management', 'Market Trends & Analysis', 'Emerging Industries', 'Case Studies']
const SECURITY_CATEGORIES = ['Security Advisories', 'Threat Intelligence', 'Risk Mitigation', 'Best Practices']

// URL mapping functions
const getCategoryUrl = (category: string, type: string): string => {
  switch (type) {
    case 'regional':
      switch (category) {
        case 'Eastern Africa': return '/africa/eastern'
        case 'Western Africa': return '/africa/western'
        case 'Central Africa': return '/africa/central'
        case 'Northern Africa': return '/africa/northern'
        case 'Southern Africa': return '/africa/southern'
        default: return '/africa/eastern'
      }
    case 'business':
      switch (category) {
        case 'Agriculture & Agribusiness': return '/business/agriculture-agribusiness'
        case 'Mining & Energy': return '/business/mining-energy'
        case 'Technology & Fintech': return '/business/technology-fintech'
        case 'Infrastructure & Logistics': return '/business/infrastructure-logistics'
        case 'Sustainable Business Practices': return '/business/sustainable-business-practices'
        case 'Market Entry Strategies': return '/business/market-entry-strategies'
        case 'Risk Management': return '/business/risk-management'
        case 'Market Trends & Analysis': return '/business/market-trends-analysis'
        case 'Emerging Industries': return '/business/emerging-industries'
        case 'Case Studies': return '/business/case-studies'
        default: return '/business/agriculture-agribusiness'
      }
    case 'scholarship':
      return '/scholarship'
    case 'security':
      return '/security'
    default:
      return '/'
  }
}

// Separate component for search functionality
const SearchContent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults>({
    regional_articles: [],
    business_articles: [],
    scholarships: [],
    security: [],
    static_pages: []
  })
  const [loading, setLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)

  const getStaticPages = (searchTerm: string): StaticPage[] => {
    const lowerSearchTerm = searchTerm.toLowerCase()
    const pages: StaticPage[] = []

    // Legal pages
    const legalItems = [
      { title: 'Terms of Use', url: '/legal/terms-of-use', description: 'Rules and responsibilities for using BTAML Universe services' },
      { title: 'Privacy Policy', url: '/legal/privacy-policy', description: 'How we collect, use, and protect your personal data' },
      { title: 'Investment Disclaimers', url: '/legal/investment-disclaimers', description: 'Risks and disclaimers for financial investments' },
      { title: 'Regulatory Compliance', url: '/legal/regulatory-compliance', description: 'Anti-corruption, AML, and ethical business guidelines' }
    ]

    legalItems.forEach(item => {
      if (item.title.toLowerCase().includes(lowerSearchTerm) || 
          item.description.toLowerCase().includes(lowerSearchTerm) ||
          ['legal', 'terms', 'privacy', 'policy', 'investment', 'compliance', 'regulation'].some(keyword => 
            lowerSearchTerm.includes(keyword) && (item.title.toLowerCase().includes(keyword) || item.description.toLowerCase().includes(keyword))
          )) {
        pages.push({ ...item, type: 'Legal' })
      }
    })

    // Services pages
    const serviceKeywords = ['strategic', 'business', 'analysis', 'creative', 'operational', 'research', 'data', 'regional', 'intelligence', 'monitoring', 'consulting', 'services']
    if (serviceKeywords.some(keyword => lowerSearchTerm.includes(keyword)) || lowerSearchTerm.includes('service')) {
      pages.push({
        title: 'Our Services',
        url: '/services',
        type: 'Services',
        description: 'Strategic Business Analysis, Research & Data Collection, Regional Intelligence'
      })
    }

    // Main pages
    const mainPages = [
      { title: 'About Us', url: '/about', description: 'Learn about BTAML Universe mission and team' },
      { title: 'Contact', url: '/contact', description: 'Get in touch with our team' }
    ]

    mainPages.forEach(page => {
      if (page.title.toLowerCase().includes(lowerSearchTerm) || 
          page.description.toLowerCase().includes(lowerSearchTerm)) {
        pages.push({ ...page, type: 'General' })
      }
    })

    return pages
  }

  const performSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) return
    
    setLoading(true)
    try {
      const lowerSearchTerm = searchTerm.toLowerCase()
      
      // Enhanced search with broader keyword matching
      const searchConditions: string[] = []
      searchConditions.push(`title.ilike.%${searchTerm}%`)
      searchConditions.push(`content.ilike.%${searchTerm}%`)
      searchConditions.push(`category.ilike.%${searchTerm}%`)
      
      // Add keyword-based searches
      Object.values(SEARCH_KEYWORDS).flat().forEach(keyword => {
        if (lowerSearchTerm.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(lowerSearchTerm)) {
          searchConditions.push(`content.ilike.%${keyword}%`)
          searchConditions.push(`title.ilike.%${keyword}%`)
        }
      })

      const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .or(searchConditions.slice(0, 20).join(',')) // Limit conditions to avoid query complexity
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error

      // Categorize results with improved matching
      const searchResults: SearchResults = {
        regional_articles: [],
        business_articles: [],
        scholarships: [],
        security: [],
        static_pages: getStaticPages(searchTerm)
      }

      articles?.forEach(article => {
        const articleContent = `${article.title} ${article.content} ${article.category}`.toLowerCase()
        const isRelevant = searchConditions.some(condition => {
          const searchValue = condition.split('.ilike.%')[1]?.replace('%', '') || ''
          return articleContent.includes(searchValue.toLowerCase())
        })

        if (isRelevant) {
          if (AFRICAN_REGIONS.includes(article.category)) {
            searchResults.regional_articles.push(article)
          } else if (BUSINESS_CATEGORIES.includes(article.category)) {
            searchResults.business_articles.push(article)
          } else if (article.category === 'Scholarship') {
            searchResults.scholarships.push(article)
          } else if (SECURITY_CATEGORIES.includes(article.category)) {
            searchResults.security.push(article)
          }
        }
      })

      setResults(searchResults)
      
      const total = searchResults.regional_articles.length + 
                   searchResults.business_articles.length + 
                   searchResults.scholarships.length + 
                   searchResults.security.length + 
                   searchResults.static_pages.length
      setTotalResults(total)

    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const searchQuery = searchParams.get('q') || ''
    setQuery(searchQuery)
    if (searchQuery) {
      performSearch(searchQuery)
    }
  }, [searchParams, performSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const ResultCard = ({ article, type }: { article: Article, type: string }) => {
    const getIcon = () => {
      switch (type) {
        case 'regional': return <MapPin className="w-5 h-5" />
        case 'business': return <Briefcase className="w-5 h-5" />
        case 'scholarship': return <GraduationCap className="w-5 h-5" />
        case 'security': return <Shield className="w-5 h-5" />
        default: return <FileText className="w-5 h-5" />
      }
    }

    const getUrl = () => {
      return getCategoryUrl(article.category, type)
    }

    const getBadgeColor = () => {
      switch (type) {
        case 'regional': return 'bg-blue-100 text-blue-800'
        case 'business': return 'bg-green-100 text-green-800'
        case 'scholarship': return 'bg-purple-100 text-purple-800'
        case 'security': return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    }

    const getCategoryDisplayName = () => {
      switch (type) {
        case 'regional': return article.category.replace(' Africa', '')
        case 'business': return article.category.replace(' & ', ' ')
        case 'scholarship': return 'Scholarship'
        case 'security': return 'Security'
        default: return article.category
      }
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden group">
        <div className="flex">
          <div className="flex-shrink-0 w-24 h-24 bg-gray-100 flex items-center justify-center">
            {article.image ? (
              <Image
                src={article.image}
                alt={article.title}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400">
                {getIcon()}
              </div>
            )}
          </div>
          <div className="flex-1 p-4">
            <Link href={getUrl()} className="block">
              <h3 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-200 line-clamp-2 mb-2">
                {article.title}
              </h3>
            </Link>
            <div className="flex items-center justify-between text-sm">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor()}`}>
                {getCategoryDisplayName()}
              </span>
              <div className="flex items-center text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(article.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const SearchSection = ({ title, items, type, icon }: { 
    title: string, 
    items: Article[], 
    type: string, 
    icon: React.ReactNode 
  }) => {
    if (items.length === 0) return null

    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            {items.length}
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ResultCard key={item.id} article={item} type={type} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors duration-200">
            <ArrowLeft className="w-4 h-4" />
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>

        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, scholarships, security updates, countries, services..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white px-4 py-1.5 rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                Search
              </button>
            </div>
          </form>
          
          {query && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Search Results for <span className="text-green-600">&ldquo;{query}&rdquo;</span>
              </h2>
              {!loading && (
                <p className="text-gray-600">
                  Found {totalResults} result{totalResults !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        )}

        {/* No Query State */}
        {!query && !loading && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search BTAML Universe</h3>
            <p className="text-gray-600 mb-4">Enter keywords to find articles, scholarships, and security updates</p>
            <div className="text-sm text-gray-500 max-w-2xl mx-auto">
              <p className="mb-2">Try searching for:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Nigeria', 'Kenya', 'Scholarship', 'Business', 'Security', 'Investment', 'Technology', 'Agriculture'].map(term => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term)
                      router.push(`/search?q=${encodeURIComponent(term)}`)
                    }}
                    className="px-3 py-1 bg-gray-200 hover:bg-green-100 hover:text-green-700 rounded-full text-xs transition-colors duration-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No Results State */}
        {query && !loading && totalResults === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              No results found for &ldquo;{query}&rdquo;. Try different keywords or check your spelling.
            </p>
          </div>
        )}

        {/* Search Results */}
        {!loading && totalResults > 0 && (
          <div>
            <SearchSection
              title="Regional Articles"
              items={results.regional_articles}
              type="regional"
              icon={<MapPin className="w-4 h-4" />}
            />
            
            <SearchSection
              title="Business Articles"
              items={results.business_articles}
              type="business"
              icon={<Briefcase className="w-4 h-4" />}
            />
            
            <SearchSection
              title="Scholarships"
              items={results.scholarships}
              type="scholarship"
              icon={<GraduationCap className="w-4 h-4" />}
            />
            
            <SearchSection
              title="Security Updates"
              items={results.security}
              type="security"
              icon={<Shield className="w-4 h-4" />}
            />

            {/* Static Pages */}
            {results.static_pages.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Pages</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {results.static_pages.length}
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {results.static_pages.map((page, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 p-4">
                      <Link href={page.url} className="block group">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                            {page.title}
                          </span>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors duration-200 flex-shrink-0 ml-2" />
                        </div>
                        {page.description && (
                          <p className="text-sm text-gray-600 mb-2">{page.description}</p>
                        )}
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {page.type}
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Loading component for Suspense fallback
const SearchLoadingFallback = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    </div>
  </div>
)

// Main component with Suspense wrapper
const SearchPage = () => {
  return (
    <Suspense fallback={<SearchLoadingFallback />}>
      <SearchContent />
    </Suspense>
  )
}

export default SearchPage