/** Event JSON-LD helpers, mirroring partials/jsonld-event.html.
 *  The time-parsing contract and its vectors live in PARITY.md; the Hugo and
 *  Astro implementations must agree on every vector. */

/** Parse an event `time` free-text field to event-local "HH:MM", or null.
 *  Leading token only: "6:00 PM · doors 5:30" -> "18:00"; "doors 5:30" -> null. */
export function parseEventTime(raw: string | undefined): string | null {
  const m = (raw ?? '').trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)?/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const mer = m[3]?.toLowerCase();
  if (mer) {
    if (h < 1 || h > 12) return null;
    if (mer === 'pm' && h < 12) h += 12;
    if (mer === 'am' && h === 12) h = 0;
  } else if (h > 23) {
    return null;
  }
  if (min > 59) return null;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

/** startDate = YYYY-MM-DD, or YYYY-MM-DDTHH:MM when a leading time parses. */
export function eventStartDate(date: Date, time: string | undefined): string {
  const day = date.toISOString().slice(0, 10);
  const hm = parseEventTime(time);
  return hm ? `${day}T${hm}` : day;
}

/** Recursively key-sort so output matches Hugo's jsonify (sorted, no spaces). */
function sortKeys(v: any): any {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortKeys(v[k])]));
  }
  return v;
}
export function jsonld(obj: Record<string, any>): string {
  return JSON.stringify(sortKeys(obj));
}

export interface EventLdInput {
  title: string;
  date: Date;
  time?: string;
  description?: string;
  cancelled?: boolean;
  online?: boolean;
  price?: number | string;
  currency?: string;
  cost?: string;
  image?: string;
  rsvp?: string;
  permalink: string;
  siteUrl: string;
  siteTitle: string;
  defaultCurrency: string;
  venue?: { name: string; address?: string };
  performers?: string[];
}

export function buildEventLd(i: EventLdInput): Record<string, any> {
  const ld: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: i.title,
    startDate: eventStartDate(i.date, i.time),
    eventStatus: i.cancelled ? 'https://schema.org/EventCancelled' : 'https://schema.org/EventScheduled',
    eventAttendanceMode: i.online
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    organizer: { '@type': 'Organization', name: i.siteTitle, url: i.siteUrl },
  };
  const desc = (i.description ?? '').trim();
  if (desc) ld.description = desc.length > 300 ? desc.slice(0, 299) + '…' : desc;
  if (i.online) {
    ld.location = { '@type': 'VirtualLocation', url: i.rsvp || i.permalink };
  } else if (i.venue) {
    ld.location = { '@type': 'Place', name: i.venue.name };
    if (i.venue.address) ld.location.address = i.venue.address;
  }
  if (i.image) ld.image = i.image;
  if (i.performers && i.performers.length) {
    ld.performer = i.performers.map((name) => ({ '@type': 'Person', name }));
  }
  if (i.price !== undefined && i.price !== '') {
    ld.isAccessibleForFree = false;
    ld.offers = { '@type': 'Offer', price: String(i.price), priceCurrency: i.currency || i.defaultCurrency, availability: 'https://schema.org/InStock', url: i.permalink };
  } else if (!i.cost) {
    ld.isAccessibleForFree = true;
    ld.offers = { '@type': 'Offer', price: '0', priceCurrency: i.defaultCurrency, availability: 'https://schema.org/InStock', url: i.permalink };
  }
  return ld;
}
