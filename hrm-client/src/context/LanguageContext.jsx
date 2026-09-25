import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Import all English locales
import enCommon from '../locales/en/common.json';
import enAuth from '../locales/en/auth.json';
import enHrm from '../locales/en/hrm.json';
import enCrm from '../locales/en/crm.json';
import enOperations from '../locales/en/operations.json';
import enPortal from '../locales/en/portal.json';
import enPublic from '../locales/en/public.json';
import enValidation from '../locales/en/validation.json';

// Import all Myanmar locales
import myCommon from '../locales/my/common.json';
import myAuth from '../locales/my/auth.json';
import myHrm from '../locales/my/hrm.json';
import myCrm from '../locales/my/crm.json';
import myOperations from '../locales/my/operations.json';
import myPortal from '../locales/my/portal.json';
import myPublic from '../locales/my/public.json';
import myValidation from '../locales/my/validation.json';

const translations = {
  en: {
    common: enCommon,
    auth: enAuth,
    hrm: enHrm,
    crm: enCrm,
    operations: enOperations,
    portal: enPortal,
    public: enPublic,
    validation: enValidation,
  },
  my: {
    common: myCommon,
    auth: myAuth,
    hrm: myHrm,
    crm: myCrm,
    operations: myOperations,
    portal: myPortal,
    public: myPublic,
    validation: myValidation,
  }
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('bbd_language') || 'en';
  });

  const setLanguage = (lang) => {
    if (translations[lang]) {
      setLanguageState(lang);
      localStorage.setItem('bbd_language', lang);
    }
  };

  const t = useCallback((path) => {
    const keys = path.split('.');
    let current = translations[language];
    
    for (const key of keys) {
      if (current === undefined || current === null) return path;
      current = current[key];
    }
    
    if (current === undefined || current === null) {
      // Fallback to English if translation is missing in the chosen language
      if (language !== 'en') {
        let fallback = translations['en'];
        for (const key of keys) {
          if (fallback === undefined || fallback === null) return path;
          fallback = fallback[key];
        }
        return fallback !== undefined ? fallback : path;
      }
      return path;
    }
    return current;
  }, [language]);

  
    const tDyn = useCallback((prefix, val) => {
    if (!val) return val;
    if (typeof val === 'string' && val.startsWith('hrm.')) {
      const r = t(val);
      return r === val ? val : r;
    }
    const k = `${prefix}.${val}`;
    const r = t(k);
    if (r !== k) return r;
    
    if (typeof val === 'string') {
      const camelVal = val.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => i === 0 ? w.toLowerCase() : w.toUpperCase()).replace(/\s+/g, '');
      const k2 = `${prefix}.${camelVal}`;
      const r2 = t(k2);
      if (r2 !== k2) return r2;
      
      const k3 = `${prefix}.${val.toLowerCase()}`;
      const r3 = t(k3);
      if (r3 !== k3) return r3;
    }
    
    return val;
  }, [t]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tDyn }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
