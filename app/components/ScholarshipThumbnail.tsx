//app/components/ScholarshipThumbnail.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function ScholarshipThumbnail() {
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
              Scholarship Opportunities
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-green-300 to-green-100 mx-auto rounded-full"></div>
          </div>
          <p className="mt-6 text-lg sm:text-xl lg:text-2xl text-green-100 max-w-4xl mx-auto leading-relaxed">
            Discover comprehensive scholarship opportunities overseas – study in world-class institutions with full & partial financial support.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="group block">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 group-hover:shadow-2xl border border-green-100">
              
              {/* Image Container */}
              <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
                <Image
                  src="/images/scholarship.jpg"
                  alt="Scholarship caps in flight"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Floating Badge */}
                <div className="absolute top-6 left-6 bg-green-800/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Full & Partial Support Available
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 sm:p-10 lg:p-12">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  
                  {/* Left Column - Description */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-800 mb-6 group-hover:text-green-700 transition-colors duration-300">
                      Your Gateway to Global Education
                    </h3>
                    
                    <div className="space-y-4 text-gray-600 text-base sm:text-lg leading-relaxed">
                      <p>
                        Explore an array of scholarships covering undergraduate and graduate studies across the world. These opportunities offer full & partial financial support and direct access to top universities.
                      </p>
                      <p>
                        Join a vibrant international community and gain access to world-class institutions that will shape your future and expand your global network.
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="mt-8 grid sm:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-gray-700 font-medium">Undergraduate Programs</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-gray-700 font-medium">Graduate Studies</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-gray-700 font-medium">Full Financial Support</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-gray-700 font-medium">Global Universities</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - CTA Section */}
                  <div className="text-center lg:text-left">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200">
                      <div className="text-6xl mb-4">🎓</div>
                      <h4 className="text-xl font-bold text-green-800 mb-4">
                        Ready to Transform Your Future?
                      </h4>
                      <p className="text-gray-600 mb-6">
                        Start your journey towards international education excellence today.
                      </p>
                      
                      {/* CTA Button */}
                      <Link
                        href="/scholarship"
                        className="group/btn inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-800 to-green-700 text-white text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 hover:from-green-700 hover:to-green-600 hover:shadow-xl hover:scale-[1.02]"
                      >
                        Explore Scholarships
                        <svg 
                          className="ml-3 w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                      
                      {/* Secondary Info */}
                      <p className="text-xs text-gray-500 mt-4">
                        Application deadlines vary by program
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 border-2 border-transparent rounded-3xl transition-all duration-300 pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Bottom Statistics Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-green-100">Available Scholarships</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-green-100">Partner Universities</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-green-100">Success Rate</div>
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