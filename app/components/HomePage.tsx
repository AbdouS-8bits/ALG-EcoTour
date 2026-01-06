'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Leaf, Users, Shield, Award } from 'lucide-react';
import TourCard from './TourCard';
import { useEffect, useState } from 'react';

interface Tour {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  maxParticipants: number;
  photoURL: string;
  createdAt: string;
  updatedAt: string;
  latitude?: number;
  longitude?: number;
}

export default function HomePage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

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
        setLoading(false); // مهم جداً!
      }
    }

    fetchTours();
  }, []);

  const features = [
    {
      icon: Leaf,
      title: 'صديق للبيئة',
      description: 'رحلات تحافظ على البيئة وتدعم التنمية المستدامة'
    },
    {
      icon: Users,
      title: 'مرشدون محليون',
      description: 'مرشدون محليون خبراء يعرفون المنطقة جيداً'
    },
    {
      icon: Shield,
      title: 'رحلات آمنة',
      description: 'نضمن سلامتك وراحتك طوال الرحلة'
    },
    {
      icon: Award,
      title: 'تجربة أصيلة',
      description: 'تعرف على الثقافة الجزائرية الأصيلة والتقاليد'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            اكتشف جمال الجزائر البري
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 text-green-50"
          >
            رحلات سياحية بيئية إلى الصحراء والجبال والواحات
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/EcoTour"
              className="px-8 py-4 bg-white text-green-600 rounded-full font-semibold text-lg hover:bg-green-50 transition-colors"
            >
              استكشف الرحلات
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors"
            >
              تعرف علينا
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Tours Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">رحلاتنا المميزة</h2>
            <p className="text-xl text-slate-600">اختر من بين أفضل رحلاتنا البيئية</p>
          </motion.div>

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
                tours.map((tour, index) => (
                  <TourCard key={tour.id} tour={{
                    ...tour,
                    duration: 3, // Default duration
                    currentParticipants: 8, // Default current participants
                  }} index={index} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-xl text-slate-600 mb-4">لا توجد رحلات متاحة حالياً</p>
                  <p className="text-slate-500">يرجى التحقق لاحقاً أو التواصل معنا للمزيد من المعلومات</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">لماذا ALG EcoTour؟</h2>
            <p className="text-xl text-slate-600">نقدم لك أفضل تجربة سياحية بيئية</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-green-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">جاهز لمغامرتك القادمة؟</h2>
            <p className="text-xl text-green-50 mb-8">
              انضم إلينا واستكشف جمال الجزائر بطريقة مسؤولة ومستدامة
            </p>
            <Link
              href="/EcoTour"
              className="inline-block px-8 py-4 bg-white text-green-600 rounded-full font-semibold text-lg hover:bg-green-50 transition-colors"
            >
              احجز رحلتك الآن
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
