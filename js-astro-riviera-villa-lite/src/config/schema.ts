import { z } from 'astro/zod';
import { FLAG_CODES } from '../i18n/flags.ts';
import { SUPPORTED_LOCALES, type Locale } from '../i18n/locales.ts';

/**
 * Validation rules for `villa.config.ts`.
 * The build stops with a readable message when the config breaks one of them.
 */

const text = z.string().trim().min(1, 'must not be empty');

type LocalizedShape = { [L in Locale]: z.ZodOptional<typeof text> };

/**
 * A text translated field by field: `{ fr: '...', en: '...', it: '...', de: '...' }`.
 * Built from SUPPORTED_LOCALES, so adding a language there makes its key valid here.
 */
export const localizedSchema = z
  .object(Object.fromEntries(SUPPORTED_LOCALES.map((l) => [l, text.optional()])) as LocalizedShape)
  .strict();

const photo = z
  .string()
  .regex(
    /^[A-Za-z0-9_-]+\.(jpe?g|png|webp|avif)$/i,
    'must be a file name from src/assets/photos/ made of letters without accents, digits, - and _ (no space), with a .jpg, .png, .webp or .avif extension, e.g. "pool-view.jpg"',
  );

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'must be a 6-digit hex colour like "#B85C38"');

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'must be a date written YYYY-MM-DD');
const isoMonth = z.string().regex(/^\d{4}-\d{2}$/, 'must be a month written YYYY-MM');
const clockTime = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'must be a time written HH:MM (24 h)');

/**
 * Latitude or longitude with at least 5 decimals (Google requires this precision).
 * Written as a number (43.22134) or as a string ('43.22130') when the last decimal is a 0,
 * which a number would drop. Kept as a string so the precision is never lost.
 */
const coordinate = (min: number, max: number) =>
  z
    .union([z.number(), z.string().trim()])
    .transform((value) => (typeof value === 'number' ? String(value) : value))
    .refine((value) => /^-?\d+(\.\d+)?$/.test(value), { message: 'must be a number like 43.22134' })
    .refine((value) => Number(value) >= min && Number(value) <= max, {
      message: `must be between ${min} and ${max}`,
    })
    .refine((value) => (value.split('.')[1] ?? '').length >= 5, {
      message:
        "needs at least 5 decimals (Google requires this precision). If your value ends with 0, a number drops it: write it as a string, e.g. '43.22130', or copy one more decimal from the map",
    });

const localeEnum = z.enum(SUPPORTED_LOCALES);

/** Amenity names Google understands in VacationRental structured data. */
export const GOOGLE_AMENITIES = [
  'ac',
  'airportShuttle',
  'balcony',
  'beachAccess',
  'childFriendly',
  'crib',
  'elevator',
  'fireplace',
  'freeBreakfast',
  'gymFitnessEquipment',
  'heating',
  'hotTub',
  'instantBookable',
  'ironingBoard',
  'kitchen',
  'microwave',
  'outdoorGrill',
  'ovenStove',
  'patio',
  'petsAllowed',
  'pool',
  'privateBeachAccess',
  'selfCheckinCheckout',
  'smokingAllowed',
  'tv',
  'washerDryer',
  'wheelchairAccessible',
  'wifi',
] as const;

export const ICON_NAMES = [
  'pool',
  'sea',
  'sun',
  'leaf',
  'wifi',
  'ac',
  'kitchen',
  'grill',
  'parking',
  'washer',
  'tv',
  'bed',
  'bath',
  'baby',
  'key',
  'clock',
  'moon',
  'paw',
  'no-smoking',
  'music',
  'people',
  'shield',
  'coffee',
  'wine',
  'car',
  'plane',
  'map',
  'heart',
] as const;

const icon = z.enum(ICON_NAMES);

const seasonSchema = z.object({
  name: localizedSchema,
  /** When the season applies, in words (shown as is). */
  period: localizedSchema,
  /** Price per night in the currency set in `property.currency`. */
  nightly: z.number().positive(),
  minNights: z.number().int().positive(),
  /** Optional: month-day ranges used to warn about the minimum stay in the form, e.g. ["07-01", "08-31"]. */
  ranges: z
    .array(z.tuple([z.string().regex(/^\d{2}-\d{2}$/), z.string().regex(/^\d{2}-\d{2}$/)]))
    .default([]),
  note: localizedSchema.optional(),
});

