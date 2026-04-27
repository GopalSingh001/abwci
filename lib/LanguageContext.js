import { createContext, useContext, useState, useEffect } from 'react';

// Import all message files statically
import enMessages from '../messages/en.json';
import esMessages from '../messages/es.json';
import frMessages from '../messages/fr.json';
import deMessages from '../messages/de.json';
import itMessages from '../messages/it.json';
import ptMessages from '../messages/pt.json';
import arMessages from '../messages/ar.json';
import hiMessages from '../messages/hi.json';
import zhMessages from '../messages/zh.json';
import jaMessages from '../messages/ja.json';
import urMessages from '../messages/ur.json';
import bnMessages from '../messages/bn.json';
import neMessages from '../messages/ne.json';
import siMessages from '../messages/si.json';
import taMessages from '../messages/ta.json';
import viMessages from '../messages/vi.json';
import thMessages from '../messages/th.json';
import filMessages from '../messages/fil.json';
import msMessages from '../messages/ms.json';
import swMessages from '../messages/sw.json';
import kaMessages from '../messages/ka.json';
import kyMessages from '../messages/ky.json';
import lvMessages from '../messages/lv.json';
import huMessages from '../messages/hu.json';
import plMessages from '../messages/pl.json';
import nbMessages from '../messages/nb.json';
import myMessages from '../messages/my.json';
import haMessages from '../messages/ha.json';
import yoMessages from '../messages/yo.json';
import igMessages from '../messages/ig.json';
import pcmMessages from '../messages/pcm.json';

const LanguageContext = createContext();

const messageFiles = {
  en: enMessages,
  es: esMessages,
  fr: frMessages,
  de: deMessages,
  it: itMessages,
  pt: ptMessages,
  ar: arMessages,
  hi: hiMessages,
  zh: zhMessages,
  ja: jaMessages,
  ur: urMessages,
  bn: bnMessages,
  ne: neMessages,
  si: siMessages,
  ta: taMessages,
  vi: viMessages,
  th: thMessages,
  fil: filMessages,
  ms: msMessages,
  sw: swMessages,
  ka: kaMessages,
  ky: kyMessages,
  lv: lvMessages,
  hu: huMessages,
  pl: plMessages,
  nb: nbMessages,
  my: myMessages,
  ha: haMessages,
  yo: yoMessages,
  ig: igMessages,
  pcm: pcmMessages,
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [messages, setMessages] = useState(enMessages);

  // Deep merge utility to fallback to English for missing keys
  const mergeDeep = (base, override) => {
    if (!override || typeof override !== 'object') return base;
    const result = Array.isArray(base) ? [...base] : { ...base };
    for (const key of Object.keys(override)) {
      if (
        override[key] &&
        typeof override[key] === 'object' &&
        !Array.isArray(override[key])
      ) {
        result[key] = mergeDeep(base[key] || {}, override[key]);
      } else {
        result[key] = override[key];
      }
    }
    return result;
  };

  // Load language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setCurrentLanguage(savedLanguage);
    const merged = mergeDeep(enMessages, messageFiles[savedLanguage] || {});
    setMessages(merged);
  }, []);

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
    const merged = mergeDeep(enMessages, messageFiles[lang] || {});
    setMessages(merged);
    
    // Force page refresh to ensure all components update
    window.location.reload();
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = messages;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
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
