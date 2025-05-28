// app/legal/terms-of-use/page.tsx
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const TermsOfUsePage = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight 
                           bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] bg-clip-text text-transparent">
              Terms of Use
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] mx-auto rounded-full"></div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-sm text-gray-500 mb-8 italic">Last Updated: April 2025</p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                1. Acceptance of Terms
              </h2>
              <p className="mb-4 leading-relaxed">
                Welcome to BTAML Universe. By accessing or using our website, you agree to comply with and be bound by these Terms of Use. If you do not agree to these terms, please do not use our site.
              </p>
              <p className="mb-4 leading-relaxed">
                Please read these Terms carefully as they contain important information regarding your legal rights, remedies, and obligations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                2. Description of Services
              </h2>
              <p className="mb-4 leading-relaxed">
                BTAML Universe provides regional intelligence, business analysis, research services, and scholarship opportunities focused on African markets and global connections. Our website is an informational platform designed to provide insights, analysis, and resources relating to these services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                3. Content and Intellectual Property
              </h2>
              <p className="mb-4 leading-relaxed">
                All content on this website, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, and data compilations, is the property of BTAML Universe or its content suppliers and is protected by international copyright laws.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 text-[#1a6b0f]">3.1 Limited License</h3>
              <p className="mb-3 leading-relaxed">
                We grant you a limited, non-exclusive, non-transferable license to access and use our website for personal, non-commercial purposes. This license does not include:
              </p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>Republishing or redistributing any content from our website</li>
                <li>Selling, renting, or sub-licensing our materials</li>
                <li>Reproducing, duplicating, or copying our content</li>
                <li>Exploiting our content for commercial purposes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                4. User Conduct
              </h2>
              <p className="mb-3 leading-relaxed">When using our website, you agree not to:</p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Use our website to transmit harmful code or malware</li>
                <li>Interfere with or disrupt our website or servers</li>
                <li>Impersonate any person or entity</li>
                <li>Collect user information without proper consent</li>
                <li>Use our content for creating competing products or services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                5. Disclaimer of Warranties
              </h2>
              <p className="mb-4 leading-relaxed">
                Our website is provided on an &quot;as is&quot; and &quot;as available&quot; basis. BTAML Universe makes no representations or warranties of any kind, express or implied, as to the operation of our website or the information, content, materials, or products included.
              </p>
              <p className="mb-4 leading-relaxed">
                To the full extent permissible by applicable law, BTAML Universe disclaims all warranties, express or implied, including but not limited to, implied warranties of merchantability and fitness for a particular purpose.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                6. Limitation of Liability
              </h2>
              <p className="mb-4 leading-relaxed">
                BTAML Universe will not be liable for any damages of any kind arising from the use of our website, including but not limited to direct, indirect, incidental, punitive, and consequential damages.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                7. Third-Party Links
              </h2>
              <p className="mb-4 leading-relaxed">
                Our website may contain links to third-party websites that are not owned or controlled by BTAML Universe. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                8. Modifications to Terms
              </h2>
              <p className="mb-4 leading-relaxed">
                BTAML Universe reserves the right to modify or replace these Terms at any time. We will provide notice of significant changes by posting the new Terms on our website. Your continued use of our website after any changes constitutes acceptance of those changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                9. Governing Law
              </h2>
              <p className="mb-4 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                10. Contact Information
              </h2>
              <p className="mb-3 leading-relaxed">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-[#0F4007]">
                <p className="mb-2"><strong>Email:</strong> consultbtaml@gmail.com</p>
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

export default TermsOfUsePage