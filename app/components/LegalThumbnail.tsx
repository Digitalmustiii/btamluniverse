'use client'

import Link from 'next/link'

interface LegalItem {
  key: string
  title: string
  description: string
  href: string
}

const items: LegalItem[] = [
  {
    key: 'terms-of-use',
    title: 'Terms of Use',
    description:
      'Our Terms of Use outline the rules and responsibilities for accessing and using BTAML Universe\'s services. Please read them carefully to understand your rights and obligations.',
    href: '/legal/terms-of-use',
  },
  {
    key: 'privacy-policy',
    title: 'Privacy Policy',
    description:
      'Our Privacy Policy explains how BTAML Universe collects, uses, and protects your personal data. Please review it to understand our practices and your privacy rights.',
    href: '/legal/privacy-policy',
  },
  {
    key: 'investment-disclaimers',
    title: 'Investment Disclaimers',
    description:
      'Understand the risks and disclaimers associated with financial investments. This section explains that the provided information is for informational purposes only.',
    href: '/legal/investment-disclaimers',
  },
  {
    key: 'regulatory-compliance',
    title: 'Regulatory Compliance',
    description:
      'Stay updated with guidelines on anti-corruption, anti-money laundering, data protection, and ethical business practices.',
    href: '/legal/regulatory-compliance',
  },
]

export default function LegalThumbnail() {
  return (
    <section className="bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] shadow-lg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/4 right-1/4 w-20 h-20 border border-white/20 rounded-full"></div>
      </div>

      <div className="relative z-10 text-white py-8 lg:py-10">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <div className="inline-block">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              Legal Information
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-green-300 to-green-100 mx-auto rounded-full"></div>
          </div>
          <p className="mt-6 text-lg sm:text-xl lg:text-2xl text-green-100 max-w-4xl mx-auto leading-relaxed">
            Find all legal documentation, policies, and regulatory guidelines you need to stay informed and compliant.
          </p>
        </div>

        {/* Legal Cards Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {items.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="block"
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full border border-green-100">
                  
                  {/* Content */}
                  <div className="p-8 sm:p-10 flex flex-col justify-between h-full min-h-[280px]">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-4">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    
                    {/* CTA Button */}
                    <div className="mt-6">
                      <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-800 to-green-700 text-white text-base font-semibold rounded-xl shadow-lg">
                        Read More
                        <svg 
                          className="ml-3 w-5 h-5" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 sm:p-10 border border-white/20">
            <div className="text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Need Legal Assistance?
              </h3>
              <p className="text-green-100 text-lg mb-6 max-w-3xl mx-auto">
                Our legal documentation is regularly updated to reflect current regulations and best practices. 
                For specific legal advice, please consult with qualified legal professionals.
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white text-base font-medium rounded-xl border border-white/30">
                Last updated: January 2025
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
        </div>
      </div>
    </section>
  )
}