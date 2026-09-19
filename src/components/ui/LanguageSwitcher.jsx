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
        padding: '5px 12px',
        borderRadius: '20px',
        border: '1px solid #DED7CB',
        backgroundColor: '#EFEAE1',
        color: '#4A5060',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        userSelect: 'none',
        ...style
      }}
    >
      <span>{language === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}</span>
      <span style={{ opacity: 0.5, fontSize: '11px' }}>⇄</span>
    </button>
  );
}
