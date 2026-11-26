/**
 * Shoal: the one file to edit when you rebrand the theme.
 *
 * Everything here is sample data for a fictional agent in a fictional group of islands.
 * Phone numbers use the 555-01xx range reserved for fiction, and every email and URL uses example.com.
 */

export interface Tile {
  title: string;
  href: string;
  /** File in public/img. */
  image: string;
  alt: string;
}

export interface Area {
  slug: string;
  name: string;
  /** One line under the photo on the home page. */
  blurb: string;
  image: string;
  alt: string;
  /** Area page: a few short paragraphs. */
  body: string[];
  facts: Array<{ label: string; value: string }>;
}

export interface Note {
  slug: string;
  title: string;
  /** Shown on the card and as the page description. */
  summary: string;
  category: string;
  /** ISO date. */
  date: string;
  image: string;
  alt: string;
  body: string[];
}

export const SITE = {
  name: "Dana Whitlock",
  tagline: "Island Real Estate",
  /** The brokerage shown in the footer. */
  brokerage: "Kestrel Sound Realty",
  description:
    "Dana Whitlock sells and finds homes on the Kestrel Sound islands: Brannock Island, Teal Harbor, Fennick Island and Larkspur Point. Waterfront, year-round and second homes.",
  /** Your production URL. Used for canonical links, Open Graph, the sitemap and the form redirect. */
  url: "https://example.com",
  lang: "en",
  locale: "en_US",

  phone: { display: "(555) 555-0142", tel: "+15555550142" },
  email: "dana@example.com",
  address: { street: "14 Ferry Street", city: "Teal Harbor", region: "WA", postalCode: "98000", country: "US" },
  areaServed: "Brannock Island, Teal Harbor, Fennick Island and Larkspur Point",

  /** Root domains only: replace them with your own profile URLs. */
  social: [
    { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
    { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
  ],

  /**
   * Contact form. PUBLIC_FORMGONG_ACCESS_KEY in .env wins over `accessKey`.
   * The key (fk_…) is public by design: it only lets visitors send submissions to your form.
   */
  formgong: {
    accessKey: "fk_your_access_key",
    endpoint: "https://formgong.com/submit",
    subject: "New enquiry from the website",
    /** The small "Form by Formgong" line under the submit button. Set to false to hide it. */
    credit: true,
  },

  nav: [
    { label: "Buying", href: "/buying/" },
    { label: "Selling", href: "/selling/" },
    { label: "Areas", href: "/#areas" },
    { label: "Notes", href: "/#notes" },
  ],

  hero: { image: "hero.webp", alt: "Boats leaving white wakes between small wooded islands, seen from above" },

  servicesTitle: "Explore Dana's Services",
  tiles: [
    { title: "Meet Dana", href: "/about/", image: "tile-kitchen.webp", alt: "A bright kitchen with a white island, two stools and woven pendant lights" },
    { title: "Buying", href: "/buying/", image: "tile-living.webp", alt: "A living room with a round fireplace and glass walls looking over the water" },
    { title: "Selling", href: "/selling/", image: "tile-aerial.webp", alt: "A house among trees on the shore of a blue lake, seen from above" },
    { title: "Second Homes", href: "/buying/#second-homes", image: "tile-porch.webp", alt: "Two wooden chairs under pine trees above a lake" },
    { title: "Client Stories", href: "/about/#stories", image: "tile-dining.webp", alt: "A round dining table under a window with a view of the water" },
    { title: "Moving Help", href: "/selling/#moving", image: "tile-entry.webp", alt: "An entry hall with a wooden bench, cushions and two forest prints" },
  ] as Tile[],

  meet: {
    pretitle: "Meet",
    text: "Dana grew up on Brannock Island and has sold homes on the Kestrel Sound islands for nineteen years. She knows which roads wash out in March, which wells run low in August and which ferry the commuters really catch.",
    image: "agent.webp",
    alt: "A hand holding a house key at an open front door",
  },

  areasTitle: "Islands",
  areasIntro: "Four islands, four ways of living. Read the guide before you book a viewing.",
  areas: [
    {
      slug: "teal-harbor",
      name: "Teal Harbor",
      blurb: "The island town: school, clinic and the busiest ferry dock.",
      image: "area-harbor.webp",
      alt: "Sailboats and motor yachts in a calm marina at dusk",
      body: [
        "Teal Harbor is where the islands do their errands. The marina, the clinic, the K–8 school and the Saturday market are all within a ten-minute walk of the ferry dock.",
        "Most homes are 1920s cottages and 1990s family houses on small lots. Waterfront here usually means a view across the marina rather than a private beach.",
        "Buyers who work on the mainland like it because the first ferry leaves at 5:40 and the walk from the door to the dock is short.",
      ],
      facts: [
        { label: "Ferry to the mainland", value: "35 minutes" },
        { label: "Typical home", value: "3-bed cottage on a 5,000 sq ft lot" },
        { label: "Good for", value: "Year-round living, families, commuters" },
      ],
    },
    {
      slug: "brannock-island",
      name: "Brannock Island",
      blurb: "Forest, farms and long gravel roads. Quiet all winter.",
      image: "area-ferry.webp",
      alt: "A ferry entering the harbour between two stone breakwaters",
      body: [
        "Brannock is the biggest island and the least built up. Many properties are five acres or more, with wells and septic systems, so inspections matter more than the listing photos.",
        "The north shore has the sunsets and the steep driveways. The south end has the farms, the flat land and the best soil for a garden.",
        "Internet is good along the main road and patchy in the hills. Ask for a speed test before you fall in love with a view.",
      ],
      facts: [
        { label: "Ferry to the mainland", value: "50 minutes" },
        { label: "Typical home", value: "Farmhouse or cabin on 5+ acres" },
        { label: "Good for", value: "Space, gardens, working from home" },
      ],
    },
    {
      slug: "larkspur-point",
      name: "Larkspur Point",
      blurb: "The lighthouse, rocky shore and the deepest moorage.",
      image: "area-lighthouse.webp",
      alt: "A red and white lighthouse on a cliff above the sea",
      body: [
        "Larkspur Point is a peninsula at the south end of Fennick Island, joined to it by a single causeway. Its rocky shore and deep water make it the place for boat owners.",
        "Homes are few and change hands rarely. Most sales happen before they are listed, so tell me early if this is the place you want.",
        "Wind is part of the deal. Houses here are built low, with storm shutters, and the gardens are grass and rock.",
      ],
      facts: [
        { label: "Ferry to the mainland", value: "45 minutes via Fennick" },
        { label: "Typical home", value: "Waterfront house with deep-water moorage" },
        { label: "Good for", value: "Boat owners, people who like weather" },
      ],
    },
    {
      slug: "fennick-island",
      name: "Fennick Island",
      blurb: "Sea thrift on the bluffs, pebble beaches, open water.",
      image: "area-meadow.webp",
      alt: "Pink sea thrift on a cliff above the ocean",
      body: [
        "Fennick faces east, towards the mountains, and its bluffs are covered in wildflowers from May to July. Many homes here are second homes that the owners let in summer.",
        "The bluffs are beautiful and they move. Before buying near the edge, read the geotechnical report and ask how far the bank has retreated in the last twenty years.",
        "Beach access is public at four points, so a home a street back from the water often costs half as much and loses little.",
      ],
      facts: [
        { label: "Ferry to the mainland", value: "40 minutes" },
        { label: "Typical home", value: "Bluff-top house or beach cabin" },
        { label: "Good for", value: "Second homes, summer rentals, retirement" },
      ],
    },
  ] as Area[],

  notesTitle: "Notes",
  notesIntro: "Short, practical notes on buying and selling on the islands: ferries, wells, bluffs and paperwork.",
  notes: [
    {
      slug: "ferry-schedule-and-house-prices",
      title: "How the ferry schedule shows up in house prices",
      summary: "Why a house ten minutes from the first boat can cost more than a bigger one with a better view.",
      category: "Buying",
      date: "2026-09-18",
      image: "blog-ferry.webp",
      alt: "A ferry crossing the sound at dusk",
      body: [
        "On the islands, distance is measured in sailings, not miles. A buyer who commutes to the mainland three days a week will pay for a house that makes the 5:40 boat without a car.",
        "Look at the sold prices of the last two years and you will see it: homes within a ten-minute walk of the Teal Harbor dock sell for more per square foot than larger homes on Brannock's north shore.",
        "If you do not commute, that premium is money you can keep. If you do, check the winter schedule, not the summer one. It has fewer boats.",
      ],
    },
    {
      slug: "inspecting-an-island-home",
      title: "What an island home inspection should cover",
      summary: "Wells, septic systems, bluffs and salt air: the four checks that a mainland inspector may skip.",
      category: "Inspections",
      date: "2026-08-27",
      image: "blog-inspection.webp",
      alt: "A small wooden house model next to a magnifying glass",
      body: [
        "A general inspection is a good start. On the islands, add four checks: a well flow and water quality test, a septic inspection with a pump-out, a bluff report for any home near a bank, and a look at metal that salt air has eaten.",
        "The well test is the one buyers skip most often and regret most. A shared well needs a written agreement; ask to see it before you make an offer.",
        "Book inspectors early in summer. There are few of them, and they work on ferry time too.",
      ],
    },
    {
      slug: "selling-in-the-off-season",
      title: "Selling in the off-season",
      summary: "Fewer buyers come in November, but the ones who come are serious. How to price and show a home in winter.",
      category: "Selling",
      date: "2026-07-30",
      image: "blog-market.webp",
      alt: "A pile of red apples",
      body: [
        "Summer brings visitors who fall for the islands on a sunny day. Winter brings people who have already decided to move. They make fewer offers, and fewer of those offers fall through.",
        "Show the house the way it will be lived in: heat on, lamps lit, firewood stacked, the drive clear. Photograph it on the one clear day of the week, even if you wait for it.",
        "Price for the market you are in, not for July. A winter listing that sits for two months looks stale by spring.",
      ],
    },
  ] as Note[],

  cta: {
    title: "Work With Dana",
    text: "From the first viewing to the day you get the keys, you will know what is happening and why. Calls are answered the same day.",
    image: "cta.webp",
    alt: "A white two-storey house with a front porch",
  },

  footerText:
    "Island homes are wonderful to live in and complicated to buy: wells, bluffs, shared roads and ferry schedules. Dana makes sure you understand each of them before you sign.",
  disclaimer:
    "Dana Whitlock is a fictional real estate agent created for the Shoal theme demo. Kestrel Sound, its islands and every listing on this site are fictional. Information on this site is for illustration only.",
} as const;

export type SiteConfig = typeof SITE;
