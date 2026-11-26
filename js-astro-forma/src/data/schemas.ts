import { z } from 'zod';

const linkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const menuLinkSchema = linkSchema.extend({
  children: z.array(linkSchema).optional(),
});

const ctaSchema = linkSchema.extend({
  hoverLabel: z.string().min(1).optional(),
});

export const siteSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  locale: z.string().min(2),
});

export const companySchema = z.object({
  fullName: z.string().min(1),
  name: z.string().min(1),
  branding: z.object({
    icon: z.string().min(1),
    font: z.string().min(1),
    tagline: z.string().min(1),
    logoImage: z.string().min(1),
    favicon: z.string().min(1),
    logoSuffix: z.string().min(1),
  }),
  tagline: z.string().min(1),
  email: z.email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  zipCode: z.string().min(1),
  city: z.string().min(1),
  hours: z.string().min(1),
  socials: z.record(z.string(), z.url()),
});

export const seoSchema = z.object({
  defaultTitle: z.string().min(1),
  defaultDescription: z.string().min(1),
  defaultOgImage: z.string().min(1),
  index: z.boolean(),
  follow: z.boolean(),
  analytics: z.object({
    googleAnalyticsId: z.string(),
    googleTagManagerId: z.string(),
    clarityId: z.string(),
  }),
});

export const headerSchema = z.object({
  items: z.array(menuLinkSchema),
  cta: ctaSchema,
  aria: z.object({
    menuOpen: z.string().min(1),
    menuClose: z.string().min(1),
    menuExpand: z.string().min(1),
    navMain: z.string().min(1),
    drawer: z.string().min(1),
  }),
});

export const footerSchema = z.object({
  about: z.string().min(1),
  contactTitle: z.string().min(1),
  copyrightText: z.string().min(1),
  attribution: z.object({
    label: z.string().min(1),
    href: z.url(),
    prefix: z.string().min(1),
    linkLabel: z.string().min(1),
  }),
  aria: z.object({
    quickNav: z.string().min(1),
    legalDocs: z.string().min(1),
  }),
  columns: z.array(
    z.object({
      title: z.string().min(1),
      links: z.array(linkSchema),
    }),
  ),
  legal: z.array(linkSchema),
  newsletter: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    placeholder: z.string().min(1),
    consent: z.string().min(1),
  }),
  promo: z.object({
    tagline: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    ctaLabel: z.string().min(1),
    ctaHref: z.string().min(1),
    imageSrc: z.string().min(1),
    imageAlt: z.string().min(1),
  }),
});

export const breadcrumbsSchema = z.object({
  homeLabel: z.string().min(1),
  ariaLabel: z.string().min(1),
});

export const formMessagesSchema = z.object({
  submitLabel: z.string().min(1),
  submittingLabel: z.string().min(1),
  loadingTitle: z.string().min(1),
  loadingMessage: z.string().min(1),
  successTitle: z.string().min(1),
  errorTitle: z.string().min(1),
  resetLabel: z.string().min(1),
  retryLabel: z.string().min(1),
  successMessage: z.string().min(1),
  errorMessage: z.string().min(1),
  networkError: z.string().min(1),
  privacyNote: z.string().min(1),
  privacyLinkLabel: z.string().min(1),
  privacyHref: z.string().min(1),
  heading: z.string().min(1),
  rodoConsent: z.string().min(1),
  defaultFields: z.array(
    z.object({
      name: z.string().min(1),
      label: z.string().min(1),
      type: z.string().min(1),
      required: z.boolean(),
      placeholder: z.string().min(1),
      autoComplete: z.string().min(1).optional(),
      rows: z.number().int().positive().optional(),
    }),
  ),
});

export const cookieConsentSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  acceptLabel: z.string().min(1),
  essentialLabel: z.string().min(1),
  settingsLabel: z.string().min(1),
  privacyHref: z.string().min(1),
});

export const legalSchema = z.object({
  updatedLabel: z.string().min(1),
  legalBackLabel: z.string().min(1),
  legalFaqTitle: z.string().min(1),
  legalFaqText: z.string().min(1),
  legalContactCta: z.string().min(1),
  legalContactHref: z.string().min(1),
});

export const lightboxSchema = z.object({
  closeLabel: z.string().min(1),
  alt: z.string().min(1),
  prevLabel: z.string().min(1),
  nextLabel: z.string().min(1),
  emptyLabel: z.string().min(1),
});

export const floatingBarSchema = z.object({
  ariaBackToTop: z.string().min(1),
  ariaCall: z.string().min(1),
  ariaEmail: z.string().min(1),
  backToTopLabel: z.string().min(1),
});

export const heroSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  primaryCta: ctaSchema,
  secondaryCta: ctaSchema,
});

export const servicesSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  items: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
    }),
  ),
});

export const testimonialsSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  items: z.array(
    z.object({
      quote: z.string().min(1),
      author: z.string().min(1),
      role: z.string().min(1),
    }),
  ),
});

export const ctaSectionSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  cta: ctaSchema,
});

export const pageSchema = z.object({
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
  tagline: z.string().min(1),
  title: z.string().min(1),
  lead: z.string().min(1),
  sections: z.array(
    z.object({
      heading: z.string().min(1),
      body: z.string().min(1),
    }),
  ),
  cta: ctaSchema.optional(),
});
