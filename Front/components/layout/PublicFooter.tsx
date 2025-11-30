import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

export const PublicFooter = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-16" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4 justify-end">
              <span className="font-bold text-xl">باربری بهار</span>
              <div className="text-2xl">🚚</div>
            </div>
            <p className="text-sm opacity-90">
              باربری بهار با بیش از 10 سال سابقه، ارائه‌دهنده خدمات حرفه‌ای اسباب‌کشی و باربری در سراسر کشور
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">دسترسی سریع</h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm opacity-90 hover:opacity-100 transition-opacity">
                صفحه اصلی
              </Link>
              <Link to="/services" className="text-sm opacity-90 hover:opacity-100 transition-opacity">
                خدمات
              </Link>
              <Link to="/login" className="text-sm opacity-90 hover:opacity-100 transition-opacity">
                ورود / ثبت نام
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4">تماس با ما</h3>
            <div className="flex flex-col gap-3">
              <a href="tel:02191005100" className="text-sm opacity-90 hover:opacity-100 transition-opacity flex items-center gap-2 justify-end">
                <span>021-91005100</span>
                <Phone className="w-4 h-4" />
              </a>
              <a href="mailto:info@barbaribahar.com" className="text-sm opacity-90 hover:opacity-100 transition-opacity flex items-center gap-2 justify-end">
                <span>info@barbaribahar.com</span>
                <Mail className="w-4 h-4" />
              </a>
              <div className="text-sm opacity-90 flex items-start gap-2 justify-end">
                <span>تهران، خیابان انقلاب، پلاک 123</span>
                <MapPin className="w-4 h-4 mt-0.5" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm opacity-75">
          <p>تمامی حقوق این وب‌سایت متعلق به باربری بهار می‌باشد © {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
};
