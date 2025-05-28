// AfricaThumbnail.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'

interface Region {
  key: string
  title: string
  imageSrc: string
  description: string
  href: string
}

const regions: Region[] = [
  {
    key: 'western',
    title: 'Western African Region',
    imageSrc: '/images/western-africa.jpg',
    description: 'Discover dynamic markets, cultural richness, and emerging tech innovations...',
    href: '/africa/western',
  },
  {
    key: 'eastern',
    title: 'Eastern African Region',
    imageSrc: '/images/eastern-africa.jpg',
    description: 'Explore robust growth, innovation, and urban transformation...',
    href: '/africa/eastern',
  },
  {
    key: 'northern',
    title: 'Northern African Region',
    imageSrc: '/images/northern-africa.jpg',
    description: 'Gain insights into historical legacies, economic developments...',
    href: '/africa/northern',
  },
  {
    key: 'central',
    title: 'Central African Region',
    imageSrc: '/images/central-africa.jpg',
    description: 'Uncover investment potentials, resource strategies...',
    href: '/africa/central',
  },
  {
    key: 'southern',
    title: 'Southern African Region',
    imageSrc: '/images/southern-africa.jpg',
    description: 'Discover sustainable practices, innovative industries...',
    href: '/africa/southern',
  },
]

export default function AfricaThumbnail() {
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
              Africa
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-green-300 to-green-100 mx-auto rounded-full"></div>
          </div>
          <p className="mt-6 text-lg sm:text-xl lg:text-2xl text-green-100 max-w-4xl mx-auto leading-relaxed">
            BTAML Universe provides you with the latest news and detailed analysis on every corner of the African continent.
          </p>
        </div>

        {/* Regions Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8">
            {regions.map((region) => (
              <Link
                key={region.key}
                href={region.href}
                className="group block"
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full transition-all duration-300 group-hover:shadow-xl border border-green-100 flex flex-col">
                  {/* Image Container */}
                  <div className="relative h-48 sm:h-52 lg:h-44 xl:h-48 overflow-hidden">
                    <Image
                      src={region.imageSrc}
                      alt={region.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg lg:text-xl font-bold text-green-800 mb-3 group-hover:text-green-700 transition-colors duration-300 leading-tight">
                      {region.title}
                    </h3>
                    <p className="text-gray-600 text-sm lg:text-base leading-relaxed mb-4 line-clamp-3 flex-grow">
                      {region.description}
                    </p>
                    
                    {/* CTA Button */}
                    <div className="mt-auto">
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