const reviewSchema = z.object({
  author: text,
  origin: localizedSchema.optional(),
  /** Month the review was published, YYYY-MM. */
  date: isoMonth,
  /** First night of the stay, YYYY-MM-DD (Google asks for it for rentals in France). */
  stayDate: isoDate.optional(),
  rating: z.number().min(1).max(5),
  /** Language the guest wrote in. Reviews are shown as written, not translated. */
  lang: localeEnum.or(z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/)),
  text,
  /** Where the review comes from. Only "direct" reviews may go into Google structured data. */
  source: z.enum(['direct', 'airbnb', 'booking', 'vrbo', 'google', 'other']),
});

const feedSchema = z.object({
  /** Label used in build logs only (never shown to visitors). */
  name: text,
  /**
   * The iCal export link of the platform (https://...). A path to a local .ics file
   * (starting with "./") also works, which the demo uses.
   * Prefer the ICAL_FEEDS environment variable for real links: see README.
   */
  url: text,
});

export const villaSchema = z.object({
  site: z.object({
    /** Public address of the site, without trailing slash. Used for canonical links, sitemap and sharing. */
    url: z.url().transform((u) => u.replace(/\/+$/, '')),
    /** Demo sites only: a line at the bottom of every page saying the villa is fictional. Remove it for a real property. */
    demoNotice: localizedSchema.optional(),
  }),

  languages: z
    .object({
      default: localeEnum,
      active: z.array(localeEnum).min(1),
      /** Flag shown next to a language in the language menu, e.g. { en: 'us' }. Defaults: src/i18n/flags.ts. */
      flags: z.partialRecord(localeEnum, z.enum(FLAG_CODES)).default({}),
    })
    .refine((l) => l.active.includes(l.default), {
      message: 'languages.default must be one of languages.active',
    }),

  features: z
    .object({
      /** Availability calendar synchronised with the iCal links (Pro). */
      calendar: z.boolean().default(true),
      /** VacationRental structured data for Google (Pro). */
      structuredData: z.boolean().default(true),
    })
    .default({ calendar: true, structuredData: true }),

  /** Hide any section by setting it to false. */
  sections: z
    .object({
      house: z.boolean().default(true),
      gallery: z.boolean().default(true),
      bedrooms: z.boolean().default(true),
      amenities: z.boolean().default(true),
      area: z.boolean().default(true),
      rates: z.boolean().default(true),
      reviews: z.boolean().default(true),
      availability: z.boolean().default(true),
      booking: z.boolean().default(true),
      faq: z.boolean().default(true),
      rules: z.boolean().default(true),
    })
    .default({
      house: true,
      gallery: true,
      bedrooms: true,
      amenities: true,
      area: true,
      rates: true,
      reviews: true,
      availability: true,
      booking: true,
      faq: true,
      rules: true,
    }),

  theme: z
    .object({
      colors: z
        .object({
          background: hexColor.default('#F1EDE6'),
          surface: hexColor.default('#FFFFFF'),
          text: hexColor.default('#1E1B18'),
          accent: hexColor.default('#B85C38'),
          /** Colour of the emphasised word in the big title over the photo. */
          heroAccent: hexColor.default('#F3C7A8'),
        })
        .default({
          background: '#F1EDE6',
          surface: '#FFFFFF',
          text: '#1E1B18',
          accent: '#B85C38',
          heroAccent: '#F3C7A8',
        }),
      fonts: z
        .object({
          /** CSS font-family of titles. The font files are imported in src/styles/fonts.css. */
          heading: text.default("'Cormorant Garamond', 'Times New Roman', serif"),
          body: text.default("'Inter', system-ui, sans-serif"),
        })
        .default({
          heading: "'Cormorant Garamond', 'Times New Roman', serif",
          body: "'Inter', system-ui, sans-serif",
        }),
    })
    .default({
      colors: {
        background: '#F1EDE6',
        surface: '#FFFFFF',
        text: '#1E1B18',
        accent: '#B85C38',
        heroAccent: '#F3C7A8',
      },
      fonts: {
        heading: "'Cormorant Garamond', 'Times New Roman', serif",
        body: "'Inter', system-ui, sans-serif",
      },
    }),

  property: z.object({
    name: text,
    /** Stable identifier: never change it, even if the name changes (Google uses it). */
    id: z.string().regex(/^[\w-]+$/, 'letters, digits, - and _ only'),
    /** Google lodging category, e.g. Villa, House, Apartment, Cottage, Chalet, Gite. */
    type: z.enum([
      'Apartment',
      'Bungalow',
      'Cabin',
      'Chalet',
      'Cottage',
      'Gite',
      'HolidayVillageRental',
      'House',
      'Villa',
      'VacationRental',
    ]),
    tagline: localizedSchema,
    address: z.object({
      street: text,
      postalCode: text,
      locality: text,
      region: text,
      /** ISO 3166-1 alpha-2 code, e.g. FR, IT, ES. */
      country: z.string().regex(/^[A-Z]{2}$/),
    }),
    geo: z.object({ latitude: coordinate(-90, 90), longitude: coordinate(-180, 180) }),
    /** IANA time zone of the property, used to read iCal dates. */
    timeZone: text.default('Europe/Paris'),
    currency: z.string().regex(/^[A-Z]{3}$/).default('EUR'),
    capacity: z.object({
      guests: z.number().int().positive(),
      bedrooms: z.number().int().nonnegative(),
      bathrooms: z.number().nonnegative(),
      rooms: z.number().int().positive().optional(),
      areaM2: z.number().positive().optional(),
      beds: z
        .array(
          z.object({
            type: z.enum(['CaliforniaKing', 'King', 'Queen', 'Full', 'Double', 'SemiDouble', 'Single']),
            count: z.number().int().positive(),
          }),
        )
        .default([]),
    }),
    checkIn: clockTime,
    checkOut: clockTime,
    /** Tourist rental registration number (France: loi Le Meur), shown in the footer. Leave empty if none. */
    registrationNumber: z.string().default(''),
  }),

  contact: z.object({
    hostName: text,
    email: z.email(),
    /** Phone number as shown on the site, e.g. "+33 6 12 34 56 78". */
    phone: z.string().default(''),
    /** WhatsApp number in international format, digits only, e.g. "33612345678". Empty hides WhatsApp. */
    whatsapp: z.string().regex(/^\d{8,15}$|^$/, 'digits only, with country code, e.g. 33612345678').default(''),
    /** Languages the host speaks (BCP 47, e.g. "fr-FR"). */
    hostLanguages: z.array(z.string()).default([]),
    responseTime: localizedSchema,
  }),

  booking: z.object({
    /** Form service that emails you the booking requests. "none" shows WhatsApp and email buttons instead. */
    provider: z.enum(['web3forms', 'formspree', 'none']).default('none'),
    /** Web3Forms access key or Formspree form ID. Both are public by design. */
    key: z.string().default(''),
  }),

  calendar: z
    .object({
      feeds: z.array(feedSchema).default([]),
      /** How many months ahead the calendar lets visitors browse. */
      monthsAhead: z.number().int().min(2).max(36).default(18),
      /**
       * Ask /api/availability (Cloudflare Pages function) for fresher dates in the browser.
       * "auto": only when a https:// feed is known at build time. Set true if your links are
       * a Cloudflare secret only, false on hosts without the function.
       */
      liveRefresh: z.union([z.boolean(), z.literal('auto')]).default('auto'),
    })
    .default({ feeds: [], monthsAhead: 18, liveRefresh: 'auto' }),

  seo: z.object({
    title: localizedSchema,
    description: localizedSchema,
    /** Photo used when the page is shared (WhatsApp, Facebook...). */
    shareImage: photo,
    /**
     * Put reviews and the rating in Google structured data. Google forbids marking up ratings copied
     * from other websites (Airbnb, Booking...): only reviews with source "direct" are ever included.
     */
    reviewsInStructuredData: z.boolean().default(false),
  }),

  hero: z.object({
    image: photo,
    imageAlt: localizedSchema,
    /** Small line above the title. */
    eyebrow: localizedSchema,
    /** Big title. Wrap a word in *stars* to set it in italics; a line break starts a new line. */
    title: localizedSchema,
    /** Short words after bedrooms and guests in the line under the booking bar, e.g. "infinity pool". */
    highlight: localizedSchema.optional(),
  }),

  rating: z
    .object({
      value: z.number().min(0).max(5),
      count: z.number().int().nonnegative(),
      /** Where the rating comes from, shown as is ("Airbnb"). Use "direct" for reviews collected yourself. */
      source: text,
    })
    .optional(),

  house: z.object({
    navLabel: localizedSchema,
    title: localizedSchema,
    intro: localizedSchema,
    images: z.tuple([photo, photo]),
    highlights: z.array(z.object({ title: localizedSchema, text: localizedSchema })).min(1).max(6),
    facts: z.array(z.object({ value: localizedSchema, label: localizedSchema })).max(6).default([]),
  }),

  gallery: z
    .array(
      z.object({
        image: photo,
        alt: localizedSchema,
        /** Google wants at least one bedroom, one bathroom and one common-area photo. */
        category: z.enum(['common', 'bedroom', 'bathroom', 'kitchen', 'outdoor', 'pool', 'surroundings']),
      }),
    )
    .min(1),

  bedrooms: z
    .object({
      /** Up to two photos shown next to the list of bedrooms. */
      images: z.array(z.object({ image: photo, alt: localizedSchema })).max(2).default([]),
      rooms: z
        .array(z.object({ name: localizedSchema, beds: localizedSchema, details: localizedSchema }))
        .default([]),
    })
    .default({ images: [], rooms: [] }),

  amenities: z
    .array(
      z.object({
        group: localizedSchema,
        items: z
          .array(
            z.object({
              label: localizedSchema,
              icon: icon.optional(),
              /** Google amenity name, when one matches (pool, wifi, ac...). */
              google: z.enum(GOOGLE_AMENITIES).optional(),
            }),
          )
          .min(1),
      }),
    )
    .default([]),

  area: z.object({
    /** Menu label of the surroundings section, e.g. "The Gulf", "Tuscany", "The village". */
    navLabel: localizedSchema,
    title: localizedSchema,
    intro: localizedSchema,
    /** Two photos of the surroundings: a large one and a smaller one. */
    images: z.tuple([z.object({ image: photo, alt: localizedSchema }), z.object({ image: photo, alt: localizedSchema })]),
    places: z
      .array(
        z.object({
          name: text,
          kind: localizedSchema,
          distance: localizedSchema,
          text: localizedSchema.optional(),
        }),
      )
      .default([]),
  }),

  rates: z.object({
    intro: localizedSchema.optional(),
    seasons: z.array(seasonSchema).min(1),
    extras: z.array(z.object({ label: localizedSchema, value: localizedSchema })).default([]),
    /** Tourist tax, in words (amount, who pays, when). */
    touristTax: localizedSchema,
    payment: localizedSchema,
  }),

  reviews: z.array(reviewSchema).default([]),

  faq: z.array(z.object({ question: localizedSchema, answer: localizedSchema })).default([]),

  rules: z.array(z.object({ title: localizedSchema, text: localizedSchema, icon: icon.optional() })).default([]),

  legal: z.object({
    /**
     * Address of a legal notice already published elsewhere (your company site). When set, the
     * legal page links to it instead of listing the publisher's identity.
     */
    noticeUrl: z.url().optional(),
    /** Person or company publishing the site (owner or agency). */
    publisherName: z.string().default(''),
    publisherStatus: localizedSchema.optional(),
    publisherAddress: z.string().default(''),
    /** Company number (SIRET, VAT...). Empty if none. */
    companyId: z.string().default(''),
    publicationDirector: z.string().default(''),
    hostingProvider: z.object({ name: text, address: text, website: z.url() }),
    /** Last update date of the privacy notice, YYYY-MM-DD. */
    updated: isoDate,
  }),
});

export type VillaInput = z.input<typeof villaSchema>;
export type Villa = z.output<typeof villaSchema>;
export type Localized = z.output<typeof localizedSchema>;
export type IconName = (typeof ICON_NAMES)[number];
export type Season = z.output<typeof seasonSchema>;
export type Review = z.output<typeof reviewSchema>;
