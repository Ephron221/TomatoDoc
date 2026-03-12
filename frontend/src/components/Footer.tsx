import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold text-secondary flex items-center mb-4">
              <span className="text-3xl mr-1">🍅</span>
              TomatoDoc
            </Link>
            <p className="text-gray-500 mb-6">
              Empowering Rwandan tomato farmers with AI-driven insights and expert guidance to protect their crops and boost yields.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-secondary"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-secondary"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-secondary"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-gray-900 font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-500 hover:text-secondary">{t('nav.home')}</Link></li>
              <li><Link to="/how-it-works" className="text-gray-500 hover:text-secondary">{t('nav.how_it_works')}</Link></li>
              <li><Link to="/pricing" className="text-gray-500 hover:text-secondary">{t('nav.pricing')}</Link></li>
              <li><Link to="/about" className="text-gray-500 hover:text-secondary">{t('nav.about')}</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-secondary">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-500 hover:text-secondary">Help Center</Link></li>
              <li><Link to="/faq" className="text-gray-500 hover:text-secondary">FAQs</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-secondary">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-secondary">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-secondary mr-2 flex-shrink-0" />
                <span className="text-gray-500">University of Rwanda, Huye Campus, Rwanda</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-secondary mr-2 flex-shrink-0" />
                <span className="text-gray-500">+250 780 000 000</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-secondary mr-2 flex-shrink-0" />
                <span className="text-gray-500">info@tomatodoc.rw</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} TomatoDoc Rwanda. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
