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
  Youtube
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-4">
      <div className="max-w-7xl mx-auto">
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
                  href="/pricing" 
                  className="text-sm hover:text-green-500 transition-colors"
                >
                  الأسعار
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
                <MapPin className="w-5 h-5 text-green-500" />
                <span className="text-sm">الجزائر العاصمة، الجزائر</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-green-500" />
                <span className="text-sm">السبت-الخميس: 9:00 - 18:00</span>
              </div>
            </div>
          </div>

          {/* Column 4 - Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">تابعنا</h3>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-slate-400 mt-4">
              تابعنا على وسائل التواصل الاجتماعي للحصول على آخر الأخبار والعروض الخاصة بنا.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 pt-8 mt-8">
          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm text-slate-400">
              © 2026 ALG EcoTour. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
