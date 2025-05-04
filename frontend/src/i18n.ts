import { createI18n } from "vue-i18n";

import de from "../locales/de.json";
import en from "../locales/en.json";

type MessageSchema = typeof en | typeof de;

export default createI18n<[MessageSchema], "en" | "de">({
  locale: "en", // set default locale
  fallbackLocale: "de", // fallback to German
  messages: {
    en,
    de,
  },

});
