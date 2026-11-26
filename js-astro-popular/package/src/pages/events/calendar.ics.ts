import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildIcs } from '../../lib/ical';
import { absoluteUrl } from '../../lib/url';
import { SITE } from 'popular:config';

/* iCalendar feed: upcoming events plus the last 90 days. Mirrors the Hugo
   events/list.calendar.ics template. */
export const GET: APIRoute = async ({ site }) => {
  const origin = site ?? new URL('https://example.com');
  const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
  const events = (await getCollection('events'))
    .filter((e) => !e.data.draft && +e.data.date >= cutoff)
    .sort((a, b) => +a.data.date - +b.data.date);
  const venues = await getCollection('venues');
  const duration = (SITE as Record<string, any>).events?.defaultDurationMinutes ?? 120;
  const dtstamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const body = buildIcs(
    events.map((e) => {
      const v = e.data.venueRef ? venues.find((x) => x.id === e.data.venueRef) : undefined;
      return {
        title: e.data.title,
        date: e.data.date,
        time: e.data.time,
        description: (e.data.description ?? '').trim(),
        checkin: e.data.checkin,
        cancelled: e.data.cancelled,
        venue: v ? { name: v.data.title, address: v.data.address } : (e.data.venue ? { name: e.data.venue } : undefined),
        permalink: absoluteUrl(`/events/${e.id}/`, origin),
      };
    }),
    { siteTitle: SITE.title, dtstamp, durationMinutes: duration },
  );
  return new Response(body, { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
};
