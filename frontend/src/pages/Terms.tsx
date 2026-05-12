export default function TermsPage() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8 sm:p-12">
          <h1 className="font-display font-black text-3xl text-brand-black mb-2">Terms & Conditions</h1>
          <p className="text-gray-500 text-sm mb-8">PowerOil MasterChef Nigeria Campaign · Last updated: {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long' })}</p>

          <div className="prose prose-gray max-w-none space-y-6 text-sm text-gray-700 leading-relaxed">
            <section>
              <h2 className="font-display font-black text-xl text-brand-black mb-3">1. Campaign Overview</h2>
              <p>The PowerOil MasterChef Nigeria ("the Campaign") is a User-Generated Content (UGC) competition organised by PowerOil Nigeria ("the Organiser"). Participants are invited to submit cooking videos featuring PowerOil for public voting. By entering, you agree to these Terms & Conditions.</p>
            </section>

            <section>
              <h2 className="font-display font-black text-xl text-brand-black mb-3">2. Eligibility</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Open to Nigerian residents aged 18 years and above.</li>
                <li>Employees, contractors, and immediate family members of PowerOil and its agencies are not eligible.</li>
                <li>Only one entry per person is permitted.</li>
                <li>Participants must have an active, public social media account.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-black text-xl text-brand-black mb-3">3. How to Enter</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Cook a Nigerian dish using PowerOil and record a video.</li>
                <li>Upload the video to a public social media account (Instagram, TikTok, Facebook, YouTube, or X).</li>
                <li>Register on this microsite and submit the URL of your post.</li>
                <li>Wait for your entry to be reviewed and approved.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-black text-xl text-brand-black mb-3">4. Content Requirements</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Videos must clearly show the use of PowerOil during cooking.</li>
                <li>Content must be original, created by the participant.</li>
                <li>No offensive, inappropriate, or plagiarised content will be accepted.</li>
                <li>Entries that do not meet quality standards may be rejected at the Organiser's discretion.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-black text-xl text-brand-black mb-3">5. Voting</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>One vote per phone number per participant is permitted.</li>
                <li>Votes may be verified by phone number and device fingerprint.</li>
                <li>Purchased, automated, or incentivised votes are strictly prohibited.</li>
                <li>Any participant found to be encouraging fraudulent voting will be disqualified.</li>
                <li>The Organiser reserves the right to disqualify suspicious votes.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-black text-xl text-brand-black mb-3">6. Prizes</h2>
              <p>Prizes will be announced by the Organiser on their official social media channels. Prizes are non-transferable and cannot be exchanged for cash. Winners must be reachable and accept their prize within 14 days of notification.</p>
            </section>

            <section>
              <h2 className="font-display font-black text-xl text-brand-black mb-3">7. Intellectual Property</h2>
              <p>By submitting your video, you grant PowerOil Nigeria a non-exclusive, royalty-free, worldwide licence to use, reproduce, distribute, and display your content for marketing and promotional purposes. You confirm that the video is your original work and does not infringe on any third-party rights.</p>
            </section>

            <section>
              <h2 className="font-display font-black text-xl text-brand-black mb-3">8. Disqualification</h2>
              <p>The Organiser reserves the right to disqualify entries or voters that violate these terms, submit fraudulent votes, submit inappropriate content, or misuse the platform in any way.</p>
            </section>

            <section>
              <h2 className="font-display font-black text-xl text-brand-black mb-3">9. Governing Law</h2>
              <p>These Terms & Conditions are governed by and construed in accordance with the laws of the Federal Republic of Nigeria.</p>
            </section>

            <section>
              <h2 className="font-display font-black text-xl text-brand-black mb-3">10. Contact</h2>
              <p>For queries about the Campaign, please contact us at <a href="mailto:campaign@poweroil.ng" className="text-brand-red underline">campaign@poweroil.ng</a>.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
