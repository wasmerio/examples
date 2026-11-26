/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  VILLA CONFIG: the only file you need to edit to make the site yours.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  - Every text visitors read is translated field by field: { fr, en, it, de }.
 *    Keep one line per language. You only need the languages listed in
 *    `languages.active`: the build tells you which translation is missing.
 *  - Photos are file names from `src/assets/photos/` (e.g. 'pool.jpg').
 *  - Wrap a word in *stars* in a title to set it in italics.
 *  - The build checks this file and stops with a clear message if something
 *    is wrong (`npm run build` or `npm run dev`).
 *
 *  The content below is the demo: Villa Calanque is a fictional villa.
 *  Replace it with your property. Help: README.md and docs/help.md.
 */
import { defineVilla } from './src/config/define.ts';

export const villa = defineVilla({
  site: {
    // Public address of the site, without trailing slash.
    url: 'https://villa-calanque.example.com',
    // Demo only. Delete these lines for a real property.
    demoNotice: {
      en: 'Demo site of the Riviera Themes theme. Villa Calanque is fictional: its address, prices, reviews and registration number are made up. Royalty-free photos.',
    },
  },

  languages: {
    // The language of the home page at "/".
    default: 'en',
    active: ['en'],
    // Flag of each language in the language menu. English shows the UK flag; for the US: { en: 'us' }.
    flags: {},
  },

  features: {
    calendar: false, // Pro edition only
    structuredData: false, // Pro edition only
  },

  // Set any section to false to hide it, e.g. faq: false.
  sections: {
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
  },

  theme: {
    colors: {
      background: '#F1EDE6', // page background (cream)
      surface: '#FFFFFF', // cards, menu, booking bar
      text: '#1E1B18',
      accent: '#B85C38', // buttons and links (terracotta)
      heroAccent: '#F3C7A8', // italic word of the big title
    },
    fonts: {
      // Font files are loaded in src/styles/fonts.css (self-hosted, no Google Fonts request).
      heading: "'Cormorant Garamond', 'Times New Roman', serif",
      body: "'Inter', system-ui, sans-serif",
    },
  },

  property: {
    name: 'Villa Calanque',
    // Never change this id once the site is online (Google uses it to recognise the listing).
    id: 'villa-calanque-ramatuelle',
    type: 'Villa',
    tagline: {
      en: 'Villa with an infinity pool facing the sea, in Ramatuelle',
    },
    address: {
      street: 'Chemin des Crêtes (adresse fictive)',
      postalCode: '83350',
      locality: 'Ramatuelle',
      region: 'Provence-Alpes-Côte d’Azur',
      country: 'FR',
    },
    // At least 5 decimals. Right-click the house in Google Maps or OpenStreetMap to copy them.
    // If a value ends with 0, write it as a string so the 0 is kept: '43.22130'.
    geo: { latitude: 43.22134, longitude: 6.63457 },
    timeZone: 'Europe/Paris',
    currency: 'EUR',
    capacity: {
      guests: 8,
      bedrooms: 4,
      bathrooms: 4,
      rooms: 7,
      areaM2: 240,
      beds: [
        { type: 'King', count: 2 },
        { type: 'Queen', count: 1 },
        { type: 'Single', count: 2 },
      ],
    },
    checkIn: '16:00',
    checkOut: '10:00',
    // France: tourist rental registration number (loi Le Meur). Shown in the footer.
    registrationNumber: '83101000123AB',
  },

  contact: {
    hostName: 'Claire et Marc',
    email: 'bonjour@villa-calanque.example.com',
    // Demo numbers from the range French regulator ARCEP keeps for fiction.
    phone: '+33 6 39 98 00 00',
    whatsapp: '33639980000',
    hostLanguages: ['fr-FR', 'en-GB', 'it-IT'],
    responseTime: {
      en: 'Reply within 24 hours',
    },
  },

  booking: {
    // 'web3forms' or 'formspree' to receive requests by email, 'none' for WhatsApp and email buttons only.
    provider: 'web3forms',
    // Web3Forms access key (free at web3forms.com) or Formspree form ID. Empty: WhatsApp and email buttons.
    key: '',
  },


  seo: {
    title: {
      en: 'Villa Calanque · Villa with pool in Ramatuelle, Gulf of Saint-Tropez',
    },
    description: {
      en: 'Book direct a 4-bedroom villa with an infinity pool facing the sea in Ramatuelle, near Saint-Tropez. Sleeps 8, from €650 a night, no booking fees.',
    },
    shareImage: 'hero.jpg',
    // Google forbids marking up ratings copied from Airbnb or Booking.com: keep false unless
    // your reviews are collected on your own site (source: 'direct').
    reviewsInStructuredData: false,
  },

  hero: {
    image: 'hero.jpg',
    imageAlt: {
      en: 'The infinity pool facing the turquoise sea',
    },
    eyebrow: {
      en: 'Villa rental · Ramatuelle, Gulf of Saint-Tropez',
    },
    title: {
      en: 'A villa facing the sea,\nin *Ramatuelle*',
    },
    highlight: {
      en: 'infinity pool',
    },
  },

  // Shown under the booking bar. Remove the block if you have no reviews yet.
  rating: { value: 4.96, count: 38, source: 'Airbnb' },

  house: {
    navLabel: { en: 'The house' },
    title: {
      en: 'Pale stone, linen and *deep blue*',
    },
    intro: {
      en: 'Set on the hills of Ramatuelle, among vineyards and umbrella pines, Villa Calanque looks out over the bay of Pampelonne. Wide glass doors open straight onto the terrace and the pool: here, life happens outdoors, from breakfast to the last glass, when the Camarat lighthouse starts to shine.',
    },
    images: ['living.jpg', 'terrace.jpg'],
    highlights: [
      {
        title: { en: 'The infinity pool' },
        text: {
          en: 'Twelve metres of water, heated from May to October, that seem to spill into the sea. Sun loungers, parasols and an outdoor shower.',
        },
      },
      {
        title: {
          en: 'The terrace and summer kitchen',
        },
        text: {
          en: 'A table for ten under the pergola, a barbecue, a plancha and a summer kitchen for long dinners outdoors.',
        },
      },
      {
        title: { en: 'Four quiet suites' },
        text: {
          en: 'Every bedroom has its own shower room, air conditioning and washed-linen bedding. Two of them open straight onto the garden.',
        },
      },
      {
        title: {
          en: 'Beaches five minutes away',
        },
        text: {
          en: 'Pampelonne, L’Escalet and the coastal path are a few minutes’ drive away, and so is the village of Ramatuelle.',
        },
      },
    ],
    facts: [
      {
        value: { en: '240 m²' },
        label: { en: 'of living space' },
      },
      {
        value: { en: '3,000 m²' },
        label: { en: 'of garden' },
      },
      {
        value: { en: '12 × 5 m' },
        label: { en: 'heated pool' },
      },
      {
        value: { en: '2 km' },
        label: { en: 'to the beach' },
      },
    ],
  },

  // Google asks for at least 8 photos, including a bedroom, a bathroom and a common area.
  gallery: [
    {
      image: 'hero.jpg',
      category: 'pool',
      alt: {
        en: 'The infinity pool facing the turquoise sea',
      },
    },
    {
      image: 'living.jpg',
      category: 'common',
      alt: {
        en: 'The light-filled living room with wide windows onto the sea',
      },
    },
    {
      image: 'terrace.jpg',
      category: 'outdoor',
      alt: {
        en: 'The long table in the shade of the vine-covered pergola',
      },
    },
    {
      image: 'kitchen.jpg',
      category: 'kitchen',
      alt: {
        en: 'The open kitchen and its light-wood dining table',
      },
    },
    {
      image: 'bedroom-1.jpg',
      category: 'bedroom',
      alt: {
        en: 'The master suite in sand tones and white bedding',
      },
    },
    {
      image: 'pool.jpg',
      category: 'pool',
      alt: {
        en: 'The infinity pool, its wooden deck and the pines facing the open sea',
      },
    },
    {
      image: 'bedroom-2.jpg',
      category: 'bedroom',
      alt: {
        en: 'A bright bedroom with a wooden bed and a cane headboard',
      },
    },
    {
      image: 'bathroom.jpg',
      category: 'bathroom',
      alt: {
        en: 'The bathroom with a vintage clawfoot tub and arched French doors',
      },
    },
    {
      image: 'garden.jpg',
      category: 'outdoor',
      alt: {
        en: 'The estate’s olive trees facing the sea',
      },
    },
    {
      image: 'bedroom-3.jpg',
      category: 'bedroom',
      alt: {
        en: 'White sheets in the morning light',
      },
    },
    {
      image: 'exterior.jpg',
      category: 'outdoor',
      alt: {
        en: 'The villa’s white volumes and its pool on the lawn',
      },
    },
    {
      image: 'detail.jpg',
      category: 'outdoor',
      alt: {
        en: 'A white amphora on the terrace, facing the sea',
      },
    },
  ],

  bedrooms: {
    // Two photos shown next to the list of bedrooms.
    images: [
      {
        image: 'bedroom-1.jpg',
        alt: {
          en: 'The master suite in sand tones and white bedding',
        },
      },
      {
        image: 'bedroom-2.jpg',
        alt: {
          en: 'A bright bedroom with a wooden bed and a cane headboard',
        },
      },
    ],
    rooms: [
      {
        name: { en: 'Calanque suite' },
        beds: {
          en: 'King-size bed, 180 × 200 cm',
        },
        details: {
          en: 'En-suite with walk-in shower · sea view · direct access to the terrace',
        },
      },
      {
        name: { en: 'Pine room' },
        beds: {
          en: 'Queen-size bed, 160 × 200 cm',
        },
        details: {
          en: 'Private shower room · opens onto the garden',
        },
      },
      {
        name: { en: 'Camarat room' },
        beds: {
          en: 'King-size bed, 180 × 200 cm',
        },
        details: {
          en: 'Private shower room · balcony over the vineyards',
        },
      },
      {
        name: { en: 'Vineyard room' },
        beds: {
          en: 'Two single beds, 90 × 200 cm',
        },
        details: {
          en: 'Private shower room · ideal for children',
        },
      },
    ],
  },

  // `google` links an amenity to the name Google understands (optional).
  amenities: [
    {
      group: { en: 'Outdoors' },
      items: [
        {
          icon: 'pool',
          google: 'pool',
          label: {
            en: 'Heated infinity pool',
          },
        },
        {
          icon: 'sun',
          google: 'patio',
          label: {
            en: 'Terrace with pergola',
          },
        },
        {
          icon: 'grill',
          google: 'outdoorGrill',
          label: {
            en: 'Summer kitchen, barbecue and plancha',
          },
        },
        {
          icon: 'leaf',
          label: {
            en: 'Olive and lavender garden',
          },
        },
        {
          icon: 'parking',
          label: {
            en: 'Private parking for 3 cars',
          },
        },
      ],
    },
    {
      group: { en: 'Indoors' },
      items: [
        {
          icon: 'kitchen',
          google: 'kitchen',
          label: {
            en: 'Fitted kitchen, oven and dishwasher',
          },
        },
        {
          icon: 'ac',
          google: 'ac',
          label: {
            en: 'Air conditioning in every room',
          },
        },
        {
          icon: 'wifi',
          google: 'wifi',
          label: {
            en: 'Fibre wifi',
          },
        },
        {
          icon: 'tv',
          google: 'tv',
          label: {
            en: 'Smart TV',
          },
        },
        {
          icon: 'washer',
          google: 'washerDryer',
          label: {
            en: 'Washing machine and dryer',
          },
        },
      ],
    },
    {
      group: { en: 'Comfort' },
      items: [
        {
          icon: 'bed',
          label: {
            en: 'Bed linen and towels provided',
          },
        },
        {
          icon: 'sun',
          label: {
            en: 'Beach and pool towels',
          },
        },
        {
          icon: 'baby',
          google: 'crib',
          label: {
            en: 'Baby cot and high chair',
          },
        },
        {
          icon: 'coffee',
          label: {
            en: 'Espresso machine',
          },
        },
      ],
    },
    {
      group: { en: 'Services' },
      items: [
        {
          icon: 'key',
          label: {
            en: 'Personal welcome on arrival',
          },
        },
        {
          icon: 'shield',
          label: {
            en: 'Mid-stay cleaning on request',
          },
        },
        {
          icon: 'wine',
          label: {
            en: 'Private chef on request',
          },
        },
        {
          icon: 'sea',
          label: {
            en: 'Boat hire arranged for you',
          },
        },
      ],
    },
  ],

  area: {
    navLabel: { en: 'The Gulf' },
    title: {
      en: 'The Gulf of *Saint-Tropez*, the quiet side',
    },
    intro: {
      en: 'Ramatuelle keeps its flowered lanes and vineyards, away from the bustle of Saint-Tropez. The market in the morning, the sand of Pampelonne in the afternoon, the squares of Gassin at night: everything is less than twenty minutes away.',
    },
    images: [
      {
        image: 'beach.jpg',
        alt: {
          en: 'White sand beach and turquoise water near Saint-Tropez',
        },
      },
      {
        image: 'village.jpg',
        alt: {
          en: 'Saint-Tropez, its bell tower and the gulf seen from the hill',
        },
      },
    ],
    places: [
      {
        name: 'Plage de Pampelonne',
        kind: { en: 'Sandy beach' },
        distance: { en: '2 km · 5 min' },
      },
      {
        name: 'Ramatuelle',
        kind: { en: 'Hilltop village' },
        distance: { en: '2.5 km · 6 min' },
      },
      {
        name: 'Plage de l’Escalet',
        kind: { en: 'Rocky cove' },
        distance: { en: '5 km · 10 min' },
      },
      {
        name: 'Gassin',
        kind: { en: 'Hilltop village' },
        distance: { en: '8 km · 15 min' },
      },
      {
        name: 'Saint-Tropez',
        kind: { en: 'Harbour and market' },
        distance: { en: '10 km · 20 min' },
      },
      {
        name: 'Toulon-Hyères',
        kind: { en: 'Airport' },
        distance: { en: '55 km · 1 hr' },
      },
      {
        name: 'Nice Côte d’Azur',
        kind: { en: 'Airport' },
        distance: { en: '105 km · 1 hr 30' },
      },
    ],
  },

  rates: {
    intro: {
      en: 'Prices for the whole house, up to 8 guests, linen included.',
    },
    seasons: [
      {
        name: { en: 'Low season' },
        period: {
          en: 'November to April, holidays excluded',
        },
        nightly: 650,
        minNights: 3,
        ranges: [
          ['11-01', '12-19'],
          ['01-04', '04-30'],
        ],
      },
      {
        name: { en: 'Mid season' },
        period: {
          en: 'May, June, September and October',
        },
        nightly: 950,
        minNights: 5,
        ranges: [
          ['05-01', '06-30'],
          ['09-01', '10-31'],
        ],
      },
      {
        name: { en: 'High season' },
        period: { en: 'July and August' },
        nightly: 1450,
        minNights: 7,
        ranges: [['07-01', '08-31']],
        note: {
          en: 'Saturday to Saturday.',
        },
      },
      {
        name: { en: 'Christmas and New Year' },
        period: {
          en: '20 December to 3 January',
        },
        nightly: 1100,
        minNights: 5,
        ranges: [['12-20', '01-03']],
      },
    ],
    extras: [
      {
        label: { en: 'Final cleaning' },
        value: { en: '€350' },
      },
      {
        label: { en: 'Security deposit' },
        value: {
          en: '€3,000, returned after departure',
        },
      },
      {
        label: { en: 'Baby cot and high chair' },
        value: { en: 'Free' },
      },
      {
        label: { en: 'Dog (on request)' },
        value: { en: '€100 per stay' },
      },
    ],
    touristTax: {
      en: 'Set by the town, about €3 per adult per night, added to the balance. Free for under-18s.',
    },
    payment: {
      en: '30% when booking, the balance 30 days before arrival, by bank transfer or card. Free cancellation up to 60 days before arrival.',
    },
  },

  // Reviews are shown as the guests wrote them, in their own language.
  reviews: [
    {
      author: 'Claire D.',
      origin: { en: 'Lyon, France' },
      date: '2026-08',
      stayDate: '2026-08-08',
      rating: 5,
      lang: 'fr',
      source: 'airbnb',
      text: 'Une maison encore plus belle que sur les photos. La piscine face à la mer au réveil, les dîners sous la pergola, les plages à cinq minutes : nous avons déjà réservé l’été prochain.',
    },
    {
      author: 'James W.',
      origin: { en: 'London, United Kingdom' },
      date: '2026-07',
      stayDate: '2026-07-11',
      rating: 5,
      lang: 'en',
      source: 'airbnb',
      text: 'A beautifully designed house with a view you never tire of. Spotless, calm, and the owners’ restaurant tips were spot on. Perfect for our two families.',
    },
    {
      author: 'Giulia R.',
      origin: { en: 'Milan, Italy' },
      date: '2026-06',
      stayDate: '2026-06-13',
      rating: 5,
      lang: 'it',
      source: 'airbnb',
      text: 'Villa curatissima, camere fresche e silenziose, terrazza meravigliosa. Proprietari gentilissimi e sempre disponibili. Torneremo di sicuro!',
    },
    {
      author: 'Familie Becker',
      origin: { en: 'Munich, Germany' },
      date: '2026-09',
      stayDate: '2026-09-05',
      rating: 5,
      lang: 'de',
      source: 'airbnb',
      text: 'Ein traumhaftes Haus für unsere Familie mit drei Kindern. Der Pool ist ein Erlebnis, die Küche bestens ausgestattet und Pampelonne in wenigen Minuten erreichbar.',
    },
  ],

  faq: [
    {
      question: {
        en: 'How does booking direct work?',
      },
      answer: {
        en: 'Send your request with your dates. We reply within 24 hours with a quote and a rental agreement. Your booking is confirmed once we receive the 30% deposit.',
      },
    },
    {
      question: {
        en: 'Why is it cheaper than booking through a platform?',
      },
      answer: {
        en: 'Platforms add service fees on top of the rental price. When you book direct, you only pay for the stay, the cleaning and the tourist tax.',
      },
    },
    {
      question: {
        en: 'Is the pool safe for children?',
      },
      answer: {
        en: 'Yes. It has a pool alarm, and a removable fence can be put up before you arrive.',
      },
    },
    {
      question: {
        en: 'Do we need a car?',
      },
      answer: {
        en: 'It is best: the house sits on the hills, 2 km from the beach. The private car park holds three cars.',
      },
    },
    {
      question: {
        en: 'Can we arrive late in the evening?',
      },
      answer: {
        en: 'Yes. We welcome you from 4 pm. After 8 pm, a key box is waiting for you with all the instructions.',
      },
    },
    {
      question: {
        en: 'Is the house open all year round?',
      },
      answer: {
        en: 'Yes, and it is heated in winter. Outside July and August, you can arrive on any day of the week.',
      },
    },
  ],

  rules: [
    {
      icon: 'clock',
      title: { en: 'Times' },
      text: {
        en: 'Check-in from 4 pm, check-out by 10 am.',
      },
    },
    {
      icon: 'people',
      title: { en: '8 guests at most' },
      text: {
        en: 'Friends are welcome during the day, with our agreement.',
      },
    },
    {
      icon: 'music',
      title: { en: 'No parties' },
      text: {
        en: 'No parties or events, out of respect for the neighbours. Quiet after 10 pm.',
      },
    },
    {
      icon: 'no-smoking',
      title: { en: 'No smoking' },
      text: {
        en: 'No smoking indoors. Ashtrays are waiting for you on the terrace.',
      },
    },
    {
      icon: 'paw',
      title: { en: 'Pets on request' },
      text: {
        en: 'One calm dog is welcome with our agreement.',
      },
    },
    {
      icon: 'shield',
      title: { en: 'Security deposit' },
      text: {
        en: '€3,000 held on your card, released within 7 days of departure.',
      },
    },
  ],

  // Legal notice and privacy pages (/legal/, /privacy/). Fill in your details: until then the
  // pages show "[to complete]". Or set noticeUrl to a legal notice you already publish elsewhere.
  // These pages are templates, not legal advice: have them checked for your country.
  legal: {
    // noticeUrl: 'https://your-company.example/legal-notice',
    publisherName: '', // owner or company publishing the site
    publisherAddress: '',
    companyId: '', // company number (SIRET, VAT...), empty if none
    publicationDirector: '',
    hostingProvider: {
      name: 'Cloudflare, Inc.',
      address: '101 Townsend St, San Francisco, CA 94107, USA',
      website: 'https://www.cloudflare.com',
    },
    updated: '2026-11-01',
  },
});
