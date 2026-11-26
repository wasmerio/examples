import type { Locale } from "./books";
export type LegalDocument = {
  locale: Locale;
  slug: string;
  path: string;
  title: string;
  description: string;
  status: string;
  sections: { heading: string; paragraphs: string[]; items?: string[] }[];
};
const copy = {
  es: {
    status: "Información legal",
    docs: [
      ["aviso-legal", "Aviso legal"],
      ["privacidad", "Política de privacidad"],
      ["cookies", "Política de cookies"],
      ["terminos", "Términos de uso"],
    ],
  },
  en: {
    status: "Legal information",
    docs: [
      ["legal-notice", "Legal notice"],
      ["privacy", "Privacy policy"],
      ["cookies", "Cookie policy"],
      ["terms", "Terms of use"],
    ],
  },
} as const;
const paragraphs = {
  es: [
    "Este documento es un ejemplo genérico. Reemplazá esta información por los datos legales y de contacto de tu propio proyecto antes de publicarlo.",
    "El contenido, los servicios, los enlaces y las prácticas de cada proyecto deben revisarse con asesoramiento adecuado y mantenerse actualizados.",
  ],
  en: [
    "This document is generic example copy. Replace it with your own project's legal and contact details before publication.",
    "Review the content, services, links, and practices for each project with appropriate advice and keep them up to date.",
  ],
} satisfies Record<Locale, string[]>;
const documents: LegalDocument[] = [];
for (const locale of ["es", "en"] as const) {
  for (const [slug, title] of copy[locale].docs) {
    documents.push({
      locale,
      slug,
      path: `/${locale}/legal/${slug}/`,
      title,
      description: `${title} — generic template example`,
      status: copy[locale].status,
      sections: [
        {
          heading:
            locale === "es" ? "Información de ejemplo" : "Example information",
          paragraphs: paragraphs[locale],
        },
        {
          heading: locale === "es" ? "Alcance" : "Scope",
          paragraphs: [
            locale === "es"
              ? "Esta plantilla no proporciona asesoramiento legal ni define las obligaciones de tu proyecto."
              : "This template does not provide legal advice or define your project's obligations.",
          ],
        },
      ],
    });
  }
}
export const legalDocuments = documents;
