// components/admin/AdminLayout.tsx
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Menu, 
  X, 
  Globe, 
  Briefcase, 
  GraduationCap, 
  Shield, 
  Home,
  LogOut,
  User
} from 'lucide-react'
import { AdminUser } from '@/lib/adminAuth'

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function AdminLayout({ children, title = 'Admin Dashboard' }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<AdminUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionData = sessionStorage.getItem('admin_session')
      if (!sessionData) {
        router.push('/admin/login')
        return
      }
      try {
        const session: AdminUser = JSON.parse(sessionData)
        setUser(session)
      } catch {
        router.push('/admin/login')
      }
    }
  }, [router])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_session')
    }
    router.push('/admin/login')
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Africa News', href: '/admin/africa', icon: Globe },
    { name: 'Business', href: '/admin/business', icon: Briefcase },
    { name: 'Scholarship', href: '/admin/scholarship', icon: GraduationCap },
    { name: 'Security', href: '/admin/security', icon: Shield },
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#0F4007] to-[#1a6b0f] transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 bg-black/10">
          <h1 className="text-white text-lg font-bold">BTAML Admin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-green-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-white rounded-lg hover:bg-white/10 transition-colors duration-200 group"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={20} className="group-hover:text-green-200" />
                    <span className="group-hover:text-green-200">{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
          <div className="flex items-center gap-3 text-white mb-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.username}</p>
              <p className="text-xs text-green-200 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white hover:text-red-200 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu size={20} />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/"
                target="_blank"
                className="text-sm text-gray-600 hover:text-[#0F4007] font-medium"
              >
                View Site
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
