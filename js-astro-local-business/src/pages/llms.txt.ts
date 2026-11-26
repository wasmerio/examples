import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { site, absoluteUrl } from "../config";

/**
 * llms.txt — a plain-text index for AI assistants.
 *
 * Be clear about what this does: Google ignores llms.txt entirely. It serves
 * ChatGPT, Claude, Perplexity and friends, which fetch it when they want to
 * understand a site without crawling every page. Keeping it accurate is cheap;
 * keeping it aspirational is worse than not having one.
 */
export const GET: APIRoute = async () => {
  const [services, locations] = await Promise.all([
    getCollection("services"),
    getCollection("locations"),
  ]);

  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    "## Kontakt",
    `- Telefon: ${site.phone}`,
    `- E-Mail: ${site.email}`,
    `- Adresse: ${site.address.street}, ${site.address.zip} ${site.address.city}, ${site.address.country}`,
    `- Einsatzgebiet: ${site.areaServed.join(", ")}`,
    `- Öffnungszeiten: ${site.hours.map((h) => `${h.days.join("/")} ${h.opens}–${h.closes}`).join("; ")}`,
    "",
    "## Leistungen",
    ...services
      .sort((a, b) => a.data.order - b.data.order)
      .map((entry) => `- [${entry.data.title}](${absoluteUrl(`/services/${entry.id}/`)}): ${entry.data.description}`),
    "",
  ];

  if (locations.length > 0) {
    lines.push(
      "## Einsatzgebiet",
      ...locations
        .sort((a, b) => a.data.order - b.data.order)
        .map((entry) => `- [${entry.data.title}](${absoluteUrl(`/locations/${entry.id}/`)}): ${entry.data.description}`),
      "",
    );
  }

  lines.push("## Seiten", `- [Startseite](${absoluteUrl("/")}): ${site.tagline}`, `- [Kontakt](${absoluteUrl("/contact/")})`, "");

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
