import { I18nKey } from "@/i18n/i18nKey";

export const footerConfig = {
  links: [
    { labelKey: I18nKey.footerPrivacyPolicy, href: "/privacy" },
    { labelKey: I18nKey.footerRss, href: "/rss.xml" },
    { labelKey: I18nKey.footerSitemap, href: "/sitemap-index.xml" },
  ],
} as const;
