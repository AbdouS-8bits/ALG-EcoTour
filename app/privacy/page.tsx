import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ALG EcoTour',
  description: 'Privacy policy for ALG EcoTour',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="text-gray-600 mb-3">
              We collect information you provide directly to us, such as when you create an account, 
              book a tour, or contact us for support.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Name and contact information</li>
              <li>Payment information</li>
              <li>Travel preferences and requirements</li>
              <li>Communication history</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="text-gray-600 mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Process bookings and provide services</li>
              <li>Communicate with you about your tours</li>
              <li>Improve our services and website</li>
              <li>Send marketing communications (with consent)</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
            <p className="text-gray-600">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-gray-600">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
            <p className="text-gray-600">
              Our website uses cookies to enhance your experience. You can control cookie settings 
              through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-gray-600">
              You have the right to access, update, or delete your personal information. 
              Contact us to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">For privacy concerns, contact:</p>
              <p className="text-gray-600">Email: privacy@algecotour.com</p>
              <p className="text-gray-600">Phone: +213-XXX-XXX-XXX</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Policy Updates</h2>
            <p className="text-gray-600">
              We may update this privacy policy from time to time. Changes will be posted on 
              this page with an updated revision date.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
