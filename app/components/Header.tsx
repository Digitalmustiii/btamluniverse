// components/Header.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  User as UserIcon,
  UserPlus,
  Menu,
  X,
  LogOut,
  Settings,
  UserCircle,
  Plus,
  Minus,
} from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const Header = () => {
  const router = useRouter()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null)
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileSearchQuery, setMobileSearchQuery] = useState('')
  const userDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }
    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Handle clicking outside user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false)
      }
    }

    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userDropdownOpen])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUserDropdownOpen(false)
  }

  // Search handlers
  const handleDesktopSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (mobileSearchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`)
      setMobileMenuOpen(false)
      setMobileSearchQuery('')
    }
  }

  const handleSearchInputKeyPress = (e: React.KeyboardEvent, isMobile: boolean = false) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const query = isMobile ? mobileSearchQuery : searchQuery
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
        if (isMobile) {
          setMobileMenuOpen(false)
          setMobileSearchQuery('')
        }
      }
    }
  }

  const handleDropdownEnter = (menu: string) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
      setDropdownTimeout(null)
    }
    setOpenDropdown(menu)
  }

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => setOpenDropdown(null), 150)
    setDropdownTimeout(timeout)
  }

  const handleDropdownContentEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
      setDropdownTimeout(null)
    }
  }

  // User dropdown handlers
  const handleUserDropdownEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
      setDropdownTimeout(null)
    }
    setUserDropdownOpen(true)
  }

  const handleUserDropdownLeave = () => {
    const timeout = setTimeout(() => setUserDropdownOpen(false), 150)
    setDropdownTimeout(timeout)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    setMobileDropdownOpen(null)
  }

  const toggleMobileDropdown = (menu: string) => {
    setMobileDropdownOpen(mobileDropdownOpen === menu ? null : menu)
  }

  return (
    <>
      <header className="bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] shadow-lg sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            {/* Logo + Title */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="bg-white p-2 rounded-full shadow-md">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <h1 className="text-white text-xl sm:text-2xl font-bold tracking-tight whitespace-nowrap">
                BTAML UNIVERSE
              </h1>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center ml-auto">
              <nav className="flex items-center gap-4 xl:gap-6 mr-4">
                {/** Africa Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter('africa')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button className="flex items-center gap-1 text-white font-medium hover:text-green-200 transition-colors duration-200 group text-sm">
                    Africa
                    <Plus
                      size={12}
                      className={`transform transition-all duration-200 ${
                        openDropdown === 'africa' ? 'rotate-45' : 'rotate-0'
                      }`}
                    />
                  </button>
                  {openDropdown === 'africa' && (
                    <div
                      className="absolute left-0 top-full mt-1 bg-white shadow-xl rounded-lg p-3 space-y-2 z-10 min-w-[180px] border border-gray-100"
                      onMouseEnter={handleDropdownContentEnter}
                      onMouseLeave={handleDropdownLeave}
                    >
                      {['Eastern', 'Western', 'Northern', 'Southern', 'Central'].map((region) => (
                        <Link
                          key={region}
                          href={`/africa/${region.toLowerCase()}`}
                          className="block text-gray-800 hover:text-green-600 hover:bg-green-50 px-3 py-2 rounded-md transition-all duration-200 font-medium text-sm"
                        >
                          {region} Africa
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/** Business Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter('business')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button className="flex items-center gap-1 text-white font-medium hover:text-green-200 transition-colors duration-200 group text-sm">
                    Business & Investments
                    <Plus
                      size={12}
                      className={`transform transition-all duration-200 ${
                        openDropdown === 'business' ? 'rotate-45' : 'rotate-0'
                      }`}
                    />
                  </button>
                  {openDropdown === 'business' && (
                    <div
                      className="absolute left-0 top-full mt-1 bg-white shadow-xl rounded-lg p-3 space-y-1 z-10 w-72 border border-gray-100 max-h-80 overflow-y-auto"
                      onMouseEnter={handleDropdownContentEnter}
                      onMouseLeave={handleDropdownLeave}
                    >
                      {[
                        'Agriculture & Agribusiness',
                        'Mining & Energy',
                        'Technology & Fintech',
                        'Infrastructure & Logistics',
                        'Sustainable Business Practices',
                        'Market Entry Strategies',
                        'Risk Management',
                        'Market Trends & Analysis',
                        'Emerging Industries',
                        'Case Studies',
                      ].map((item) => (
                        <Link
                          key={item}
                          href={`/business/${item.toLowerCase().replace(/ & | /g, '-')}`}
                          className="block text-gray-800 hover:text-green-600 hover:bg-green-50 px-3 py-2 rounded-md transition-all duration-200 font-medium text-sm"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/** Legal Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter('legal')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button className="flex items-center gap-1 text-white font-medium hover:text-green-200 transition-colors duration-200 group text-sm">
                    Legal
                    <Plus
                      size={12}
                      className={`transform transition-all duration-200 ${
                        openDropdown === 'legal' ? 'rotate-45' : 'rotate-0'
                      }`}
                    />
                  </button>
                  {openDropdown === 'legal' && (
                    <div
                      className="absolute left-0 top-full mt-1 bg-white shadow-xl rounded-lg p-3 space-y-2 z-10 min-w-[220px] border border-gray-100"
                      onMouseEnter={handleDropdownContentEnter}
                      onMouseLeave={handleDropdownLeave}
                    >
                      {['Terms of Use', 'Privacy Policy', 'Investment Disclaimers', 'Regulatory Compliance'].map((item) => (
                        <Link
                          key={item}
                          href={`/legal/${item.toLowerCase().replace(/ /g, '-')}`}
                          className="block text-gray-800 hover:text-green-600 hover:bg-green-50 px-3 py-2 rounded-md transition-all duration-200 font-medium text-sm"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link href="/scholarship" className="text-white text-sm hover:text-green-200">
                  Scholarship
                </Link>
                <Link href="/security" className="text-white text-sm hover:text-green-200">
                  Security
                </Link>
                <Link href="/services" className="text-white text-sm hover:text-green-200">
                  Services
                </Link>
              </nav>

              {/** Search + Auth */}
              <div className="flex gap-2 items-center">
                <form onSubmit={handleDesktopSearch} className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => handleSearchInputKeyPress(e, false)}
                    placeholder="Search..."
                    className="bg-white/10 border border-white/30 text-white placeholder-green-200 pl-10 pr-3 py-2 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent backdrop-blur-sm transition-all duration-200 w-40 focus:w-64"
                  />
                </form>

                {user ? (
                  <div 
                    className="relative" 
                    ref={userDropdownRef}
                    onMouseEnter={handleUserDropdownEnter}
                    onMouseLeave={handleUserDropdownLeave}
                  >
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 text-white hover:text-green-200 font-medium px-3 py-2 rounded-full border border-white/30 hover:border-green-200 transition-all duration-200 backdrop-blur-sm"
                    >
                      <UserCircle size={16} />
                      <span className="text-xs max-w-20 truncate">
                        {user.email?.split('@')[0] || 'User'}
                      </span>
                      <Plus
                        size={12}
                        className={`transform transition-all duration-200 ${
                          userDropdownOpen ? 'rotate-45' : 'rotate-0'
                        }`}
                      />
                    </button>
                    {userDropdownOpen && (
                      <div 
                        className="absolute right-0 top-full mt-1 bg-white shadow-xl rounded-lg p-2 space-y-1 z-10 min-w-[180px] border border-gray-100"
                        onMouseEnter={handleDropdownContentEnter}
                        onMouseLeave={handleUserDropdownLeave}
                      >
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 text-gray-800 hover:text-green-600 hover:bg-green-50 px-3 py-2 rounded-md transition-all duration-200 font-medium text-sm"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Settings size={14} />
                          Profile
                        </Link>
                        <hr className="my-1 border-gray-200" />
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 w-full text-left text-gray-800 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-all duration-200 font-medium text-sm"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-1 text-white hover:text-green-200 font-medium px-3 py-2 rounded-full border border-white/30 hover:border-green-200 transition-all duration-200 backdrop-blur-sm text-xs"
                    >
                      <UserIcon size={12} />
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center gap-1 bg-white text-green-800 font-semibold px-3 py-2 rounded-full hover:bg-green-50 hover:shadow-lg transition-all duration-200 text-xs"
                    >
                      <UserPlus size={12} />
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/** Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 ml-auto"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </header>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={toggleMobileMenu}>
          <div
            className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-[#0F4007] to-[#1a6b0f] shadow-2xl transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-white text-xl font-bold">Menu</h2>
                <button
                  onClick={toggleMobileMenu}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleMobileSearch} className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-300" />
                </div>
                <input
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  onKeyPress={(e) => handleSearchInputKeyPress(e, true)}
                  placeholder="Search..."
                  className="w-full bg-white/10 border border-white/30 text-white placeholder-green-200 pl-12 pr-4 py-3 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent backdrop-blur-sm"
                />
              </form>

              <nav className="space-y-2 mb-8">
                {/** Mobile Africa Dropdown */}
                <div>
                  <button
                    onClick={() => toggleMobileDropdown('africa')}
                    className="flex items-center justify-between w-full text-white font-medium hover:text-green-200 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-200"
                  >
                    Africa
                    {mobileDropdownOpen === 'africa' ? (
                      <Minus size={16} />
                    ) : (
                      <Plus size={16} />
                    )}
                  </button>
                  {mobileDropdownOpen === 'africa' && (
                    <div className="ml-4 mt-2 space-y-1">
                      {['Eastern', 'Western', 'Northern', 'Southern', 'Central'].map((region) => (
                        <Link
                          key={region}
                          href={`/africa/${region.toLowerCase()}`}
                          className="block text-green-200 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-sm"
                          onClick={toggleMobileMenu}
                        >
                          {region} Africa
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/** Mobile Business Dropdown */}
                <div>
                  <button
                    onClick={() => toggleMobileDropdown('business')}
                    className="flex items-center justify-between w-full text-white font-medium hover:text-green-200 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-200"
                  >
                    Business & Investments
                    {mobileDropdownOpen === 'business' ? (
                      <Minus size={16} />
                    ) : (
                      <Plus size={16} />
                    )}
                  </button>
                  {mobileDropdownOpen === 'business' && (
                    <div className="ml-4 mt-2 space-y-1 max-h-60 overflow-y-auto">
                      {[
                        'Agriculture & Agribusiness',
                        'Mining & Energy',
                        'Technology & Fintech',
                        'Infrastructure & Logistics',
                        'Sustainable Business Practices',
                        'Market Entry Strategies',
                        'Risk Management',
                        'Market Trends & Analysis',
                        'Emerging Industries',
                        'Case Studies',
                      ].map((item) => (
                        <Link
                          key={item}
                          href={`/business/${item.toLowerCase().replace(/ & | /g, '-')}`}
                          className="block text-green-200 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-sm"
                          onClick={toggleMobileMenu}
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/** Mobile Legal Dropdown */}
                <div>
                  <button
                    onClick={() => toggleMobileDropdown('legal')}
                    className="flex items-center justify-between w-full text-white font-medium hover:text-green-200 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-200"
                  >
                    Legal
                    {mobileDropdownOpen === 'legal' ? (
                      <Minus size={16} />
                    ) : (
                      <Plus size={16} />
                    )}
                  </button>
                  {mobileDropdownOpen === 'legal' && (
                    <div className="ml-4 mt-2 space-y-1">
                      {['Terms of Use', 'Privacy Policy', 'Investment Disclaimers', 'Regulatory Compliance'].map((item) => (
                        <Link
                          key={item}
                          href={`/legal/${item.toLowerCase().replace(/ /g, '-')}`}
                          className="block text-green-200 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-sm"
                          onClick={toggleMobileMenu}
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/** Mobile Regular Links */}
                <Link
                  href="/scholarship"
                  className="block text-white font-medium hover:text-green-200 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-200"
                  onClick={toggleMobileMenu}
                >
                  Scholarship
                </Link>
                <Link
                  href="/security"
                  className="block text-white font-medium hover:text-green-200 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-200"
                  onClick={toggleMobileMenu}
                >
                  Security Updates
                </Link>
                <Link
                  href="/services"
                  className="block text-white font-medium hover:text-green-200 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-200"
                  onClick={toggleMobileMenu}
                >
                  Our Services
                </Link>
              </nav>

              {/* Mobile Auth Section */}
              <div className="space-y-3 pt-6 border-t border-white/20">
                {user ? (
                  <>
                    <div className="text-white text-center mb-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <UserCircle size={20} />
                        <span className="font-medium">{user.email?.split('@')[0] || 'User'}</span>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center justify-center gap-2 w-full text-white font-medium px-4 py-3 rounded-full border border-white/30 hover:border-green-200 hover:bg-white/10 transition-all duration-200"
                      onClick={toggleMobileMenu}
                    >
                      <Settings size={16} />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut()
                        toggleMobileMenu()
                      }}
                      className="flex items-center justify-center gap-2 w-full text-white font-medium px-4 py-3 rounded-full border border-red-300 hover:border-red-200 hover:bg-red-500/20 transition-all duration-200"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center justify-center gap-2 w-full text-white font-medium px-4 py-3 rounded-full border border-white/30 hover:border-green-200 hover:bg-white/10 transition-all duration-200"
                      onClick={toggleMobileMenu}
                    >
                      <UserIcon size={16} />
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center justify-center gap-2 w-full bg-white text-green-800 font-semibold px-4 py-3 rounded-full hover:bg-green-50 transition-all duration-200"
                      onClick={toggleMobileMenu}
                    >
                      <UserPlus size={16} />
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header