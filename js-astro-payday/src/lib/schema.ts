import { siteConfig } from "@/config/site";

const absolute = (path: string) => new URL(path, siteConfig.siteUrl).toString();

const organization = {
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.siteUrl,
  logo: absolute(siteConfig.socialImage),
  sameAs: siteConfig.socials
    .filter((social) => social.href.startsWith("http"))
    .map((social) => social.href),
};

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@graph": [
    { ...organization, "@id": absolute("/#organization") },
    {
      "@type": "WebSite",
      "@id": absolute("/#website"),
      name: siteConfig.name,
      url: siteConfig.siteUrl,
      description: siteConfig.description,
      inLanguage: siteConfig.language,
      publisher: { "@id": absolute("/#organization") },
    },
  ],
});
