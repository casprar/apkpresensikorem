// src/i18n/index.js
import id from "./id.json";

const translations = {
  id,
  // future languages can be added here
};

export const getTranslation = (lang = "id") => {
  return translations[lang] || translations.id;
};
