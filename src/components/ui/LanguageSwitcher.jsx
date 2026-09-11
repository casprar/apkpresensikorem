import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function LanguageSwitcher({ style = {} }) {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      title="Switch Language / Ganti Bahasa"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '20px',
        border: '1px solid var(--border-color, #E2E8F0)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        color: '#1E293B',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease',
        userSelect: 'none',
        ...style
      }}
    >
      <span>{language === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}</span>
      <span style={{ opacity: 0.4, fontSize: '11px' }}>⇄</span>
    </button>
  );
}
