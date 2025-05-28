// app/legal/privacy-policy/page.tsx
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const PrivacyPolicyPage = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight 
                           bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] bg-clip-text text-transparent">
              Privacy Policy
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
                BTAML Universe (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>
              <p className="mb-4 leading-relaxed">
                Please read this Privacy Policy carefully. By accessing or using our website, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                2. Information We Collect
              </h2>
              
              <h3 className="text-xl font-semibold mb-3 text-[#1a6b0f]">2.1 Information You Provide to Us</h3>
              <p className="mb-3 leading-relaxed">We may collect information that you voluntarily provide when you:</p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>Contact us through our website</li>
                <li>Subscribe to our newsletters or alerts</li>
                <li>Request information about our services</li>
              </ul>
              <p className="mb-4 leading-relaxed">
                This information may include your name, email address, phone number, and any other information you choose to provide.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#1a6b0f]">2.2 Automatically Collected Information</h3>
              <p className="mb-3 leading-relaxed">
                When you access our website, we may automatically collect certain information about your device and usage, including:
              </p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Device type and operating system</li>
                <li>Pages visited and time spent on those pages</li>
                <li>Referring website addresses</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                3. How We Use Your Information
              </h2>
              <p className="mb-3 leading-relaxed">We may use the information we collect for various purposes, including to:</p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>Provide, maintain, and improve our website</li>
                <li>Respond to your inquiries and fulfill your requests</li>
                <li>Send you information about our services that may be of interest to you</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Protect against unauthorized access and potential fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                4. Cookies and Similar Technologies
              </h2>
              <p className="mb-4 leading-relaxed">
                We may use cookies and similar tracking technologies to collect information about your browsing activities. These technologies help us understand how visitors interact with our website.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#1a6b0f]">4.1 Types of Cookies We Use</h3>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li><strong>Essential cookies:</strong> Required for basic website functionality</li>
                <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website</li>
                <li><strong>Preference cookies:</strong> Enable the website to remember your preferences</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#1a6b0f]">4.2 Managing Cookies</h3>
              <p className="mb-4 leading-relaxed">
                Most web browsers allow you to control cookies through their settings. However, if you disable certain cookies, you may not be able to access all of the features of our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                5. Sharing Your Information
              </h2>
              <p className="mb-3 leading-relaxed">We may share your information with third parties in the following circumstances:</p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>With service providers who perform services on our behalf</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights, privacy, safety, or property</li>
                <li>In connection with a business transaction, such as a merger or acquisition</li>
              </ul>
              <p className="mb-4 leading-relaxed">
                We do not sell or rent your personal information to third parties for their marketing purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                6. Data Security
              </h2>
              <p className="mb-4 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                7. International Data Transfers
              </h2>
              <p className="mb-4 leading-relaxed">
                Your information may be transferred to and processed in countries other than the one in which you reside. These countries may have data protection laws that differ from those in your country. By using our website, you consent to the transfer of your information to countries outside your country of residence.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                8. Your Rights
              </h2>
              <p className="mb-3 leading-relaxed">
                Depending on your location, you may have certain rights regarding your personal information, which may include:
              </p>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>The right to access your personal information</li>
                <li>The right to correct inaccurate information</li>
                <li>The right to delete your personal information</li>
                <li>The right to restrict processing of your personal information</li>
                <li>The right to data portability</li>
                <li>The right to object to processing of your personal information</li>
              </ul>
              <p className="mb-4 leading-relaxed">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                9. Children&apos;s Privacy
              </h2>
              <p className="mb-4 leading-relaxed">
                Our website is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we learn we have collected personal information from a child, we will take steps to delete that information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                10. Changes to This Privacy Policy
              </h2>
              <p className="mb-4 leading-relaxed">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                11. Contact Us
              </h2>
              <p className="mb-3 leading-relaxed">
                If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
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

export default PrivacyPolicyPage