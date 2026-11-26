export type Locale = "es" | "en";

export interface BookLink {
  label: string;
  url: string;
}
export interface BookFaq {
  question: string;
  answer: string;
}

export interface BookDossier {
  fullTitle: string;
  openCoverLabel: string;
  openControlLabel: string;
  closeLabel: string;
  heading: string;
  synopsisHeading: string;
  synopsis: string[];
  topicsHeading: string;
  topics: string[];
  editionsHeading: string;
  amazonHeading: string;
  amazonFormatsLabel: string;
  amazonFormats: string[];
  hardcoverHeading: string;
  appleHeading: string;
  factsLabels: {
    author: string;
    byline: string;
    publisher: string;
    publicationDate: string;
    availabilityDate: string;
    language: string;
    pages: string;
    isbn13: string;
    asin: string;
    format: string;
    seller: string;
  };
  amazonHardcover: {
    byline: string;
    publisher: string;
    publicationDate: string;
    language: string;
    pages: string;
    isbn13: string;
    asin: string;
  };
  appleEbook: {
    author: string;
    publisher: string;
    availabilityDate: string;
    language: string;
    pages: string;
    format: string;
    seller: string;
  };
  retailerLinksLabel: string;
  foundationHeading: string;
  foundationIntroduction: string;
  foundationLinksLabel: string;
  foundationLinks: BookLink[];
  faqHeading: string;
  faqs: BookFaq[];
}
export interface BookContent {
  locale: Locale;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  path: string;
  cover: string;
  coverAlt: string;
  caseImage: string;
  language: string;
  availability: string;
  amazonUrl: string;
  appleBooksUrl: string;
  backHome: string;
  dossier: BookDossier;
}
export interface Book {
  id: string;
  collection: string;
  number: string;
  content: Record<Locale, BookContent>;
}

