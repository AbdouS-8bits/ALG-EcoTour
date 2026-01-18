import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | ALG EcoTour',
  description: 'Frequently asked questions about ALG EcoTour services',
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-3">What is eco-tourism?</h2>
            <p className="text-gray-600">
              Eco-tourism is responsible travel to natural areas that conserves the environment, 
              sustains the well-being of the local people, and involves interpretation and education.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-3">What should I bring on a tour?</h2>
            <p className="text-gray-600">
              We recommend bringing comfortable walking shoes, sun protection, water bottle, 
              camera, and appropriate clothing for the weather conditions. Specific requirements 
              will be provided for each tour.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-3">How do I book a tour?</h2>
            <p className="text-gray-600">
              You can book tours through our website by selecting your desired tour and date, 
              or by contacting our customer service team directly.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-3">What is your cancellation policy?</h2>
            <p className="text-gray-600">
              Cancellations made 48 hours before the tour receive a full refund. 
              Cancellations within 48 hours may be subject to a cancellation fee.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Are tours suitable for children?</h2>
            <p className="text-gray-600">
              Many of our tours are family-friendly. Please check individual tour descriptions 
              for age recommendations and difficulty levels.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Do you offer private tours?</h2>
            <p className="text-gray-600">
              Yes, we offer private tours for groups and individuals. Please contact us for 
              custom tour arrangements and pricing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
