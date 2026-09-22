import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../services/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('kisan_lang') || 'hi');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('kisan_font_size') || 'normal');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('kisan_high_contrast') === 'true');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('kisan_dark_mode') === 'true');

  useEffect(() => {
    localStorage.setItem('kisan_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('kisan_font_size', fontSize);
    document.documentElement.classList.remove('font-scale-small', 'font-scale-normal', 'font-scale-large');
    document.documentElement.classList.add(`font-scale-${fontSize}`);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('kisan_high_contrast', highContrast ? 'true' : 'false');
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('kisan_dark_mode', darkMode ? 'true' : 'false');
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'hi' ? 'en' : 'hi'));
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const t = (key, fallback = '') => {
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    if (translations['en'] && translations['en'][key]) {
      return translations['en'][key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      lang, 
      language: lang,
      setLang, 
      toggleLanguage, 
      fontSize, 
      setFontSize, 
      highContrast, 
      toggleHighContrast, 
      darkMode,
      toggleDarkMode,
      t 
    }}>
      <div className={`font-size-${fontSize} ${highContrast ? 'high-contrast' : ''} ${darkMode ? 'dark' : ''}`}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
