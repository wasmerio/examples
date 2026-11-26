/**
 * Everything brand- and location-specific lives here. Change these values and
 * the header, footer, crest, local clock, live weather and meta tags follow.
 * Section copy lives in the components under src/components/.
 */
export const site = {
  name: 'Solenne',
  /** Neighbourhood or district, shown under the logo and in a few headings. */
  place: 'Príncipe Real',
  city: 'Lisbon',
  title: 'Solenne · Boutique hotel in Lisbon',
  description:
    'A family-run townhouse hotel five minutes from the Metro, with easy links to the old town and the airport. Book direct for our best available rate.',
  ogImage:
    'https://images.unsplash.com/photo-1784007686796-bcaaf1044000?auto=format&fit=crop&w=1200&h=630&q=75',
  lang: 'en',
  /** Used by the "now" clock card (IANA time zone) and date formatting. */
  timeZone: 'Europe/Lisbon',
  locale: 'en-GB',
  /** Used by the live weather card (Open-Meteo, no API key needed). */
  latitude: 38.7169,
  longitude: -9.1486,
};
