import type { UIStrings } from "../types";

export default {
  nav: {
    home: "Home",
    blog: "Blog",
    notes: "Notes",
    projects: "Projects",
    lab: "Lab",
    about: "About",
    tags: "Tags",
    search: "Search",
  },
  content: {
    typePost: "Post",
    typeNote: "Note",
    typeProject: "Project",
  },
  og: {
    imageAlt: "{{type}}: {{title}}",
  },
  related: {
    title: "Related reading",
  },
  project: {
    status: {
      active: "Active",
      maintained: "Maintained",
      experiment: "Experiment",
      archived: "Archived",
    },
    stack: "Stack",
    links: "Links",
    relatedPosts: "Related posts",
    source: "Source code",
    docs: "Documentation",
    website: "Website",
  },
  post: {
    publishedAt: "Published",
    updatedAt: "Updated",
    readingTime: "{{minutes}} min read",
    draft: "Draft",
    permalink: "Permalink",
    copyLink: "Copy link",
    linkCopied: "Link copied",
    alsoOn: "Also on:",
    tagLabel: "Tags",
    backToTop: "Back to top",
    tableOfContents: "Table of contents",
    goBack: "Back",
    editPage: "Edit page",
    previousPost: "previous",
    nextPost: "next",
    copyCode: "copy",
    copied: "copied",
    copyFailed: "Copy failed",
    copyCodeFailed: "select and copy",
    draftNotice: "Draft: visible in development only, never published.",
    contentsLabel: "contents",
  },
  pagination: {
    prev: "Prev",
    next: "Next",
    page: "Page",
    status: "page {{current}} of {{last}}",
  },
  home: {
    writing: "Writing",
    archive: "archive",
    projects: "Projects",
    allProjects: "all",
    specialties: "Specialties",
  },
  about: {
    contactCta: "Get in touch",
  },
  contact: {
    methods: "Contact methods",
    noMethods: "No contact methods are configured yet.",
  },
  footer: {
    contact: "contact",
    rss: "rss",
    source: "source",
    poweredBy: "powered by",
    elsewhere: "Elsewhere",
  },
  pages: {
    tagTitle: "Tag",
    tagDesc: "All posts and notes tagged",

    tagsTitle: "Tags",
    tagsDesc: "All tags used in posts and notes.",
    tagCount: "{{count}} posts and notes",

    postsTitle: "Blog",
    postsDesc: "All posts, newest first.",

    notesTitle: "Notes",
    notesDesc: "Short notes, newest first.",

    projectsTitle: "Projects",
    projectsDesc: "Active, maintained and archived projects.",

    labTitle: "Lab",
    labDesc: "Experiments and prototypes.",

    searchTitle: "Search",
    searchDesc: "Search posts, notes and projects.",
  },
  search: {
    errorLoad:
      "Search couldn't load. Reload the page, or browse the blog, notes and projects.",
    noscript:
      "Search needs JavaScript. You can browse the {{blog}}, {{notes}} and {{projects}} instead.",
    blog: "blog",
    notes: "notes",
    projects: "projects",
    empty: "Nothing is published yet, so there is nothing to search.",
    emptyBrowse:
      "Once something is published, find it in the {{blog}}, {{notes}} or {{projects}}.",
  },
  empty: {
    postsHeading: "No posts yet",
    postsBody:
      "Published posts will appear here. Check back soon, or follow new posts via",
    notesHeading: "No notes yet",
    notesBody:
      "Published notes will appear here. Check back soon, or follow new notes via",
    rssLabel: "RSS",
    tagsHeading: "No tags yet",
    tagsBody: "Tags appear here once posts or notes are published.",
    goToBlog: "Go to the blog",
    projectsHeading: "No projects published yet",
    projectsBody:
      "Projects will appear here once they are published. In the meantime, see my code on",
    projectsGithub: "GitHub",
    projectsFallback:
      "Projects will appear here once they are published. In the meantime,",
    readTheBlog: "read the blog",
    labHeading: "No experiments published yet",
    labBody:
      "Experiments and prototypes will appear here once they are published. In the meantime,",
  },
  a11y: {
    skipToContent: "Skip to content",
    mainNav: "Main",
    footerNav: "Footer",
    toggleTheme: "Toggle theme",
    rssFeed: "RSS feed",
    searchPlaceholder: "Search posts...",
    noResults: "No results found",
    goToPreviousPage: "Go to previous page",
    goToNextPage: "Go to next page",
    headingLink: "Link to section: {{heading}}",
    socialLink: "{{author}} on {{label}}",
    scrollableTable: "Scrollable table",
    copySuccess: "Code copied to clipboard.",
    copyFailure:
      "Copy failed. The code is selected so you can copy it manually.",
    linkCopySuccess: "Link copied to clipboard.",
    linkCopyFailure:
      "Copy failed. Use your browser's Copy link address option on this link.",
  },
  notFound: {
    title: "404 Not Found",
    message: "404: page not found",
    body: "The link may be old, or the page moved. Try one of these instead:",
  },
} satisfies UIStrings;
