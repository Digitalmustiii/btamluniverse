// app/legal/investment-disclaimers/page.tsx
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const InvestmentDisclaimersPage = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight 
                           bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] bg-clip-text text-transparent">
              Investment Disclaimers
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#0F4007] to-[#1a6b0f] mx-auto rounded-full"></div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-sm text-gray-500 mb-8 italic">Last Updated: April 2025</p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                1. General Investment Disclaimer
              </h2>
              <p className="mb-4 leading-relaxed">
                The information provided by BTAML Universe (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) on our website is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
              </p>
              <p className="mb-4 leading-relaxed">
                Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                2. Not Financial Advice
              </h2>
              <p className="mb-4 leading-relaxed">
                The content on our website is not intended to be investment advice. It is for informational purposes only and should not be used as a basis for making investment decisions. We are not registered investment advisors.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#1a6b0f]">2.1 No Recommendations</h3>
              <p className="mb-4 leading-relaxed">
                The information presented on our website should not be construed as recommendations for or against any investment strategy. Always consult with a qualified professional before making any investment decisions.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#1a6b0f]">2.2 Individual Considerations</h3>
              <p className="mb-4 leading-relaxed">
                All investment strategies and investments involve risk. The appropriateness of a particular investment or strategy will depend on an individual&apos;s circumstances and objectives. The information provided does not take into account the specific objectives, financial situation, or particular needs of any specific individual.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                3. Past Performance
              </h2>
              <p className="mb-4 leading-relaxed">
                Past performance is not indicative of future results. Any historical returns, expected returns, or probability projections may not reflect actual future performance.
              </p>
              <p className="mb-4 leading-relaxed">
                Any investment information contained on our website may not be suitable for all investors and investors should make their own investment decisions using their own independent advisors. No representations are being made that any investment will or is likely to achieve profits or losses similar to those shown.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                4. Risk Disclosure
              </h2>
              <p className="mb-4 leading-relaxed">
                Investing in financial instruments involves a high degree of risk and is not suitable for all investors. The value of investments can go down as well as up, and investors may get back less than they invested.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#1a6b0f]">4.1 Market Risk</h3>
              <p className="mb-4 leading-relaxed">
                Market risks include political, regulatory, economic, social, and health crises that can disrupt markets in unpredictable ways. We cannot guarantee protection against these risks.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#1a6b0f]">4.2 Technical Analysis</h3>
              <p className="mb-4 leading-relaxed">
                Any references to technical analysis, indicators, charts, or graphs are for informational purposes only and should not be relied upon when making investment decisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                5. Third-Party Content
              </h2>
              <p className="mb-4 leading-relaxed">
                Our website may contain references or links to third-party content, which we do not control or maintain. We are not responsible for the content of any third-party site or any link contained in a third-party site. The inclusion of any link does not imply endorsement, approval, or control by us of the site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                6. International Use
              </h2>
              <p className="mb-4 leading-relaxed">
                Our website is intended for use by residents of jurisdictions where such use would not be contrary to local laws or regulations. It is your responsibility to ensure that your use of our website complies with the laws of your jurisdiction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                7. Changes to This Disclaimer
              </h2>
              <p className="mb-4 leading-relaxed">
                We may update this Investment Disclaimer from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this Investment Disclaimer periodically to stay informed about how we are protecting our investors.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#0F4007] border-b-2 border-green-100 pb-2">
                8. Contact Us
              </h2>
              <p className="mb-3 leading-relaxed">
                If you have any questions or concerns about this Investment Disclaimer, please contact us at:
              </p>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-[#0F4007]">
                <p className="mb-2"><strong>Email:</strong> consultbtaml@gmail.com</p>
                <p><strong>Phone:</strong> +86(0)15810743803 | +86(0)13269127008</p>
              </div>
            </section>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Important Notice:</strong> This disclaimer is for informational purposes only and does not constitute legal or financial advice. Please consult with qualified professionals before making any investment decisions.
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

export default InvestmentDisclaimersPage