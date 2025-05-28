// app/(main)/layout.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Header from '../components/Header'
import AfricaThumbnail from '../components/AfricaThumbnail'
import BusinessThumbnail from '../components/BusinessThumbnail'
import ScholarshipThumbnail from '../components/ScholarshipThumbnail'
import SecurityThumbnail from '../components/SecurityThumbnail'
import LegalThumbnail from '../components/LegalThumbnail'
import Footer from '../components/Footer'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isLoaded, setIsLoaded] = useState(false)

  // Scroll to top when navigating to home
  useEffect(() => {
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [pathname])

  // Trigger animation on mount
  useEffect(() => {
    // Small delay to ensure smooth animation
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      id="main-layout" 
      className={`page-transition ${isLoaded ? 'loaded' : ''}`}
    >
      <div id="header-section">
        <Header />
      </div>
      <div id="africa-section">
        <AfricaThumbnail />
      </div>
      <div id="content-sections">
        <BusinessThumbnail />
        <ScholarshipThumbnail />
        <SecurityThumbnail />
        <LegalThumbnail />
      </div>
      <Footer />
      {children}
    </div>
  )
}