const exampleLinks = [
  { label: "Example project", url: "https://example.com/" },
];
const makeDossier = (locale: Locale): BookDossier =>
  locale === "es"
    ? {
        fullTitle: "TÍTULO DE EJEMPLO: Una obra demostrativa",
        openCoverLabel: "Abrir el dossier de ejemplo",
        openControlLabel: "Tocar para abrir el dossier de ejemplo",
        closeLabel: "Cerrar el dossier",
        heading: "Dossier de ejemplo",
        synopsisHeading: "La obra",
        synopsis: [
          "Este texto es un ejemplo genérico para mostrar la estructura de una página editorial.",
          "Reemplazá este contenido con la información de tu propia publicación antes de desplegar el sitio.",
        ],
        topicsHeading: "Temas",
        topics: ["Tema de ejemplo", "Otra idea", "Preguntas abiertas"],
        editionsHeading: "Ediciones y formatos",
        amazonHeading: "Formato impreso",
        amazonFormatsLabel: "Formatos disponibles",
        amazonFormats: ["Tapa dura", "Tapa blanda", "Ebook"],
        hardcoverHeading: "Ficha de ejemplo",
        appleHeading: "Edición digital",
        factsLabels: {
          author: "Autor",
          byline: "Firma",
          publisher: "Editorial",
          publicationDate: "Fecha",
          availabilityDate: "Disponibilidad",
          language: "Idioma",
          pages: "Páginas",
          isbn13: "ISBN-13",
          asin: "Identificador",
          format: "Formato",
          seller: "Vendedor",
        },
        amazonHardcover: {
          byline: "Nombre del autor de ejemplo",
          publisher: "Editorial de ejemplo",
          publicationDate: "Fecha de ejemplo",
          language: "Español",
          pages: "000 páginas",
          isbn13: "000-0-00000-000-0",
          asin: "EJEMPLO-000",
        },
        appleEbook: {
          author: "Nombre del autor de ejemplo",
          publisher: "Editorial de ejemplo",
          availabilityDate: "Fecha de ejemplo",
          language: "Español",
          pages: "000 páginas",
          format: "Ebook",
          seller: "Vendedor de ejemplo",
        },
        retailerLinksLabel: "Enlaces de ejemplo",
        foundationHeading: "Contexto del proyecto",
        foundationIntroduction:
          "Añadí aquí contexto editorial, enlaces y fuentes propios de tu proyecto.",
        foundationLinksLabel: "Fuentes de ejemplo",
        foundationLinks: exampleLinks,
        faqHeading: "Preguntas frecuentes",
        faqs: [
          {
            question: "¿Qué muestra esta página?",
            answer:
              "Una ficha editorial reutilizable con datos de ejemplo claramente marcados.",
          },
          {
            question: "¿Puedo reutilizar la estructura?",
            answer:
              "Sí, reemplazá todos los datos de ejemplo por contenido con derechos y datos verificados.",
          },
        ],
      }
    : {
        fullTitle: "EXAMPLE TITLE: A Demonstration Work",
        openCoverLabel: "Open the example dossier",
        openControlLabel: "Tap to open the example dossier",
        closeLabel: "Close the dossier",
        heading: "Example dossier",
        synopsisHeading: "The work",
        synopsis: [
          "This is generic example copy showing the structure of an editorial page.",
          "Replace this content with details for your own publication before deployment.",
        ],
        topicsHeading: "Topics",
        topics: ["Example topic", "Another idea", "Open questions"],
        editionsHeading: "Editions and formats",
        amazonHeading: "Print format",
        amazonFormatsLabel: "Available formats",
        amazonFormats: ["Hardcover", "Paperback", "Ebook"],
        hardcoverHeading: "Example record",
        appleHeading: "Digital edition",
        factsLabels: {
          author: "Author",
          byline: "Byline",
          publisher: "Publisher",
          publicationDate: "Date",
          availabilityDate: "Availability",
          language: "Language",
          pages: "Pages",
          isbn13: "ISBN-13",
          asin: "Identifier",
          format: "Format",
          seller: "Seller",
        },
        amazonHardcover: {
          byline: "Example Author Name",
          publisher: "Example Publisher",
          publicationDate: "Example date",
          language: "English",
          pages: "000 pages",
          isbn13: "000-0-00000-000-0",
          asin: "EXAMPLE-000",
        },
        appleEbook: {
          author: "Example Author Name",
          publisher: "Example Publisher",
          availabilityDate: "Example date",
          language: "English",
          pages: "000 pages",
          format: "Ebook",
          seller: "Example seller",
        },
        retailerLinksLabel: "Example links",
        foundationHeading: "Project context",
        foundationIntroduction:
          "Add editorial context, links, and sources for your own project here.",
        foundationLinksLabel: "Example sources",
        foundationLinks: exampleLinks,
        faqHeading: "Frequently asked questions",
        faqs: [
          {
            question: "What does this page show?",
            answer:
              "A reusable editorial record with clearly marked example data.",
          },
          {
            question: "Can I reuse the structure?",
            answer:
              "Yes, replace all example data with content and rights information verified for your project.",
          },
        ],
      };

const content = (locale: Locale): BookContent =>
  locale === "es"
    ? {
        locale,
        title: "Título de ejemplo",
        subtitle: "Una experiencia editorial reutilizable.",
        description:
          "Plantilla bilingüe de Astro con datos genéricos para mostrar una publicación de ejemplo.",
        cta: "Ver el ejemplo",
        path: "/es/libro/titulo-de-ejemplo/",
        cover: "/media/template-cover-es.svg",
        coverAlt: "Cubierta genérica de ejemplo",
        caseImage: "/media/template-cover-es.svg",
        language: "Español",
        availability: "Ejemplo",
        amazonUrl: "https://example.com/",
        appleBooksUrl: "https://example.com/",
        backHome: "Volver al inicio",
        dossier: makeDossier(locale),
      }
    : {
        locale,
        title: "Example Title",
        subtitle: "A reusable editorial experience.",
        description:
          "Bilingual Astro template data using generic content for a sample publication.",
        cta: "View the example",
        path: "/en/book/example-title/",
        cover: "/media/template-cover-en.svg",
        coverAlt: "Generic example cover",
        caseImage: "/media/template-cover-en.svg",
        language: "English",
        availability: "Example",
        amazonUrl: "https://example.com/",
        appleBooksUrl: "https://example.com/",
        backHome: "Back home",
        dossier: makeDossier(locale),
      };

export const exampleBook: Book = {
  id: "example",
  collection: "Example Collection",
  number: "001",
  content: { es: content("es"), en: content("en") },
};
export const books: Book[] = [exampleBook];
export const localeLabels = { es: "ES", en: "EN" } as const satisfies Record<
  Locale,
  string
>;
