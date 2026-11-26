import type { Dict } from "./zh-hans"

export const en: Dict = {
  list: {
    pages: (n) => (n === 1 ? "1 page" : `${n} pages`),
    terms: (n) => (n === 1 ? "1 term" : `${n} terms`),
  },
  article: {
    empty: "No content",
    relatedContent: "Related content",
    prev: "Previous",
    next: "Next",
    alert: {
      note: "Note",
      tip: "Tip",
      important: "Important",
      caution: "Caution",
      warning: "Warning",
    },
    updated: "Updated",
    readingTime: (n) => `${n} min`,
    wordCount: (n) => (n === 1 ? "1 word" : `${n} words`),
  },
  code: {
    copy: "Copy",
    copied: "Copied",
    expand: "Expand",
    collapse: "Collapse",
  },
  nav: {
    home: "Home",
    anchor: "Link to this section",
    backHome: "Back to home",
    breadcrumb: "Breadcrumb",
    menu: "Menu",
    prev: "Previous",
    next: "Next",
    pageInfo: (current, total) => `Page ${current} of ${total}`,
  },
  ui: {
    skipToContent: "Skip to content",
    language: "Language",
    announcementDismiss: "Dismiss announcement",
    dockAriaLabel: "Quick actions toolbar",
    dockSearch: "Search",
    dockComments: "Comments",
    dockBackToTop: "Back to top",
    toc: "Table of contents",
    tocPin: "Pin table of contents",
    tocUnpin: "Unpin table of contents",
    tocClose: "Close table of contents",
    galleryLayoutSwitch: "Switch gallery layout",

    searchClear: "Clear",
    searchPlaceholder: "Search posts...",
    searchClose: "Close",
    searchEmpty: "Start searching",
    searchLoading: "Searching...",
    searchNoResults: "No results",
    searchResultsCount: (n) => `Found ${n} results`,
    searchHints: ["Navigate", "Select", "Close", "Shortcut"],

    themeDark: "Dark",
    themeLight: "Light",
    themeSystem: "System",

    contentWidth: "Page width",
    contentWidthReset: "Restore default",
    backdropBlur: "Backdrop blur",
    backdropBlurReset: "Restore default",
    grainSize: "Grain size",
    grainSizeReset: "Restore default",

    appearanceToggle: "Appearance settings",
    colorScheme: "Color scheme",
    themeMode: "Theme mode",
  },
  comments: {
    title: "Comments",
    notConfigured: "Comment system not configured",
  },
  home: {
    featuredProjects: "Featured Projects",
    viewAll: "View all",
    recentPosts: "Recent Posts",
  },
  resume: {
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    certifications: "Certifications",
    languages: "Languages",
  },
  notFound: {
    title: "Page Not Found",
    message:
      "Sorry, the page you are looking for does not exist or has been removed.",
  },
  footer: {
    poweredBy: "Powered by",
  },
  context: {
    seriesPrev: "Previous part",
    seriesNext: "Next part",
    seriesPartOf: (current, total) => `Part ${current} of ${total}`,
    seriesParts: "All parts",
    seriesViewSeries: "View series",
  },
  projects: {
    visit: "Open project",
  },
}
