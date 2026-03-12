import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitch: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'rw' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
  };

  return (
    <button 
      onClick={toggleLanguage} 
      className="flex items-center text-gray-700 hover:text-secondary font-bold text-sm bg-gray-50 px-3 py-1.5 rounded-full transition border border-gray-100 shadow-sm"
    >
      <Globe className="w-4 h-4 mr-1.5" />
      <span className="uppercase">{i18n.language}</span>
    </button>
  );
};

export default LanguageSwitch;
