'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Users, Star, ArrowRight, CheckCircle, Shield, Award, DollarSign, Mail, Compass } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import OptimizedImage, { ImageSizes } from '@/components/common/OptimizedImage';
import TourCard from '@/components/tours/TourCard';

interface Tour {
  id: number;
  title: string;
  description: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  price: number;
  maxParticipants: number;
  photoURL: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function HomePage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchTours() {
      try {
        const response = await fetch('/api/tours?limit=6');
        if (response.ok) {
          const toursData = await response.json();
          setTours(toursData);
        } else {
          setTours([]);
        }
      } catch (error) {
        console.error('Error fetching tours:', error);
        setTours([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTours();
  }, []);

  const features = [
    {
      icon: Compass,
      title: 'تجارب أصيلة',
      description: 'نقدم تجارب سياحية حقيقية تعكس ثقافة الجزائر وثراءها الطبيعي',
    },
    {
      icon: DollarSign,
      title: 'أسعار تنافسية',
      description: 'أفضل الأسعار في السوق مع ضمان الجودة والخدمة المميزة',
    },
    {
      icon: Users,
      title: 'فريق محترف',
      description: 'مرشدون سياحيون محترفون متخصصون في السياحة البيئية',
    },
  ];

  const destinations = [
    {
      id: 1,
      name: 'الصحراء الكبرى',
      image: '/images/destinations/sahara.jpg',
      tours: 12,
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 2,
      name: 'تاسيلي نجر',
      image: '/images/destinations/tassili.jpg',
      tours: 8,
      color: 'from-red-500 to-pink-600'
    },
    {
      id: 3,
      name: 'الأهقار',
      image: '/images/destinations/hoggar.jpg',
      tours: 6,
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 4,
      name: 'القبائل',
      image: '/images/destinations/kabylie.jpg',
      tours: 10,
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 5,
      name: 'الساحل',
      image: '/images/destinations/coast.jpg',
      tours: 15,
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 6,
      name: 'الواحات',
      image: '/images/destinations/oasis.jpg',
      tours: 7,
      color: 'from-lime-500 to-green-600'
    },
  ];

  const testimonials = [
    {
      name: 'محمد بن علي',
      rating: 5,
      comment: 'تجربة لا تُنسى! المنظمة احترافية والمرشدون ممتازون. أوصي بهم بشدة.',
      avatar: '/images/avatar1.jpg',
    },
    {
      name: 'سارة قاسم',
      rating: 5,
      comment: 'رحلة رائعة إلى الصحراء. كل شيء كان منظماً بشكل مثالي والخدمة كانت ممتازة.',
      avatar: '/images/avatar2.jpg',
    },
    {
      name: 'أحمد طالب',
      rating: 4,
      comment: 'تجربة سياحية رائعة مع تركيز على الاستدامة. سأعود بالتأكيد.',
      avatar: '/images/avatar3.jpg',
    },
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterLoading(true);
    setMessage('');
    
    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('شكراً لاشتراكك! سنرسل لك أحدث العروض.');
      setEmail('');
    } catch (error) {
      setMessage('حدث خطأ. حاول مرة أخرى.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 to-teal-600 text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              اكتشف جمال الجزائر
            </h1>
            <p className="text-xl md:text-2xl text-green-50 max-w-3xl mx-auto mb-8 leading-relaxed">
              رحلات سياحية بيئية مستدامة مع فريق من الخبراء المتخصصين
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/ecoTour" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 hover:scale-105 shadow-xl text-lg"
              >
                استكشف الرحلات
                <Compass className="w-5 h-5" />
              </Link>
              <Link 
                href="/map" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 hover:scale-105 shadow-xl text-lg"
              >
                عرض الخريطة
                <MapPin className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              رحلاتنا المميزة
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              اكتشف أفضل الرحلات السياحية البيئية في الجزائر
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg animate-pulse">
                  <div className="h-48 bg-gray-300 rounded-t-xl"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.length > 0 ? (
                tours.map((tour) => (
                  <div key={tour.id}>
                    <TourCard 
                      tour={tour}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-xl text-gray-600 mb-4">لا توجد رحلات متاحة حالياً</p>
                  <p className="text-gray-500">يرجى التحقق لاحقاً أو التواصل معنا للمزيد من المعلومات</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">لماذا تختار ALG EcoTour؟</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              نقدم لك أفضل تجربة سياحية بيئية في الجزائر
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="text-center p-8 rounded-2xl hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-50 to-white border border-gray-100"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">وجهات شعبية</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              اكتشف أجمل الوجهات السياحية في الجزائر
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <Link
                key={dest.id}
                href={`/ecoTour?location=${dest.name}`}
                className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${dest.color} opacity-90`} />
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{dest.name}</h3>
                  <p className="text-white/90 mb-4">{dest.tours} رحلات متاحة</p>
                  <div className="flex items-center text-sm">
                    <span>استكشف الآن</span>
                    <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">آراء عملائنا</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ماذا يقول عملاؤنا عن تجاربهم معنا
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed italic">&ldquo;{testimonial.comment}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-green-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">اشترك في نشرتنا الإخبارية</h2>
              <p className="text-gray-600 mb-8 text-lg">
                احصل على آخر العروض والوجهات السياحية الجديدة
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                />
                <button
                  type="submit"
                  disabled={newsletterLoading}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {newsletterLoading ? 'جاري الإرسال...' : 'اشتراك'}
                </button>
              </form>
              {message && (
                <p className={`mt-4 text-sm ${message.includes('شكراً') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
