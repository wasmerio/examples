export interface UIStrings {
  nav: {
    home: string;
    blog: string;
    notes: string;
    projects: string;
    lab: string;
    about: string;
    tags: string;
    search: string;
  };
  content: {
    typePost: string;
    typeNote: string;
    typeProject: string;
  };
  og: {
    imageAlt: string;
  };
  related: {
    title: string;
  };
  project: {
    status: {
      active: string;
      maintained: string;
      experiment: string;
      archived: string;
    };
    stack: string;
    links: string;
    relatedPosts: string;
    source: string;
    docs: string;
    website: string;
  };
  post: {
    publishedAt: string;
    updatedAt: string;
    /** `{{minutes}}` is replaced with the rounded-up reading time. */
    readingTime: string;
    draft: string;
    /** No-JS and no-clipboard label of the copy-link control. */
    permalink: string;
    copyLink: string;
    linkCopied: string;
    alsoOn: string;
    tagLabel: string;
    backToTop: string;
    /** Optional until v8, so older locale files still type-check. */
    tableOfContents?: string;
    goBack: string;
    editPage: string;
    previousPost: string;
    nextPost: string;
    copyCode: string;
    copied: string;
    copyFailed: string;
    /** Code-block button text after a failed copy (the code is selected). */
    copyCodeFailed: string;
    /** Dev-only notice above the body of a draft. */
    draftNotice: string;
    /** Block label of the inline table of contents. */
    contentsLabel: string;
  };
  pagination: {
    prev: string;
    next: string;
    page: string;
    /** `{{current}}` and `{{last}}` are page numbers. */
    status: string;
  };
  home: {
    writing: string;
    archive: string;
    projects: string;
    allProjects: string;
    specialties: string;
  };
  about: {
    contactCta: string;
  };
  contact: {
    methods: string;
    noMethods: string;
  };
  footer: {
    contact: string;
    rss: string;
    source: string;
    /** Text before the linked theme name, e.g. "powered by". */
    poweredBy: string;
    /** Accessible name of the 88x31 badge list. */
    elsewhere: string;
  };
  pages: {
    tagTitle: string;
    tagDesc: string;

    tagsTitle: string;
    tagsDesc: string;
    /** Accessible name of a tag's entry count; `{{count}}` is the number. */
    tagCount: string;

    postsTitle: string;
    postsDesc: string;

    notesTitle: string;
    notesDesc: string;

    projectsTitle: string;
    projectsDesc: string;

    labTitle: string;
    labDesc: string;

    searchTitle: string;
    searchDesc: string;
  };
  search: {
    /** Plain text: Pagefind renders its `error_search` translation as text. */
    errorLoad: string;
    /** `{{blog}}`, `{{notes}}` and `{{projects}}` are replaced with links. */
    noscript: string;
    blog: string;
    notes: string;
    projects: string;
    /** Shown instead of the search input while nothing is published. */
    empty: string;
    /** Follows `empty`; `{{blog}}`, `{{notes}}` and `{{projects}}` become links. */
    emptyBrowse: string;
  };
  empty: {
    postsHeading: string;
    /** Ends without a period: the RSS link and the closing "." follow it. */
    postsBody: string;
    notesHeading: string;
    /** Ends without a period: the RSS link and the closing "." follow it. */
    notesBody: string;
    rssLabel: string;
    tagsHeading: string;
    tagsBody: string;
    goToBlog: string;
    projectsHeading: string;
    /** Ends without a period: the GitHub link and the closing "." follow it. */
    projectsBody: string;
    projectsGithub: string;
    /** Ends without a period: the blog link and the closing "." follow it. */
    projectsFallback: string;
    readTheBlog: string;
    labHeading: string;
    /** Ends without a period: the blog link and the closing "." follow it. */
    labBody: string;
  };
  a11y: {
    skipToContent: string;
    mainNav: string;
    footerNav: string;
    toggleTheme: string;
    rssFeed: string;
    searchPlaceholder: string;
    noResults: string;
    goToPreviousPage: string;
    goToNextPage: string;
    /** `{{heading}}` is replaced with the heading text. */
    headingLink: string;
    /** `{{author}}` and `{{label}}` are replaced, e.g. "Ada Lovelace on GitHub". */
    socialLink: string;
    scrollableTable: string;
    copySuccess: string;
    copyFailure: string;
    linkCopySuccess: string;
    linkCopyFailure: string;
  };
  notFound: {
    title: string;
    message: string;
    /** Sentence above the list of suggested pages. */
    body: string;
  };
}
