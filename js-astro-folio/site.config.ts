// ─────────────────────────────────────────────────────────────────────────────
//  site.config.ts  —  THE SINGLE SOURCE OF TRUTH
//
//  This one file holds everything personal: who you are, how to reach you, and
//  all the page copy. Edit it top to bottom and the whole site updates. You
//  should not need to touch anything in src/components or src/layouts.
//
//  Your project case studies live as markdown in src/content/projects/*.md.
//  Blog posts live in src/content/blog/*.md.
//  Your photo is src/assets/portrait.jpeg, your CV is public/cv.pdf.
//  The colour palette lives in src/styles/global.css (see `brand` below).
//
//  Every section marked  ⟵ EDIT  is yours to change.
// ─────────────────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
}

export interface Socials {
  github?: string;
  linkedin?: string;
  // add more keys (bluesky, mastodon, x); SocialLinks renders whatever exists
}

export interface SiteConfig {
  name: string;
  title: string;
  /** One-line positioning statement, used in metadata and the footer. */
  tagline: string;
  location: string;

  email: string;
  /** Formspree form id, the bit after formspree.io/f/. "" disables the form.
   *  This id is PUBLIC by design; it is not a secret, do not paste an API key. */
  formspreeId: string;
  /** Path to the downloadable CV under /public. */
  cvPath: string;

  socials: Socials;
  navItems: NavItem[];

  /** The two brand seeds. The full palette (ramps, dark mode) lives in
   *  src/styles/global.css; keep these in sync with the values there. They are
   *  used for the browser theme-colour and social preview image. */
  brand: { primary: string; accent: string };

  seo: {
    title: string;
    description: string;
    ogImage: string;
    twitter?: string;
  };

  features: {
    themeToggle: boolean;
    contactForm: boolean;
    cvDownload: boolean;
    templateCredit: boolean;
  };

  /** Link back to the template repo (powers the footer "Use this template" hook). */
  templateRepo: string;
}

// ── Identity, contact, brand, SEO, flags ──────────────────────────  ⟵ EDIT
export const site: SiteConfig = {
  name: "Your Name",
  title: "Software Engineer",
  tagline: "A short line about what you build and who you build it for.",
  location: "Your City, Country",

  email: "you@example.com",
  formspreeId: "", // ⟵ create a free form at formspree.io and paste the id here
  cvPath: "/cv.pdf",

  socials: {
    github: "https://github.com/your-username",
    linkedin: "https://www.linkedin.com/in/your-handle",
  },

  navItems: [
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],

  brand: {
    primary: "#34492e", // deep olive  ⟵ change to re-brand (also update src/styles/global.css)
    accent: "#d8aa2f", // mustard gold
  },

  seo: {
    title: "Your Name — Software Engineer",
    description:
      "Portfolio of Your Name, a software engineer. Replace this with a sentence about you.",
    ogImage: "/og-default.png",
  },

  features: {
    themeToggle: true,
    contactForm: true,
    cvDownload: true,
    templateCredit: true,
  },

  templateRepo: "https://github.com/rhyswdev/folio",
};

// ── A value block on the home page ("how I work") ──
export interface ValueProp {
  index: string;
  title: string;
  body: string;
}

// ── A quick-fact row on the About page ──
export interface Fact {
  label: string;
  value: string;
}

// ── A grouped list of skills (no ratings, no bars) ──
export interface SkillGroup {
  title: string;
  items: string[];
}

// ── One row in the experience timeline ──
export interface ExperienceEntry {
  role: string;
  org: string;
  type?: string;
  period: string;
  location: string;
  summary: string;
}

export interface Content {
  home: {
    /** Shown big, in the accent colour, in the hero (defaults to site.name). */
    heroName: string;
    heroEyebrow: string;
    heroHeadline: string;
    heroLead: string;
    intro: string;
    work: { eyebrow: string; title: string; intro: string };
    how: { eyebrow: string; title: string; items: ValueProp[] };
    cta: { title: string; body: string };
  };
  about: {
    lead: string;
    paragraphs: string[];
    closing: string;
    facts: Fact[];
  };
  skills: {
    intro: string;
    groups: SkillGroup[];
    ai: {
      intro: string;
      assisted: { label: string; items: string[]; note: string };
      features: { label: string; items: string[]; note: string };
    };
  };
  experience: ExperienceEntry[];
  education: { institution: string; award: string; period: string; location: string };
  contact: { lead: string; body: string; availability: string; formNote: string };
}

