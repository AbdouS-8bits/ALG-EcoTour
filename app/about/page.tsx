'use client';

import React from 'react';
import { Eye, Target, Leaf, Building, Users, Star, Handshake, Award, TrendingUp } from 'lucide-react';

export default function AboutPage() {
 return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 to-teal-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              من نحن - ALG EcoTour
            </h1>
            <p className="text-xl md:text-2xl text-green-50 max-w-3xl mx-auto leading-relaxed">
              رحلتنا لاكتشاف جمال الجزائر البري مع تجارب سياحية مستدامة وأصيلة
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">رؤيتنا</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                أن نكون المنصة الرائدة للسياحة البيئية في الجزائر، حيث نربط بين المغامرة والاستدامة، 
                ونقدم تجارب فريدة تحافظ على بيئتنا وتدعم مجتمعاتنا المحلية.
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-green-100 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">رسالتنا</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                توفير تجارب سياحية مسؤولة وأصيلة تعكس ثقافة الجزائر وثراءها الطبيعي، 
                مع ضمان أعلى معايير الجودة والأمان لضمان رحلات لا تُنسى.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">قيمنا الأساسية</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              المبادئ التي توجه كل ما نفعله ونلتزم بها
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sustainability */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-green-100">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">الاستدامة البيئية 🌱</h3>
              <p className="text-gray-600 leading-relaxed">
                نلتزم بحماية البيئة الطبيعية وتقليل البصمة الكربونية لرحلاتنا
              </p>
            </div>

            {/* Cultural Authenticity */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-blue-100">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Building className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">الأصالة الثقافية 🏛️</h3>
              <p className="text-gray-600 leading-relaxed">
                نقدم تجارب ثقافية أصيلة تعكس تراث الجزائر الغني وتاريخها العريق
              </p>
            </div>

            {/* Safety & Reliability */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-purple-100">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">الأمان والموثوقية ✅</h3>
              <p className="text-gray-600 leading-relaxed">
                سلامتك أولويتنا، مع فرق محترفة ومعدات حديثة وخطط طوارئ متكاملة
              </p>
            </div>

            {/* Unique Experience */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-yellow-100">
              <div className="w-14 h-14 bg-yellow-600 rounded-xl flex items-center justify-center mb-6">
                <Star className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">التجربة الفريدة ⭐</h3>
              <p className="text-gray-600 leading-relaxed">
                كل رحلة مصممة بعناية لتكون تجربة لا تُنسى ومغامرة استثنائية
              </p>
            </div>

            {/* Local Support */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-red-100">
              <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center mb-6">
                <Handshake className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">الدعم المحلي 🤝</h3>
              <p className="text-gray-600 leading-relaxed">
                ندعم المجتمعات المحلية ونعمل مع المرشدين المحليين لخلق فرص عمل
              </p>
            </div>

            {/* Professionalism */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-indigo-100">
              <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">الاحترافية 💼</h3>
              <p className="text-gray-600 leading-relaxed">
                فريق من الخبراء المتخصصين في السياحة البيئية وإدارة الرحلات
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">500+</div>
              <div className="text-green-100 text-lg">رحلة منظمة</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">5000+</div>
              <div className="text-green-100 text-lg">عميل سعيد</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">15+</div>
              <div className="text-green-100 text-lg">وجهة مميزة</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">4.8/5</div>
              <div className="text-green-100 text-lg">تقييم العملاء</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">فريق العمل</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              نلتقي بفريق من الخبراء المتخصصين في السياحة البيئية
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="text-center group">
              <div className="relative mb-6 overflow-hidden rounded-2xl">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center">
                  <Users className="w-20 h-20 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">أحمد محمد</h3>
              <p className="text-gray-600 mb-1">مدير العمليات</p>
              <p className="text-sm text-gray-500">خبير في تنظيم الرحلات البيئية</p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center group">
              <div className="relative mb-6 overflow-hidden rounded-2xl">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center">
                  <Users className="w-20 h-20 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">سارة بن علي</h3>
              <p className="text-gray-600 mb-1">مديرة التسويق</p>
              <p className="text-sm text-gray-500">متخصصة في السياحة المستدامة</p>
            </div>

            {/* Team Member 3 */}
            <div className="text-center group">
              <div className="relative mb-6 overflow-hidden rounded-2xl">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <Users className="w-20 h-20 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">كريم قاسم</h3>
              <p className="text-gray-600 mb-1">مرشد سياحي رئيسي</p>
              <p className="text-sm text-gray-500">خبير في تاريخ وجغرافيا الجزائر</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-teal-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            جاهز لمغامرتك القادمة؟
          </h2>
          <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
            انضم إلينا واكتشف جمال الجزائر مع فريق من الخبراء المتخصصين في السياحة البيئية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/ecoTour" 
              className="px-8 py-4 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 hover:scale-105 shadow-lg text-lg"
            >
              استكشف الرحلات
            </a>
            <a 
              href="/contact" 
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-all duration-200 hover:scale-105 text-lg"
            >
              تواصل معنا
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
