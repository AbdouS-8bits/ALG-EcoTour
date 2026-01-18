'use client';

import Link from 'next/link';
import { 
  Mountain, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MessageCircle
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Contact CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Contact us today to book your unforgettable eco tour experience in Algeria. Our team is ready to help you plan the perfect sustainable adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+213555123456"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
            <a
              href="mailto:info@algecotour.dz"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Email Us
            </a>
            <a
              href="https://wa.me/213555123456"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1 - About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mountain className="w-6 h-6 text-green-500" />
              <span className="text-xl font-bold text-white">ALG EcoTour</span>
            </div>
            <p className="text-sm leading-relaxed">
              منصة سياحة بيئية جزائرية لاكتشاف جمال الصحراء والجبال مع احترام البيئة والتراث المحلي.
            </p>
            <div className="flex space-x-3 pt-2">
              <a 
                href="https://facebook.com/algecotour" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 rounded-lg hover:bg-green-600 transition-colors"
                title="Follow us on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com/algecotour" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 rounded-lg hover:bg-green-600 transition-colors"
                title="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com/algecotour" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 rounded-lg hover:bg-green-600 transition-colors"
                title="Follow us on X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com/algecotour" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 rounded-lg hover:bg-green-600 transition-colors"
                title="Subscribe on YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-sm hover:text-green-500 transition-colors"
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link 
                  href="/ecoTour" 
                  className="text-sm hover:text-green-500 transition-colors"
                >
                  الرحلات
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-sm hover:text-green-500 transition-colors"
                >
                  من نحن
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-sm hover:text-green-500 transition-colors"
                >
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-sm hover:text-green-500 transition-colors"
                >
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-sm hover:text-green-500 transition-colors"
                >
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">تواصل معنا</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-500" />
                <span className="text-sm">info@algecotour.dz</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-500" />
                <span className="text-sm">+213 555 123 456</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm">+213 555 123 456 (WhatsApp)</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-green-500" />
                <span className="text-sm">الجزائر العاصمة، الجزائر</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-green-500" />
                <span className="text-sm">السبت-الخميس: 9:00 - 18:00</span>
              </div>
            </div>
          </div>

          {/* Column 4 - Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">النشرة البريدية</h3>
            <p className="text-sm text-slate-400">
              اشترك للحصول على آخر الأخبار والعروض الحصرية حول رحلاتنا البيئية.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                اشترك الآن
              </button>
            </div>
            <p className="text-xs text-slate-500">
              نحن نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-sm text-slate-400">
                © 2026 ALG EcoTour. جميع الحقوق محفوظة.
              </p>
            </div>
            
            {/* Additional Links */}
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/sitemap" className="text-sm text-slate-400 hover:text-green-500 transition-colors">
                خريطة الموقع
              </Link>
              <Link href="/accessibility" className="text-sm text-slate-400 hover:text-green-500 transition-colors">
                إمكانية الوصول
              </Link>
              <Link href="/faq" className="text-sm text-slate-400 hover:text-green-500 transition-colors">
                الأسئلة الشائعة
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
