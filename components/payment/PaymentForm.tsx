'use client';
import { useState } from 'react';
import { CreditCard, Smartphone, Wallet, Check, AlertCircle } from 'lucide-react';
import { PaymentData } from '@/types/api';

interface PaymentFormProps {
  onPaymentComplete: (paymentData: PaymentData) => void;
  onCancel: () => void;
  bookingData: {
    tourId: number;
    tourTitle: string;
    participants: number;
    totalPrice: number;
  };
}

export default function PaymentForm({ onPaymentComplete, onCancel, bookingData }: PaymentFormProps) {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardHolderName: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: {
      street: '',
      city: '',
      country: 'Algeria',
      postalCode: '',
    },
    transactionId: '',
    amount: bookingData.totalPrice,
    currency: 'DZD',
    status: 'PENDING',
    timestamp: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Pay with Visa, Mastercard, or other cards',
    },
    {
      id: 'mobile',
      name: 'Mobile Payment',
      icon: Smartphone,
      description: 'Pay with mobile payment apps',
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      description: 'Pay with digital wallets',
    },
  ];

  const handleInputChange = (field: keyof PaymentData, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBillingAddressChange = (field: keyof PaymentData['billingAddress'], value: string) => {
    setPaymentData(prev => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        [field]: value,
      },
    }));
  };

  const validateForm = (): boolean => {
    if (!paymentData.cardHolderName.trim()) {
      setErrorMessage('Card holder name is required');
      return false;
    }

    if (paymentData.paymentMethod === 'card') {
      if (!paymentData.cardNumber.trim() || paymentData.cardNumber.length < 16) {
        setErrorMessage('Valid card number is required');
        return false;
      }

      if (!paymentData.expiryDate.trim()) {
        setErrorMessage('Expiry date is required');
        return false;
      }

      if (!paymentData.cvv.trim() || paymentData.cvv.length < 3) {
        setErrorMessage('Valid CVV is required');
        return false;
      }
    }

    if (!paymentData.billingAddress.street.trim()) {
      setErrorMessage('Billing address is required');
      return false;
    }

    if (!paymentData.billingAddress.city.trim()) {
      setErrorMessage('City is required');
      return false;
    }

    if (!paymentData.billingAddress.postalCode.trim()) {
      setErrorMessage('Postal code is required');
      return false;
    }

    return true;
  };

  const simulatePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate payment success (90% success rate for demo)
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        setPaymentStatus('success');
        
        // Simulate payment confirmation
        const mockPaymentConfirmation = {
          ...paymentData,
          transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'PAID' as const,
          timestamp: new Date().toISOString(),
        };

        // Wait a moment before completing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        onPaymentComplete(mockPaymentConfirmation);
      } else {
        setPaymentStatus('error');
        setErrorMessage('Payment failed. Please try again or use a different payment method.');
      }
    } catch {
      setPaymentStatus('error');
      setErrorMessage('An error occurred during payment processing. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    simulatePayment();
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  if (paymentStatus === 'success') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-6">
            Your payment of {bookingData.totalPrice.toLocaleString()} د.ج has been processed successfully.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Transaction ID:</strong> TXN_{Date.now()}_{Math.random().toString(36).substr(2, 9)}</p>
              <p><strong>Amount:</strong> {bookingData.totalPrice.toLocaleString()} د.ج</p>
              <p><strong>Method:</strong> {paymentMethods.find(m => m.id === paymentData.paymentMethod)?.name}</p>
              <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <button
            onClick={() => onPaymentComplete({
              ...paymentData,
              transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              status: 'PAID',
              timestamp: new Date().toISOString(),
            })}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Continue to Booking Confirmation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Payment</h2>
        <p className="text-gray-600">
          Secure payment for your {bookingData.participants} participant(s) on {bookingData.tourTitle}
        </p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Total Amount:</span>
            <span className="text-2xl font-bold text-blue-600">
              {bookingData.totalPrice.toLocaleString()} د.ج
            </span>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => {
                  setPaymentData(prev => ({ ...prev, paymentMethod: method.id as 'card' | 'mobile' | 'wallet' }));
                }}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  paymentData.paymentMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center mb-2">
                  <Icon className="w-6 h-6 mr-2 text-blue-600" />
                  <span className="font-medium text-gray-900">{method.name}</span>
                </div>
                <p className="text-sm text-gray-600">{method.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Holder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Holder Name *
          </label>
          <input
            type="text"
            value={paymentData.cardHolderName}
            onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
            required
          />
        </div>

        {/* Card Details (only for card payment) */}
        {paymentData.paymentMethod === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number *
              </label>
              <input
                type="text"
                value={formatCardNumber(paymentData.cardNumber)}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date *
              </label>
              <input
                type="text"
                value={formatExpiryDate(paymentData.expiryDate)}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MM/YY"
                maxLength={5}
                required
              />
            </div>
          </div>
        )}

        {paymentData.paymentMethod === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV *
              </label>
              <input
                type="text"
                value={paymentData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123"
                maxLength={4}
                required
              />
            </div>
          </div>
        )}

        {/* Billing Address */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                value={paymentData.billingAddress.street}
                onChange={(e) => handleBillingAddressChange('street', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123 Main Street"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={paymentData.billingAddress.city}
                onChange={(e) => handleBillingAddressChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Algiers"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <input
                type="text"
                value={paymentData.billingAddress.country}
                onChange={(e) => handleBillingAddressChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Algeria"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code *
              </label>
              <input
                type="text"
                value={paymentData.billingAddress.postalCode}
                onChange={(e) => handleBillingAddressChange('postalCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="16000"
                required
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-700">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Processing Indicator */}
        {paymentStatus === 'processing' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-700">Processing payment...</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isProcessing || paymentStatus === 'processing'}
          >
            {isProcessing || paymentStatus === 'processing' ? 'Processing...' : `Pay ${bookingData.totalPrice.toLocaleString()} د.ج`}
          </button>
        </div>
      </form>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-gray-600 mr-2 mt-0.5" />
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">🔒 Secure Mock Payment</p>
            <p>This is a mock payment system for demonstration purposes. No real payment processing occurs. Your payment information is not stored or transmitted to any payment processor.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
