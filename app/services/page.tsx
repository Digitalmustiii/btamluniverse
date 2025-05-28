// app/services/page.tsx
import Header from '../components/Header'
import Footer from '../components/Footer'

const ServicesPage = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight 
                           bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] bg-clip-text text-transparent">
              Our Services
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Welcome to BTAML Universe – Your Strategic Gateway to African Insight and Global Opportunities
            </p>
            <p className="text-lg text-gray-500 max-w-4xl mx-auto mt-4 leading-relaxed">
              We provide a wide range of services that empower individuals, organizations, and governments with data-driven insights, strategic tools, and regional intelligence. Whether you&apos;re an investor exploring emerging industries in Africa, a student seeking global scholarship opportunities, or a business leader looking to enter new markets – <em>we&apos;ve got you covered</em>.
            </p>
          </div>

          <div className="grid gap-8 lg:gap-12">
            {/* Strategic Business Analysis */}
            <section className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border border-green-100 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🔍</div>
                <h2 className="text-3xl font-bold text-[#0F4007]">Strategic Business Analysis</h2>
              </div>
              <div className="grid md:grid-cols-1 gap-6">
                <div className="space-y-4">
                  <div className="border-l-4 border-[#0F4007] pl-4">
                    <h3 className="text-xl font-semibold text-[#1a6b0f] mb-2">SWOT Analysis</h3>
                    <p className="text-gray-700">Evaluate internal <em>Strengths</em> and <em>Weaknesses</em> alongside external <em>Opportunities</em> and <em>Threats</em> for clearer strategy and growth.</p>
                  </div>
                  <div className="border-l-4 border-[#0F4007] pl-4">
                    <h3 className="text-xl font-semibold text-[#1a6b0f] mb-2">MOST Analysis</h3>
                    <p className="text-gray-700">Align your <em>Mission, Objectives, Strategies, and Tactics</em> with actionable goals for business transformation and policy success.</p>
                  </div>
                  <div className="border-l-4 border-[#0F4007] pl-4">
                    <h3 className="text-xl font-semibold text-[#1a6b0f] mb-2">PESTLE Analysis</h3>
                    <p className="text-gray-700">Understand the <em>Political, Economic, Social, Technological, Legal, and Environmental</em> factors influencing your operations across Africa.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Creative & Operational Thinking */}
            <section className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">💡</div>
                <h2 className="text-3xl font-bold text-[#0F4007]">Creative & Operational Thinking</h2>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-400 pl-4">
                  <h3 className="text-xl font-semibold text-[#1a6b0f] mb-2">Brainstorming Sessions</h3>
                  <p className="text-gray-700">Collaborate with our experts to generate ideas for products, solutions, strategies, and social programs.</p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <h3 className="text-xl font-semibold text-[#1a6b0f] mb-2">Mind Mapping</h3>
                  <p className="text-gray-700">Visualize thoughts, plan projects, and discover connections using structured, easy-to-understand diagrams.</p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <h3 className="text-xl font-semibold text-[#1a6b0f] mb-2">Process Design</h3>
                  <p className="text-gray-700">Improve or redesign your business and operational workflows to enhance productivity and sustainability.</p>
                </div>
              </div>
            </section>

            {/* Research & Data Collection */}
            <section className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 border border-purple-100 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🧪</div>
                <h2 className="text-3xl font-bold text-[#0F4007]">Research & Data Collection</h2>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-purple-400 pl-4">
                  <h3 className="text-xl font-semibold text-[#1a6b0f] mb-2">Field Research & Surveys</h3>
                  <p className="text-gray-700">Conduct in-depth research across <em>West, East, Central, North, and Southern Africa</em>, gathering grassroots-level data.</p>
                </div>
                <div className="border-l-4 border-purple-400 pl-4">
                  <h3 className="text-xl font-semibold text-[#1a6b0f] mb-2">Voice Recording in African Languages</h3>
                  <p className="text-gray-700">We produce professional recordings in languages like <em>Yoruba, Hausa, Swahili, Zulu, Amharic</em>, and more.</p>
                </div>
                <div className="border-l-4 border-purple-400 pl-4">
                  <h3 className="text-xl font-semibold text-[#1a6b0f] mb-2">Sentiment & Opinion Polls</h3>
                  <p className="text-gray-700">Collect community and market insights through customized polling and feedback tools.</p>
                </div>
              </div>
            </section>

            {/* Regional Intelligence & Industry Monitoring */}
            <section className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-8 border border-orange-100 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🌍</div>
                <h2 className="text-3xl font-bold text-[#0F4007]">Regional Intelligence & Industry Monitoring</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border-l-4 border-orange-400 pl-4">
                    <h3 className="text-xl font-semibold text-[#1a6b0f] mb-2">Regional News Coverage</h3>
                    <p className="text-gray-700">Receive news and updates across all five African regions, with emphasis on socio-political trends and economic developments.</p>
                  </div>
                  <div className="border-l-4 border-orange-400 pl-4">
                    <h3 className="text-xl font-semibold text-[#1a6b0f] mb-2">Business & Sectoral Insights</h3>
                    <p className="text-gray-700 mb-3">We provide deep-dive analysis in:</p>
                    <ul className="text-gray-600 space-y-1 ml-4">
                      <li>• Agriculture & Agribusiness</li>
                      <li>• Mining & Energy</li>
                      <li>• Technology & Fintech</li>
                      <li>• Infrastructure & Logistics</li>
                      <li>• Sustainable Business Practices</li>
                      <li>• Emerging Industries</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border-l-4 border-orange-400 pl-4">
                    <h3 className="text-xl font-semibold text-[#1a6b0f] mb-2">Market Entry Strategies</h3>
                    <p className="text-gray-700">Navigate regulatory environments, cultural nuances, and industry trends with strategic roadmaps designed for success.</p>
                  </div>
                  <div className="border-l-4 border-orange-400 pl-4">
                    <h3 className="text-xl font-semibold text-[#1a6b0f] mb-2">Risk Management Consulting</h3>
                    <p className="text-gray-700">Evaluate and manage operational, political, and financial risks across the continent.</p>
                  </div>
                  <div className="border-l-4 border-orange-400 pl-4">
                    <h3 className="text-xl font-semibold text-[#1a6b0f] mb-2">Market Trends & Analysis</h3>
                    <p className="text-gray-700">We monitor fast-moving market dynamics to help you anticipate shifts and make informed decisions.</p>
                  </div>
                  <div className="border-l-4 border-orange-400 pl-4">
                    <h3 className="text-xl font-semibold text-[#1a6b0f] mb-2">Case Studies</h3>
                    <p className="text-gray-700">Learn from the success and setbacks of businesses and innovations across Africa.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Scholarship & Opportunity Alerts */}
            <section className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-8 border border-indigo-100 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🎓</div>
                <h2 className="text-3xl font-bold text-[#0F4007]">Scholarship & Opportunity Alerts</h2>
              </div>
              <p className="text-gray-700 mb-4">We bring you:</p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-indigo-200">
                  <p className="text-gray-700">Fully-funded scholarship opportunities worldwide</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-indigo-200">
                  <p className="text-gray-700">Global academic programs and fellowships for Africans</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-indigo-200">
                  <p className="text-gray-700">Alerts on deadlines, eligibility, and application strategies</p>
                </div>
              </div>
            </section>

            {/* Security & Intelligence Updates */}
            <section className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 border border-red-100 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🔐</div>
                <h2 className="text-3xl font-bold text-[#0F4007]">Security & Intelligence Updates</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border-l-4 border-red-400 pl-4">
                  <p className="text-gray-700">Peace and conflict zone updates</p>
                </div>
                <div className="border-l-4 border-red-400 pl-4">
                  <p className="text-gray-700">Cybersecurity news and digital risk trends</p>
                </div>
                <div className="border-l-4 border-red-400 pl-4">
                  <p className="text-gray-700">Regional safety alerts, travel advisories, and crisis monitoring</p>
                </div>
              </div>
            </section>

            {/* Customized Research & Consulting */}
            <section className="bg-gradient-to-br from-teal-50 to-white rounded-2xl p-8 border border-teal-100 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">📊</div>
                <h2 className="text-3xl font-bold text-[#0F4007]">Customized Research & Consulting</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border-l-4 border-teal-400 pl-4">
                  <h3 className="text-lg font-semibold text-[#1a6b0f] mb-2">Bespoke Research Reports</h3>
                  <p className="text-gray-700">By region or industry</p>
                </div>
                <div className="border-l-4 border-teal-400 pl-4">
                  <h3 className="text-lg font-semibold text-[#1a6b0f] mb-2">Investment Studies</h3>
                  <p className="text-gray-700">Feasibility studies and white papers</p>
                </div>
                <div className="border-l-4 border-teal-400 pl-4">
                  <h3 className="text-lg font-semibold text-[#1a6b0f] mb-2">Consulting & Workshops</h3>
                  <p className="text-gray-700">One-on-one consulting and capacity-building</p>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] text-white rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">📞</div>
              <h2 className="text-3xl font-bold mb-6">Let&apos;s Connect</h2>
              <p className="text-xl mb-6 opacity-90">
                Want to collaborate or learn more about how we can support your goals?
              </p>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 max-w-md mx-auto">
                <p className="mb-3"><strong>Email:</strong> consultbtaml@gmail.com</p>
                <p><strong>Phone:</strong> +86(0)15810743803 | +86(0)13269127008</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ServicesPage