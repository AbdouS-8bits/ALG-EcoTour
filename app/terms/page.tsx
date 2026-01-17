import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | ALG EcoTour',
  description: 'Terms of service for ALG EcoTour',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing and using ALG EcoTour services, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Services Description</h2>
            <p className="text-gray-600">
              ALG EcoTour provides eco-tourism services including guided tours, accommodations, 
              and related travel services in Algeria.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Booking and Payment</h2>
            <p className="text-gray-600 mb-3">
              All bookings must be confirmed with full payment or deposit. We accept various 
              payment methods as specified on our website.
            </p>
            <p className="text-gray-600">
              Prices are subject to change without prior notice. Confirmed bookings are guaranteed 
              at the agreed price.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Cancellation Policy</h2>
            <p className="text-gray-600 mb-3">
              <strong>48 hours or more before tour:</strong> Full refund<br/>
              <strong>24-48 hours before tour:</strong> 50% refund<br/>
              <strong>Less than 24 hours:</strong> No refund
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Liability</h2>
            <p className="text-gray-600">
              ALG EcoTour is not responsible for personal injury, loss, or damage to personal 
              property during tours. Participants are responsible for their own travel insurance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Environmental Responsibility</h2>
            <p className="text-gray-600">
              All participants must respect local environments and communities. Littering, 
              disturbing wildlife, or damaging natural resources is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">ALG EcoTour</p>
              <p className="text-gray-600">Email: info@algecotour.com</p>
              <p className="text-gray-600">Phone: +213-XXX-XXX-XXX</p>
              <p className="text-gray-600">Address: Algeria, North Africa</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
