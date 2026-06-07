import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

import { translations } from '@/lib/translations';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const getInitialLanguage = (): Language => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang');
      if (langParam === 'es' || langParam === 'en') return langParam as Language;

      const hostname = window.location.hostname;
      if (hostname.startsWith('es.')) {
        return 'es';
      }
    }
    return 'en';
  };

  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  React.useEffect(() => {
    // Update HTML lang attribute
    document.documentElement.lang = language;

    // Update document title and meta description
    const title = language === 'es' ? 'Apturio — Tu Máquina de Ventas con IA' : 'Apturio — Your AI-Powered Sales Machine';
    const description = language === 'es'
      ? 'Apturio es tu Máquina de Ventas con IA, construida por expertos y lista para funcionar. Obtén una configuración de IA CRM Llave en mano valorada en $2,000, diseñada específicamente para calificar leads, gestionar tu pipeline y llenar tu calendario 24/7'
      : 'Apturio is your AI-Powered Sales Machine, expertly built and ready to run. Get a fully Done-for-You AI CRM setup valued at $2,000, specifically engineered to qualify leads, manage your pipeline, and fill your calendar 24/7';

    document.title = title;

    const updateMetaTag = (name: string, property: string, content: string) => {
      let meta = document.head.querySelector(`meta[name="${name}"], meta[property="${property}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        if (name) meta.setAttribute('name', name);
        if (property) meta.setAttribute('property', property);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    updateMetaTag('description', '', description);
    updateMetaTag('', 'og:title', title);
    updateMetaTag('', 'og:description', description);
    updateMetaTag('twitter:title', '', title);
    updateMetaTag('twitter:description', '', description);

    const url = language === 'es' ? `https://es.apturio.com${window.location.pathname}` : `https://apturio.com${window.location.pathname}`;
    updateMetaTag('', 'og:url', url);

    // Manage SEO hreflang and canonical tags
    const head = document.head;

    // Remove existing alternate/canonical tags to prevent duplicates
    const existingLinks = head.querySelectorAll('link[rel="alternate"], link[rel="canonical"]');
    existingLinks.forEach(link => link.remove());

    const path = window.location.pathname;

    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = language === 'es' ? `https://es.apturio.com${path}` : `https://apturio.com${path}`;
    head.appendChild(canonicalLink);

    // Add English alternate
    const enLink = document.createElement('link');
    enLink.rel = 'alternate';
    enLink.hreflang = 'en';
    enLink.href = `https://apturio.com${path}`;
    head.appendChild(enLink);

    // Add Spanish alternate
    const esLink = document.createElement('link');
    esLink.rel = 'alternate';
    esLink.hreflang = 'es';
    esLink.href = `https://es.apturio.com${path}`;
    head.appendChild(esLink);

    // Add x-default alternate
    const xDefault = document.createElement('link');
    xDefault.rel = 'alternate';
    xDefault.hreflang = 'x-default';
    xDefault.href = `https://apturio.com${path}`;
    head.appendChild(xDefault);

  }, [language]);

  const t = (path: string) => {
    const keys = path.split('.');
    let result: any = translations[language];
    for (const key of keys) {
      if (result[key] === undefined) return path;
      result = result[key];
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