// ── All page copy ─────────────────────────────────────────────────  ⟵ EDIT
export const content: Content = {
  home: {
    heroName: site.name,
    heroEyebrow: "Software Engineer · Your City",
    heroHeadline: "I build things for the web.",
    heroLead:
      "A sentence or two about the kind of work you do and the value you bring. Keep it concrete: what you build, for whom, and what you are good at.",
    intro:
      "A short paragraph introducing yourself. Who you are, what you focus on, and the throughline that ties your work together. Edit all of this in site.config.ts; you should not need to touch a component.",
    work: {
      eyebrow: "Selected work",
      title: "Things I have built",
      intro:
        "A line framing your projects. Replace these example projects with your own markdown files in src/content/projects/.",
    },
    how: {
      eyebrow: "How I work",
      title: "A few principles",
      items: [
        {
          index: "01",
          title: "Ship real things",
          body: "Describe the first thing you care about in your work. A short, concrete sentence beats a list of adjectives.",
        },
        {
          index: "02",
          title: "Own the outcome",
          body: "The second principle. What you take responsibility for, and how you stay accountable for what you build.",
        },
        {
          index: "03",
          title: "Keep it simple",
          body: "The third. Pick something that genuinely describes how you approach a problem, then back it up in the work.",
        },
      ],
    },
    cta: {
      title: "Let us talk",
      body: "A short call to action. Invite people to look at the work and get in touch.",
    },
  },

  about: {
    lead: "A one-line introduction: what you do and where you are based.",
    paragraphs: [
      "A paragraph about your background and how you got here. Where you started, the kinds of problems you have worked on, and the technologies you have spent the most time with. Keep it human and specific.",
      "A second paragraph about how you work now and what you are focused on. This is the place to give a sense of your judgement and your range, with concrete examples rather than buzzwords.",
    ],
    closing:
      "A closing line about what you are looking for, lightly. The kind of role, team or problem that would be a good fit.",
    facts: [
      { label: "Based in", value: "Your City, Country" },
      { label: "Focus", value: "What you specialise in" },
      { label: "Open to", value: "The work you want" },
      { label: "Experience", value: "X years" },
    ],
  },

  skills: {
    intro: "Grouped, not dumped. List what you can genuinely speak to, and leave the rest off.",
    groups: [
      { title: "Languages", items: ["TypeScript", "Python", "SQL"] },
      { title: "Frontend", items: ["React", "Astro", "Tailwind", "CSS"] },
      { title: "Backend & data", items: ["Node", "PostgreSQL", "REST / GraphQL"] },
      { title: "Tools & infra", items: ["Git", "Docker", "CI/CD", "AWS"] },
    ],
    ai: {
      intro: "How I work:",
      assisted: {
        label: "Practices",
        items: ["Testing", "Code review", "Accessibility", "Performance"],
        note: "A note about how you work day to day, and what you hold yourself to.",
      },
      features: {
        label: "Interests",
        items: ["Open source", "Design systems", "Developer tooling"],
        note: "A note about what you care about, or the areas you want to grow in. Edit or remove this block in site.config.ts.",
      },
    },
  },

  experience: [
    {
      role: "Senior Software Engineer",
      org: "Example Company",
      type: "Full-time",
      period: "2023 – present",
      location: "Remote",
      summary:
        "A one or two line summary of what you did here and what you were responsible for. Lead with outcomes.",
    },
    {
      role: "Software Engineer",
      org: "Another Company",
      period: "2020 – 2023",
      location: "Your City",
      summary:
        "Another role. Replace these with your own history, or remove the timeline entirely if you prefer.",
    },
  ],

  education: {
    institution: "Your University",
    award: "BSc Computer Science",
    period: "2016 – 2019",
    location: "Your City",
  },

  contact: {
    lead: "The quickest way to reach me is email. Tell people how you prefer to be contacted.",
    body: "A sentence about what you are open to and how to start a conversation. If you want people to see the work first, point them at it.",
    availability: "Where you are and the hours you keep.",
    formNote: "I reply within a couple of days.",
  },
};

export default site;
