export default function PrivacyPage() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8 sm:p-12">
          <h1 className="font-display font-black text-3xl text-brand-black mb-2">Privacy Policy</h1>
          <p className="text-gray-500 text-sm mb-8">PowerOil MasterChef Nigeria Campaign · Last updated: {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long' })}</p>

          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
            <section>
              <h2 className="font-display font-black text-xl text-brand-black mb-3">1. Data Controller</h2>
              <p>PowerOil Nigeria is the data controller for personal information collected during the PowerOil MasterChef Nigeria campaign.</p>
            </section>

            <section>
              <h2 className="font-display font-black text-xl text-brand-black mb-3">2. Information We Collect</h2>
              <p className="mb-2"><strong>From Participants:</strong></p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li>Full name, phone number, email address</li>
                <li>State and city of residence</li>
                <li>Social media handle and post URL</li>
                <li>Dish name and caption</li>
                <li>Age confirmation and consent records</li>
              </ul>
              <p className="mb-2"><strong>From Voters:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Name, phone number, email address (optional)</li>
                <li>IP address and browser information</li>
                <li>Device fingerprint for fraud prevention</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-black text-xl text-brand-black mb-3">3. How We Use Your Data</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>To process your entry and manage the competition</li>
                <li>To contact you regarding your entry status</li>
                <li>To notify winners and arrange prize delivery</li>
                <li>To detect and prevent fraudulent voting</li>
                <li>For marketing purposes (with your consent)</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-black text-xl text-brand-black mb-3">4. Data Sharing</h2>
              <p>We do not sell your personal data. We may share data with:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Our service providers who help operate the campaign</li>
                <li>Regulatory authorities if required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-black text-xl text-brand-black mb-3">5. Public Data</h2>
              <p>Approved participant names, states, dish names, captions, and vote counts are displayed publicly on this website. Phone numbers and email addresses are never shown publicly.</p>
            </section>

            <section>
              <h2 className="font-display font-black text-xl text-brand-black mb-3">6. Data Retention</h2>
              <p>We retain campaign data for a period of 2 years after the campaign ends, after which it will be securely deleted.</p>
            </section>

            <section>
              <h2 className="font-display font-black text-xl text-brand-black mb-3">7. Your Rights</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data (subject to legal requirements)</li>
                <li>Opt out of marketing communications at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-black text-xl text-brand-black mb-3">8. Cookies</h2>
              <p>This website uses session cookies for security and functionality. No third-party advertising cookies are used.</p>
            </section>

            <section>
              <h2 className="font-display font-black text-xl text-brand-black mb-3">9. Contact</h2>
              <p>For privacy-related queries, contact us at <a href="mailto:privacy@poweroil.ng" className="text-brand-red underline">privacy@poweroil.ng</a>.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
