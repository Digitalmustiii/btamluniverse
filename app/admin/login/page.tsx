"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, User, AlertCircle, Shield, Globe, Briefcase, GraduationCap } from 'lucide-react'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if already logged in
    if (typeof window !== 'undefined') {
      const sessionData = sessionStorage.getItem('admin_session')
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData)
          // Check if session is still valid
          const sessionAge = Date.now() - session.loginTime
          const maxAge = 24 * 60 * 60 * 1000 // 24 hours
          
          if (sessionAge < maxAge) {
            router.push('/admin/dashboard')
          }
        } catch {
          // Invalid session, continue with login
        }
      }
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password')
      setLoading(false)
      return
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Simple credential check (in production, use proper auth)
      if (username.toLowerCase() === 'digitalmustiii' && password === 'btamlbymustiii') {
        const session = {
          id: '1',
          username: username,
          email: 'admin@btamluniverse.com',
          created_at: new Date().toISOString(),
          loginTime: Date.now()
        }

        sessionStorage.setItem('admin_session', JSON.stringify(session))
        
        // Success feedback
        setError('')
        router.push('/admin/dashboard')
      } else {
        setError('Invalid username or password')
      }
    } catch {
      setError('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const form = e.currentTarget.form
      if (form) {
        handleSubmit({ preventDefault: () => {}, currentTarget: form } as React.FormEvent<HTMLFormElement>)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F4007] via-[#1a6b0f] to-[#0F4007] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-white rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-white rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Globe className="absolute top-1/4 left-1/4 w-8 h-8 text-white/20 animate-bounce" style={{ animationDelay: '0s' }} />
        <Briefcase className="absolute top-1/3 right-1/4 w-6 h-6 text-white/20 animate-bounce" style={{ animationDelay: '1s' }} />
        <GraduationCap className="absolute bottom-1/3 left-1/3 w-7 h-7 text-white/20 animate-bounce" style={{ animationDelay: '2s' }} />
        <Shield className="absolute bottom-1/4 right-1/3 w-6 h-6 text-white/20 animate-bounce" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">BTAML Admin</h1>
            <p className="text-green-100 text-sm">Secure Administrative Access</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
                    placeholder="Enter your username"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4007] focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] text-white py-3 px-4 rounded-lg font-medium hover:from-[#0d3506] hover:to-[#155c0d] focus:ring-2 focus:ring-[#0F4007] focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">
                  Authorized personnel only
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                  <span>BTAML Universe</span>
                  <span>•</span>
                  <span>Admin Portal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Credentials Notice */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <p className="text-white text-sm text-center font-medium mb-2">Demo Credentials:</p>
            <div className="text-center text-green-100 text-xs space-y-1">
              <p>Username: <span className="font-mono bg-white/20 px-2 py-1 rounded">digitalmustiii</span></p>
              <p>Password: <span className="font-mono bg-white/20 px-2 py-1 rounded">btamlbymustiii</span></p>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}