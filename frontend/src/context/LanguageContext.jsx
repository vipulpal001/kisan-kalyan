import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, SUPPORTED_LANGUAGES } from '../services/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('kisan_lang') || 'hi');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('kisan_font_size') || 'normal');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('kisan_high_contrast') === 'true');

  useEffect(() => {
    localStorage.setItem('kisan_lang', lang);
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === lang);
    const dir = langObj?.dir || 'ltr';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dir);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('kisan_font_size', fontSize);
    document.documentElement.classList.remove('font-scale-small', 'font-scale-normal', 'font-scale-large', 'font-scale-xlarge');
    document.documentElement.classList.add(`font-scale-${fontSize}`);
    if (fontSize === 'small') {
      document.documentElement.style.fontSize = '14px';
    } else if (fontSize === 'large') {
      document.documentElement.style.fontSize = '18px';
    } else if (fontSize === 'xlarge') {
      document.documentElement.style.fontSize = '20px';
    } else {
      document.documentElement.style.fontSize = '16px';
    }
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('kisan_high_contrast', highContrast ? 'true' : 'false');
    if (highContrast) {
      document.body.classList.add('high-contrast');
      document.body.classList.add('dark-mode');
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.body.classList.remove('high-contrast');
      document.body.classList.remove('dark-mode');
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [highContrast]);

  const changeLanguage = (newLang) => {
    setLang(newLang);
  };

  const toggleLanguage = () => {
    // If current is Hindi switch to English, else switch to Hindi
    setLang(prev => (prev === 'hi' ? 'en' : 'hi'));
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  const t = (key, fallback = '') => {
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    if (translations['en'] && translations['en'][key]) {
      return translations['en'][key];
    }
    if (translations['hi'] && translations['hi'][key]) {
      return translations['hi'][key];
    }
    if (fallback) return fallback;
    if (typeof key === 'string') {
      return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
    }
    return '';
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ 
      lang, 
      language: lang,
      currentLanguage: currentLangObj,
      supportedLanguages: SUPPORTED_LANGUAGES,
      setLang, 
      changeLanguage,
      toggleLanguage, 
      fontSize, 
      setFontSize, 
      highContrast, 
      toggleHighContrast, 
      isDarkMode: highContrast,
      darkMode: highContrast,
      toggleDarkMode: toggleHighContrast,
      t 
    }}>
      <div className={`font-size-${fontSize} ${highContrast ? 'high-contrast dark-mode' : ''}`}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: 'hi',
      language: 'hi',
      currentLanguage: SUPPORTED_LANGUAGES[0],
      supportedLanguages: SUPPORTED_LANGUAGES,
      setLang: () => {},
      toggleLanguage: () => {},
      fontSize: 'normal',
      setFontSize: () => {},
      highContrast: false,
      toggleHighContrast: () => {},
      isDarkMode: false,
      darkMode: false,
      toggleDarkMode: () => {},
      t: (key, fallback = '') => fallback || key,
    };
  }
  return context;
}
