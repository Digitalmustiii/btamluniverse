// app/(main)/layout.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import AfricaThumbnail from '../components/AfricaThumbnail'
import BusinessThumbnail from '../components/BusinessThumbnail'
import ScholarshipThumbnail from '../components/ScholarshipThumbnail'
import SecurityThumbnail from '../components/SecurityThumbnail'
import LegalThumbnail from '../components/LegalThumbnail'
import Footer from '../components/Footer'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)

  // Trigger animation on mount
  useEffect(() => {
    // Trigger the animation after component mounts
    setIsLoaded(true)
  }, [])

  return (
    <div 
      id="main-layout" 
      style={{
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
      }}
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
