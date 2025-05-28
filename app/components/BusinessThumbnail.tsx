// BusinessThumbnail.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'

interface Category {
  key: string
  title: string
  imageSrc: string
  description: string
  href: string
}

const categories: Category[] = [
  {
    key: 'agriculture-agribusiness',
    title: 'Agriculture & Agribusiness',
    imageSrc: '/images/agriculture.jpg',
    description: 'From farm to market—discover....',
    href: '/business/agriculture-agribusiness',
  },
  {
    key: 'mining-energy',
    title: 'Mining & Energy',
    imageSrc: '/images/mining.jpg',
    description: 'Explore Africa\'s rich natural resources....',
    href: '/business/mining-energy',
  },
  {
    key: 'technology-fintech',
    title: 'Technology & Fintech',
    imageSrc: '/images/technology.jpg',
    description: 'Innovation hubs, payment platforms....',
    href: '/business/technology-fintech',
  },
  {
    key: 'infrastructure-logistics',
    title: 'Infrastructure & Logistics',
    imageSrc: '/images/infrastructure.jpg',
    description: 'Key transport corridors, ports....',
    href: '/business/infrastructure-logistics',
  },
  {
    key: 'business-practices',
    title: 'Business Practices',
    imageSrc: '/images/businesspractices.jpg',
    description: 'Green financing, ESG frameworks....',
    href: '/business/business-practices',
  },
  {
    key: 'market-entry-strategies',
    title: 'Market Entry Strategies',
    imageSrc: '/images/marketentry.jpg',
    description: 'Best practices for entering new....',
    href: '/business/market-entry-strategies',
  },
  {
    key: 'risk-management',
    title: 'Risk Management',
    imageSrc: '/images/riskmanagement.jpg',
    description: 'Mitigating political, economic....',
    href: '/business/risk-management',
  },
  {
    key: 'market-trends-analysis',
    title: 'Market Trends & Analysis',
    imageSrc: '/images/markettrends.jpg',
    description: 'Data-driven insights into consumer....',
    href: '/business/market-trends-analysis',
  },
  {
    key: 'emerging-industries',
    title: 'Emerging Industries',
    imageSrc: '/images/emergingindustries.jpg',
    description: 'Next-gen sectors—from green tech....',
    href: '/business/emerging-industries',
  },
  {
    key: 'case-studies',
    title: 'Case Studies',
    imageSrc: '/images/casestudies.jpg',
    description: 'Deep dives into successful investments....',
    href: '/business/case-studies',
  },
]

export default function BusinessThumbnail() {
  return (
    <section className="bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] shadow-lg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-white/20 rounded-full"></div>
      </div>

      <div className="relative z-10 text-white py-8 lg:py-10">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <div className="inline-block">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              Business & Investments
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-green-300 to-green-100 mx-auto rounded-full"></div>
          </div>
          <p className="mt-6 text-lg sm:text-xl lg:text-2xl text-green-100 max-w-4xl mx-auto leading-relaxed">
            Dive into Africa&apos;s diverse business sectors and uncover prime investment opportunities.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* First Row - First 5 categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8 mb-6">
            {categories.slice(0, 5).map((category) => (
              <Link
                key={category.key}
                href={category.href}
                className="group block"
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full transition-all duration-300 group-hover:shadow-xl border border-green-100">
                  {/* Image Container */}
                  <div className="relative h-48 sm:h-52 lg:h-44 xl:h-48 overflow-hidden">
                    <Image
                      src={category.imageSrc}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col justify-between h-52 lg:h-56">
                    <div>
                      <h3 className="text-lg lg:text-xl font-bold text-green-800 mb-3 group-hover:text-green-700 transition-colors duration-300">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                    
                    {/* CTA Button */}
                    <div className="mt-4">
                      <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-green-700 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-300 group-hover:from-green-700 group-hover:to-green-600 group-hover:shadow-lg">
                        Learn More
                        <svg 
                          className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 border-2 border-transparent rounded-2xl transition-all duration-300 pointer-events-none"></div>
                </div>
              </Link>
            ))}
          </div>

          {/* Second Row - Last 5 categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8">
            {categories.slice(5, 10).map((category) => (
              <Link
                key={category.key}
                href={category.href}
                className="group block"
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full transition-all duration-300 group-hover:shadow-xl border border-green-100">
                  {/* Image Container */}
                  <div className="relative h-48 sm:h-52 lg:h-44 xl:h-48 overflow-hidden">
                    <Image
                      src={category.imageSrc}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col justify-between h-52 lg:h-56">
                    <div>
                      <h3 className="text-lg lg:text-xl font-bold text-green-800 mb-3 group-hover:text-green-700 transition-colors duration-300">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                    
                    {/* CTA Button */}
                    <div className="mt-4">
                      <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-green-700 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-300 group-hover:from-green-700 group-hover:to-green-600 group-hover:shadow-lg">
                        Learn More
                        <svg 
                          className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 border-2 border-transparent rounded-2xl transition-all duration-300 pointer-events-none"></div>
                </div>
              </Link>
            ))}
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