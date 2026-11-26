export type SupportedLocale = "en" | "de";

export const translations = {
  en: {
    aboutMe: "About Me",
    experience: "Work Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    certifications: "Certifications",
    languages: "Languages",
    contact: "Contact",
    present: "Present",
    downloadAtsPdf: "📄 ATS PDF",
    downloadDesignPdf: "🎨 Design PDF",
  },
  de: {
    aboutMe: "Über mich",
    experience: "Berufserfahrung",
    education: "Ausbildung",
    skills: "Fähigkeiten",
    projects: "Projekte",
    certifications: "Zertifikate",
    languages: "Sprachen",
    contact: "Kontakt",
    present: "Heute",
    downloadAtsPdf: "📄 ATS PDF",
    downloadDesignPdf: "🎨 Design PDF",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function getTranslations(locale: string = "en") {
  const dictionary =
    translations[locale as SupportedLocale] ?? translations.en;

  return (key: TranslationKey): string => {
    return dictionary[key] ?? translations.en[key] ?? key;
  };
}
