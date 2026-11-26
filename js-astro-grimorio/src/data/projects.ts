import { type Language } from "../i18n";

export interface Project {
  name: string;
  description: string;
  url: string;
  icon: string;
  tech: string[];
  status: string;
}

// Example projects. Replace these with your own, or remove the "Projects"
// entry from navigation in src/site.config.json if you don't need the page.
export function getProjects(lang: Language): Project[] {
  const es = lang === "es";
  return [
    {
      name: "Grimorio",
      description: es
        ? "La plantilla de blog con la que está hecho este sitio: Astro, bilingüe y centrada en el contenido."
        : "The blog template this site is built with: Astro, bilingual, and content-first.",
      url: "https://github.com/sud0pls/Grimorio-astro",
      icon: "icon-[simple-icons--astro]",
      tech: ["Astro", "Vue", "TypeScript"],
      status: es ? "Plantilla de ejemplo" : "Example project",
    },
  ];
}
