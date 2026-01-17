'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Phone, Leaf } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const isSubmitting = useRef(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double-submit using both state and ref
    if (loading || isSubmitting.current) {
      e.stopPropagation();
      return;
    }
    
    isSubmitting.current = true;
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      isSubmitting.current = false;
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        setError(data.error || 'حدث خطأ ما. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      setError('حدث خطأ ما. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
      isSubmitting.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إنشاء حساب جديد</h1>
          <p className="text-gray-600">انضم إلينا وابدأ مغامرتك</p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الكامل
              </label>
              <div className="relative">
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="
                    w-full pr-10 pl-4 py-3
                    text-gray-900
                    bg-white
                    border-2 border-gray-300
                    rounded-lg
                    placeholder-gray-500
                    focus:ring-2 focus:ring-green-500
                    focus:border-green-500
                    transition-all
                  "
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="
                    w-full pr-10 pl-4 py-3
                    text-gray-900
                    bg-white
                    border-2 border-gray-300
                    rounded-lg
                    placeholder-gray-500
                    focus:ring-2 focus:ring-green-500
                    focus:border-green-500
                    transition-all
                  "
                  placeholder="example@email.com"
                />
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                رقم الهاتف (اختياري)
              </label>
              <div className="relative">
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="
                    w-full pr-10 pl-4 py-3
                    text-gray-900
                    bg-white
                    border-2 border-gray-300
                    rounded-lg
                    placeholder-gray-500
                    focus:ring-2 focus:ring-green-500
                    focus:border-green-500
                    transition-all
                  "
                  placeholder="+213 XXX XXX XXX"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="
                    w-full pr-20 pl-4 py-3
                    text-gray-900
                    bg-white
                    border-2 border-gray-300
                    rounded-lg
                    placeholder-gray-500
                    focus:ring-2 focus:ring-green-500
                    focus:border-green-500
                    transition-all
                  "
                  placeholder="•••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="
                    w-full pr-20 pl-4 py-3
                    text-gray-900
                    bg-white
                    border-2 border-gray-300
                    rounded-lg
                    placeholder-gray-500
                    focus:ring-2 focus:ring-green-500
                    focus:border-green-500
                    transition-all
                  "
                  placeholder="•••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3
                bg-gradient-to-r from-green-600 to-teal-600
                text-white font-semibold
                rounded-lg
                hover:scale-105 transition-transform
                shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:scale-100
              "
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                  جاري إنشاء الحساب...
                </div>
              ) : (
                'إنشاء حساب'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              لديك حساب بالفعل؟{' '}
              <Link 
                href="/auth/login" 
                className="text-green-600 hover:text-green-700 font-semibold transition-colors"
              >
                سجل دخولك
              </Link>
            </p>
            <p className="text-xs text-gray-500">
              بإنشاء حساب، أنت توافق على{' '}
              <Link href="/terms" className="text-green-600 hover:text-green-700">
                الشروط والأحكام
              </Link>
              {' '}و{' '}
              <Link href="/privacy" className="text-green-600 hover:text-green-700">
                سياسة الخصوصية
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="mr-2 text-sm">آمن</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="mr-2 text-sm">سريع</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="mr-2 text-sm">موثوق</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
