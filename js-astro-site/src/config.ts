import type { Icon } from "virtual:astro-icon";

import {
  icons as tablerIcons,
  aliases as tablerAliases,
} from "@iconify-json/tabler/icons.json";

type AvalibleIcon =
  | `tabler:${keyof typeof tablerIcons | keyof typeof tablerAliases}`
  | Icon;

export const SITE = {
  website: "https://wry.red/", // replace this with your deployed domain
  author: "wry",
  desc: "A minimal, responsive and SEO-friendly Astro blog theme.",
  title: "Wren's Digital Garden",
  ogImage: "og.png",
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
} as const;

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: "en-US", // BCP 47 Language Tags. Set this empty [] to use the environment default
  formatString: "yyyy/MM/dd HH:mm:ss z",
} as const;

const EXTRA_ICONS: AvalibleIcon[] = [
  "tabler:calendar-dot",
  "tabler:calendar-up",
  "tabler:list-search",
  "tabler:sun",
  "tabler:moon",
  "tabler:rss",
  "tabler:hash",
  "tabler:arrow-up",
  "tabler:arrow-down",
  "tabler:arrow-left",
  "tabler:arrow-right",
  "tabler:chevron-up",
  "tabler:chevron-down",
  "tabler:chevron-left",
  "tabler:chevron-right",
  "tabler:external-link",
] as const;

export type SocialObject = {
  icon: AvalibleIcon;
  href: string;
  title: string;
  active: boolean;
};

export const CONTACTS: SocialObject[] = [
  {
    icon: "tabler:brand-x",
    href: "https://x.com/aristolochic",
    title: `${SITE.title} on X`,
    active: true,
  },
  {
    icon: "tabler:brand-instagram",
    href: "https://instagram.com/aristolochic",
    title: `${SITE.title} on Instagram`,
    active: true,
  },
  {
    icon: "tabler:brand-mastodon",
    href: "https://mastodon.social/@aristolochic",
    title: `${SITE.title} on Mastodon`,
    active: true,
  },
  {
    icon: "tabler:brand-github",
    href: "https://github.com/chrysocolla",
    title: `${SITE.title} on Github`,
    active: true,
  },
  {
    icon: "tabler:mail",
    href: "mailto:chairmanwangry@gmail.com",
    title: `Send an email to ${SITE.title}`,
    active: true,
  },
  {
    icon: "tabler:brand-facebook",
    href: "",
    title: `${SITE.title} on Facebook`,
    active: false,
  },
  {
    icon: "tabler:brand-linkedin",
    href: "",
    title: `${SITE.title} on LinkedIn`,
    active: false,
  },
  {
    icon: "tabler:brand-twitch",
    href: "",
    title: `${SITE.title} on Twitch`,
    active: false,
  },
  {
    icon: "tabler:brand-youtube",
    href: "",
    title: `${SITE.title} on YouTube`,
    active: false,
  },
  {
    icon: "tabler:brand-whatsapp",
    href: "",
    title: `${SITE.title} on WhatsApp`,
    active: false,
  },
  {
    icon: "tabler:brand-snapchat",
    href: "",
    title: `${SITE.title} on Snapchat`,
    active: false,
  },
  {
    icon: "tabler:brand-pinterest",
    href: "",
    title: `${SITE.title} on Pinterest`,
    active: false,
  },
  {
    icon: "tabler:brand-tiktok",
    href: "",
    title: `${SITE.title} on TikTok`,
    active: false,
  },
  {
    icon: "tabler:brand-codepen",
    href: "",
    title: `${SITE.title} on CodePen`,
    active: false,
  },
  {
    icon: "tabler:brand-discord",
    href: "",
    title: `${SITE.title} on Discord`,
    active: false,
  },
  {
    icon: "tabler:brand-gitlab",
    href: "",
    title: `${SITE.title} on GitLab`,
    active: false,
  },
  {
    icon: "tabler:brand-reddit",
    href: "",
    title: `${SITE.title} on Reddit`,
    active: false,
  },
  {
    icon: "tabler:brand-skype",
    href: "",
    title: `${SITE.title} on Skype`,
    active: false,
  },
  {
    icon: "tabler:brand-steam",
    href: "",
    title: `${SITE.title} on Steam`,
    active: false,
  },
  {
    icon: "tabler:brand-telegram",
    href: "",
    title: `${SITE.title} on Telegram`,
    active: false,
  },
];

export const SHARES: SocialObject[] = [
  {
    icon: "tabler:brand-whatsapp",
    href: "https://wa.me/?text=",
    title: `Share this post via WhatsApp`,
    active: true,
  },
  {
    icon: "tabler:brand-facebook",
    href: "https://www.facebook.com/sharer.php?u=",
    title: `Share this post on Facebook`,
    active: true,
  },
  {
    icon: "tabler:brand-x",
    href: "https://x.com/intent/tweet?url=",
    title: `Tweet this post`,
    active: true,
  },
  {
    icon: "tabler:brand-telegram",
    href: "https://t.me/share/url?url=",
    title: `Share this post via Telegram`,
    active: true,
  },
  {
    icon: "tabler:brand-pinterest",
    href: "https://pinterest.com/pin/create/button/?url=",
    title: `Share this post on Pinterest`,
    active: true,
  },
  {
    icon: "tabler:mail",
    href: "mailto:?subject=See%20this%20post&body=",
    title: `Share this post via email`,
    active: true,
  },
] as const;

export const ICON_INCLUDE = Array.from(
  new Set(
    EXTRA_ICONS.concat(CONTACTS.map(s => s.icon)).concat(
      SHARES.map(s => s.icon)
    )
  )
).reduce((acc: Record<string, string[]>, i) => {
  const parsedIcon = i.split(":"),
    [collection, icon] = parsedIcon;
  if (parsedIcon.length === 2) {
    if (!(collection in acc)) acc[collection] = [];
    acc[collection].push(icon);
  }
  return acc;
}, {});
