// app/newsletter/thank-you/page.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Home, Mail, ArrowLeft } from 'lucide-react'

export default function NewsletterThankYou() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F4007] via-[#1a6b0f] to-[#0F4007] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/3 right-1/3 w-28 h-28 border border-white/20 rounded-full"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Success Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-3 rounded-full shadow-lg">
                <Image
                  src="/logo.png"
                  alt="BTAML Universe Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-green-400/20 p-4 rounded-full">
                <CheckCircle className="w-16 h-16 text-green-300" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-white to-green-100 bg-clip-text">
              Thank You!
            </h1>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Mail className="w-5 h-5 text-green-300" />
                <h2 className="text-xl font-semibold text-green-100">
                  Newsletter Subscription Confirmed
                </h2>
              </div>
              <p className="text-green-100 leading-relaxed">
                You&apos;ve successfully subscribed to the BTAML UNIVERSE newsletter. 
                You&apos;ll receive our latest insights, business analysis, and exclusive 
                content directly in your inbox.
              </p>
            </div>

            {/* What's Next */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
              <h3 className="text-lg font-semibold text-white mb-3">
                What&apos;s Next?
              </h3>
              <ul className="text-green-100 text-sm space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-300 rounded-full mt-2 flex-shrink-0"></div>
                  Check your email for a welcome message
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-300 rounded-full mt-2 flex-shrink-0"></div>
                  Receive weekly insights and analysis
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-300 rounded-full mt-2 flex-shrink-0"></div>
                  Get exclusive access to premium content
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link
                href="/"
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-white text-green-800 rounded-xl font-semibold hover:bg-green-50 hover:scale-105 transition-all duration-300 shadow-lg group"
              >
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Return to Home
              </Link>
              
              <Link
                href="/services"
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-300" />
                Learn More About Us
              </Link>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-6">
            <p className="text-green-200 text-sm">
              Questions? Contact us at{' '}
              <a 
                href="mailto:consultbtaml@gmail.com" 
                className="text-white hover:text-green-200 transition-colors duration-300 underline"
              >
                consultbtaml@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}