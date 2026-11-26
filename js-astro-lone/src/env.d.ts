/// <reference types="astro/client" />

declare module 'lone/config' {
  export const site: {
    name: string;
    wordmark: string;
    motto: string;
    displayFont?: string;
    displayWeight?: number;
    displayTracking?: string;
    description: string;
    url: string;
    lang: string;
    author: string;
    email: string;
    github: string;
    ogImage: string;
    favicon: string;
    rssTitle: string;
    years: string;
    icp?: { href: string; text: string };
  };

  export const nav: { href: string; label: string }[];

  export const home: {
    title: string;
    lede: string;
    hero: string;
    streamLabel: string;
    pageSize: number;
    tagPreview: number;
    pin?: string;
  };

  export const archive: { title: string; lede: string };
  export const tags: { title: string; lede: string };
  export const categories: {
    title: string;
    lede: string;
    labels: Record<string, string>;
  };
  export const about: {
    title: string;
    lede: string;
    body: string[];
    quote?: string;
    stack?: { label: string; items: string[] }[];
  };
  export const notFound: { title: string; lede: string };

  export const ui: {
    skipToContent: string;
    emptyStream: string;
    emptyTags: string;
    noBody: string;
    backToNotes: string;
    backToTags: string;
    allNotes: string;
    allTagsCount: (n: number) => string;
    leadLabel: string;
    pinLabel: string;
    leadRead: string;
    issueMeta: (year: number, count: number) => string;
    pagerPage: (n: number) => string;
    byKind: string;
    bySubject: string;
    langEn: string;
    langZh: string;
    readMin: (n: number) => string;
    photoCount: (n: number) => string;
    noteCount: (n: number) => string;
    pagerPrev: string;
    pagerNext: string;
    galleryLabel: string;
    tocLabel?: string;
    morePhotos: (n: number) => string;
    postNavOlder: string;
    postNavNewer: string;
    postNavAll: string;
    linkEmail: string;
    linkGithub: string;
    linkRss: string;
    ariaNav: string;
    ariaPager: string;
    ariaContents: string;
    ariaAdjacent: string;
    footCopyright: (years: string, name: string) => string;
    footThemeLabel: string;
    footTheme: string;
    footThemeHref: string;
    themeDay?: string;
    themeNight?: string;
    themeToDay?: string;
    themeToNight?: string;
    menuOpen?: string;
    menuClose?: string;
    menuCloseWord?: string;
  };
}
