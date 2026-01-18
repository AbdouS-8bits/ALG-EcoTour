import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accessibility | ALG EcoTour',
  description: 'Accessibility information for ALG EcoTour website',
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Accessibility</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Our Commitment to Accessibility</h2>
          <p className="text-gray-600 mb-6">
            ALG EcoTour is committed to ensuring digital accessibility for people with disabilities. 
            We are continually improving the user experience for everyone and applying the relevant 
            accessibility standards.
          </p>

          <h3 className="text-xl font-semibold mb-3">Accessibility Features</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
            <li>Alt text for all meaningful images</li>
            <li>Keyboard navigation support</li>
            <li>Screen reader compatibility</li>
            <li>High contrast color scheme</li>
            <li>Responsive design for all devices</li>
            <li>Semantic HTML structure</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Getting Help</h3>
          <p className="text-gray-600 mb-4">
            If you experience any difficulty accessing our website or have suggestions for improvement, 
            please contact us at:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium">Email: accessibility@algecotour.com</p>
            <p className="font-medium">Phone: +213-XXX-XXX-XXX</p>
          </div>
        </div>
      </div>
    </div>
  );
}
