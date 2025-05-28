// app/legal/regulatory-compliance/page.tsx
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const RegulatoryCompliancePage = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight 
                           bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] bg-clip-text text-transparent">
              Regulatory Compliance
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] mx-auto rounded-full"></div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-sm text-gray-500 mb-8 italic">Last Updated: April 2025</p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                1. Introduction
              </h2>
              <p className="mb-4 leading-relaxed">
                BTAML Universe (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to conducting business in accordance with all applicable laws, rules, and regulations. This Regulatory Compliance page outlines our approach to compliance with various regulatory frameworks that may apply to our operations.
              </p>
              <p className="mb-4 leading-relaxed">
                Please note that this page is for general informational purposes only and does not constitute legal advice. Regulatory requirements may vary by jurisdiction and change over time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                2. Financial Services Regulations
              </h2>
              <p className="mb-4 leading-relaxed">
                As a provider of information related to investments and financial markets, we adhere to applicable financial services regulations. However, we do not provide regulated financial services, investment advice, or act as an investment advisor unless explicitly stated and properly licensed to do so.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#1a6b0f]">2.1 Non-Regulated Activities</h3>
              <p className="mb-4 leading-relaxed">
                Our primary activities include providing general information, educational content, and analytical tools. These activities are typically not subject to financial services regulations, but we nevertheless strive to maintain high standards of accuracy and transparency.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#1a6b0f]">2.2 Regulated Activities</h3>
              <p className="mb-4 leading-relaxed">
                In instances where we engage in activities that may be subject to financial services regulations, we obtain the necessary licenses and approvals from relevant regulatory authorities. Details of any such licenses will be prominently displayed on our website and in our communications.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                3. Anti-Money Laundering (AML) Compliance
              </h2>
              <p className="mb-4 leading-relaxed">
                We are committed to preventing money laundering and the funding of terrorist or criminal activities. We implement appropriate AML procedures when required, which may include:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Customer due diligence and Know Your Customer (KYC) procedures</li>
                <li>Transaction monitoring for suspicious activities</li>
                <li>Record-keeping of relevant transactions and customer information</li>
                <li>Reporting suspicious activities to relevant authorities</li>
                <li>Regular training for our staff on AML procedures</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                4. Data Protection and Privacy
              </h2>
              <p className="mb-4 leading-relaxed">
                We comply with applicable data protection and privacy laws, including:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Obtaining appropriate consent for collecting, using, and sharing personal data</li>
                <li>Implementing technical and organizational measures to protect personal data</li>
                <li>Providing individuals with access to their personal data and the ability to correct or delete it</li>
                <li>Honoring individuals&apos; data protection rights</li>
                <li>Notifying individuals and authorities of data breaches when required</li>
              </ul>
              <p className="mb-4 leading-relaxed">
                For more information on how we handle personal data, please refer to our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                5. Consumer Protection
              </h2>
              <p className="mb-4 leading-relaxed">
                We are committed to protecting consumers by:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Providing clear, accurate, and transparent information about our services</li>
                <li>Ensuring fair treatment of all customers</li>
                <li>Maintaining a robust complaint handling process</li>
                <li>Avoiding unfair, deceptive, or abusive practices</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                6. International Compliance
              </h2>
              <p className="mb-4 leading-relaxed">
                We recognize that our website may be accessed by individuals from various jurisdictions. While we make efforts to comply with applicable laws and regulations, it is the responsibility of users to ensure that their use of our website and services complies with the laws and regulations of their own jurisdiction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                7. Regulatory Updates
              </h2>
              <p className="mb-4 leading-relaxed">
                Regulatory requirements are subject to change. We monitor relevant legal and regulatory developments and update our policies and procedures as necessary to maintain compliance.
              </p>
              <p className="mb-4 leading-relaxed">
                We encourage users to check this page periodically for updates. Significant changes to our regulatory compliance practices will be communicated through our website and, where appropriate, directly to registered users.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                8. Reporting Concerns
              </h2>
              <p className="mb-3 leading-relaxed">
                If you have concerns regarding our compliance with applicable laws and regulations, or if you believe our content or services may violate regulatory requirements, please contact us using the information provided below.
              </p>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-[#0F4007]">
                <p className="mb-2"><strong>Email:</strong> consultbtaml@gmail.com</p>
                <p><strong>Phone:</strong> +86(0)15810743803 | +86(0)13269127008</p>
              </div>
            </section>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    <strong>Compliance Notice:</strong> We are committed to maintaining the highest standards of regulatory compliance. Our policies and procedures are regularly reviewed and updated to reflect changing regulatory requirements and industry best practices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default RegulatoryCompliancePage