'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Mail, Lock, Eye, EyeOff, User, CheckCircle2,
  Shield, Globe, Award, TrendingUp, Facebook, ArrowLeft
} from 'lucide-react'
import { supabase } from '../../../lib/supabaseClient'

export default function SignUp() {
  const router = useRouter()
  const [fullName, setFullName]         = useState('')
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [errorMsg, setErrorMsg]         = useState('')
  const [message, setMessage]           = useState('')
  const [loading, setLoading]           = useState(false)
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setMessage('')

    if (!agreeToTerms) {
      setErrorMsg('Please agree to the Terms and Conditions')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      })

      if (error) {
        setErrorMsg(error.message)
      } else {
        // redirect to login after a successful sign-up
        router.push('/login')
      }
    } catch {
      setErrorMsg('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialSignUp = async (provider: 'google' | 'facebook') => {
    if (!agreeToTerms) {
      setErrorMsg('Please agree to the Terms and Conditions')
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/dashboard` }
      })
      if (error) setErrorMsg(error.message)
    } catch {
      setErrorMsg('Social signup failed')
    } finally {
      setLoading(false)
    }
  }

  const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" className="text-gray-600 group-hover:text-green-600">
      {/* your same paths */}
      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )

  const services = [
    { icon: TrendingUp, title: 'Strategic Business Analysis',  description: 'Expert insights for African market opportunities' },
    { icon: Globe,      title: 'Regional Intelligence',        description: 'Real-time updates on African business landscape' },
    { icon: Award,      title: 'Scholarships & Opportunities', description: 'Access to funding and educational programs' },
    { icon: Shield,     title: 'Security Updates',             description: 'Critical security insights for business' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F4007] via-[#1a6b0f] to-[#0F4007] flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          {/* Back to Home Button */}
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center text-white hover:text-green-200 transition-colors duration-200 group"
            >
              <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-xl shadow-lg mb-4">
              <Image
                src="/logo.png"
                alt="BTAML Universe Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Join BTAML Universe</h1>
            <p className="text-green-100 text-sm">Unlock African business intelligence</p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-6 space-y-5 border border-white/20">
            {/* Success Message */}
            {message && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  <p className="text-green-700 text-sm font-medium">{message}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errorMsg}</p>
              </div>
            )}

            {/* Social Signup Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialSignUp('google')}
                disabled={loading}
                className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 transition-all duration-200 disabled:opacity-50 group"
              >
                <GoogleIcon />
                <span className="ml-2 text-sm text-gray-600 group-hover:text-green-600">Google</span>
              </button>
              <button
                onClick={() => handleSocialSignUp('facebook')}
                disabled={loading}
                className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 transition-all duration-200 disabled:opacity-50 group"
              >
                <Facebook size={20} className="text-gray-600 group-hover:text-green-600" />
                <span className="ml-2 text-sm text-gray-600 group-hover:text-green-600">Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with email</span>
              </div>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Full Name Field */}
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <div className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link
                    href="/legal/terms-of-use"
                    className="text-green-600 hover:text-green-700 font-medium"
                    target="_blank"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/legal/privacy-policy"
                    className="text-green-600 hover:text-green-700 font-medium"
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={loading || !agreeToTerms}
                className="w-full bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] text-white py-3 rounded-lg font-medium hover:from-[#1a6b0f] hover:to-[#0F4007] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account →'
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Services Section (Desktop) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#1a6b0f] to-[#0F4007] text-white p-8 items-center justify-center">
        <div className="max-w-md">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
            Our Services
          </h2>
          <p className="text-green-100 mb-4 text-sm leading-relaxed">
            Join the premier platform for African business intelligence and exclusive opportunities.
          </p>
          
          <div className="grid gap-2 mb-4">
            {services.map((service, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-all duration-300">
                    <service.icon size={16} className="text-green-200" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1 text-sm">{service.title}</h3>
                    <p className="text-green-100 text-xs leading-relaxed">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="font-semibold text-white text-sm">Join 10,000+ professionals</span>
            </div>
            <p className="text-green-100 text-xs leading-relaxed">
              Connect with business leaders, investors, and entrepreneurs across Africa. Access exclusive insights and opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Services Preview */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0F4007] to-transparent p-3">
        <div className="text-center text-white">
          <p className="text-xs opacity-80">Join 10,000+ professionals in African business intelligence</p>
        </div>
      </div>
    </div>
  )
}
