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
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Trigger animation on mount
  useEffect(() => {
    // Trigger the animation after component mounts
    setIsLoaded(true)
  }, [])

  // Handle scroll to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop
      setShowBackToTop(scrollTop > 300) // Show button after scrolling 300px
    }

    // Add event listener
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Check initial scroll position
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to top function
  const scrollToTop = () => {
    // Try multiple methods for better browser compatibility
    if (window.scrollTo) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    } else {
      // Fallback for older browsers
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
  }

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

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#0F4007',
          background: 'linear-gradient(135deg, #0F4007 0%, #1a6b0f 100%)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '24px',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(15, 64, 7, 0.4)',
          zIndex: 9999,
          transition: 'all 0.3s ease',
          display: showBackToTop ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: showBackToTop ? 1 : 0,
          transform: showBackToTop ? 'translateY(0)' : 'translateY(10px)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #0a2f05 0%, #14530c 100%)'
          e.currentTarget.style.transform = 'scale(1.1) translateY(0)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #0F4007 0%, #1a6b0f 100%)'
          e.currentTarget.style.transform = 'scale(1) translateY(0)'
        }}
        aria-label="Back to top"
        title="Back to top"
      >
        ↑
      </button>
    </div>
  )
}