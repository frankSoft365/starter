import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import zhCN from "./locales/zh-CN";
import en from "./locales/en";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            "zh-CN": { translation: zhCN },
            en: { translation: en },
        },
        fallbackLng: "zh-CN",
        debug: import.meta.env.DEV,
        interpolation: {
            escapeValue: false,
        },
        supportedLngs: ["zh-CN", "en"],
        detection: {
            lookupLocalStorage: "i18nextLng",
            convertDetectedLanguage: (lng: string) => {
                if (lng.startsWith("zh")) return "zh-CN";
                return lng;
            }
        }
    });

export default i18n;