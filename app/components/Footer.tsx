// components/Footer.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaEnvelope,
  FaWhatsapp,
  FaWeixin,
} from 'react-icons/fa'
import { TbBrandX } from 'react-icons/tb'
import { ArrowRight, Phone, Mail, Globe, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')
  const router = useRouter()

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setMessage('Please enter your email address')
      setMessageType('error')
      return
    }

    setIsLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Successfully subscribed!')
        setMessageType('success')
        setEmail('')
        
        // Redirect to thank you page after a short delay
        setTimeout(() => {
          router.push('/newsletter/thank-you')
        }, 1500)
      } else {
        setMessage(data.error || 'Subscription failed. Please try again.')
        setMessageType('error')
      }
    } catch {
      setMessage('Network error. Please check your connection and try again.')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer className="bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/3 right-1/3 w-28 h-28 border border-white/20 rounded-full"></div>
      </div>

      <div className="relative z-10 text-white pt-8 lg:pt-10 pb-8">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 mb-8">
            
            {/* Company Info & Newsletter */}
            <div className="lg:col-span-2 space-y-6">
              {/* Logo & Company Description */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-white p-2 rounded-full shadow-lg">
                    <Image
                      src="/logo.png"
                      alt="BTAML Universe Logo"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                      BTAML UNIVERSE
                    </h3>
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h4 className="text-xl font-semibold mb-4 text-green-100">
                    Information you can trust
                  </h4>
                  <p className="text-green-100 leading-relaxed mb-6">
                    BTAML UNIVERSE is your trusted source for reliable news and insightful analysis. We deliver timely updates on business, finance, and international developments so you can be well-informed.
                  </p>
                  
                  {/* Social Media Icons */}
                  <div className="flex flex-wrap gap-3">
                    {[
                      { icon: FaFacebookF, href: 'https://www.facebook.com/profile.php?id=100090887146887', label: 'Facebook' },
                      { icon: TbBrandX, href: '#', label: 'X' },
                      { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
                      { icon: FaInstagram, href: 'https://www.instagram.com/btaml_universe_official?igsh=MmY5M3pvdnM1MW02', label: 'Instagram' },
                      { icon: FaYoutube, href: '#', label: 'YouTube' },
                      { icon: FaEnvelope, href: 'mailto:consultbtaml@gmail.com', label: 'Email' },
                      { icon: FaWhatsapp, href: 'https://wa.me/8615810743803', label: 'WhatsApp' },
                      { icon: FaWeixin, href: 'https://i.imgur.com/yqHuCL0.png', label: 'WeChat' },
                    ].map(({ icon: Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 group"
                      >
                        <Icon className="w-4 h-4 text-green-100 group-hover:text-white transition-colors duration-300" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Newsletter Subscription
                </h4>
                <p className="text-green-100 text-sm mb-4 leading-relaxed">
                  Stay informed with our latest insights, analysis, and exclusive content delivered directly to your inbox.
                </p>
                
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  {/* Mobile: Stack vertically, Desktop: Side by side */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      disabled={isLoading}
                      className="flex-grow px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-green-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-green-800 rounded-xl font-semibold text-sm hover:bg-green-50 hover:scale-105 transition-all duration-300 shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 sm:flex-shrink-0"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Subscribing...
                        </>
                      ) : (
                        <>
                          Subscribe
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Status Message */}
                  {message && (
                    <div className={`flex items-center gap-2 text-sm p-3 rounded-lg ${
                      messageType === 'success' 
                        ? 'bg-green-500/20 text-green-200 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-200 border border-red-500/30'
                    }`}>
                      {messageType === 'success' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      {message}
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                Our Services
              </h4>
              <div className="space-y-3">
                {[
                  'Strategic Business Analysis',
                  'Creative & Operational Thinking',
                  'Research & Data Collection',
                  'Regional Intelligence & Monitoring',
                  'Scholarships & Opportunities',
                  'Security & Intelligence Updates',
                  'Custom Consulting Services'
                ].map((service, index) => (
                  <div key={index} className="flex items-start gap-3 group">
                    <div className="w-1.5 h-1.5 bg-green-300 rounded-full mt-2 flex-shrink-0 group-hover:bg-white transition-colors duration-300"></div>
                    <span className="text-green-100 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
                      {service}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                Contact Information
              </h4>
              
              <div className="space-y-4">
                {/* Phone Numbers */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className="w-4 h-4 text-green-300" />
                    <span className="text-green-100 text-sm font-medium">Phone Numbers</span>
                  </div>
                  <div className="space-y-1 ml-7">
                    <Link 
                      href="tel:+8615810743803" 
                      className="block text-white text-sm hover:text-green-200 transition-colors duration-300"
                    >
                      +86(0)15810743803
                    </Link>
                    <Link 
                      href="tel:+8613269127008" 
                      className="block text-white text-sm hover:text-green-200 transition-colors duration-300"
                    >
                      +86(0)13269127008
                    </Link>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-4 h-4 text-green-300" />
                    <span className="text-green-100 text-sm font-medium">Email Address</span>
                  </div>
                  <Link 
                    href="mailto:consultbtaml@gmail.com" 
                    className="block text-white text-sm hover:text-green-200 transition-colors duration-300 ml-7"
                  >
                    consultbtaml@gmail.com
                  </Link>
                </div>

                {/* Website */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-4 h-4 text-green-300" />
                    <span className="text-green-100 text-sm font-medium">Website</span>
                  </div>
                  <Link 
                    href="https://www.btamluniverse.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-white text-sm hover:text-green-200 transition-colors duration-300 ml-7"
                  >
                    www.btamluniverse.com
                  </Link>
                </div>

                {/* Description */}
                <div className="mt-6 p-4 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                  <p className="text-green-100 text-sm leading-relaxed">
                    Access exclusive business insights, industry news, and comprehensive analytical tools through a personalized workflow experience available on desktop, web, and mobile.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Divider */}
          <div className="border-t border-white/20 pt-8 mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-green-100 text-sm">
                © 2025 BTAML UNIVERSE. All rights reserved.
              </p>
              
              {/* Quick Links */}
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6">
                <Link 
                  href="/legal/privacy-policy" 
                  className="text-green-200 hover:text-white text-sm transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/legal/terms-of-use" 
                  className="text-green-200 hover:text-white text-sm transition-colors duration-300"
                >
                  Terms of Use
                </Link>
                <Link 
                  href="/legal/investment-disclaimers" 
                  className="text-green-200 hover:text-white text-sm transition-colors duration-300"
                >
                 Investment Disclaimers
                </Link>
                <Link 
                  href="/legal/regulatory-compliance" 
                  className="text-green-200 hover:text-white text-sm transition-colors duration-300"
                >
                Regulatory Compliance
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
        </div>
      </div>
    </footer>
  )
}