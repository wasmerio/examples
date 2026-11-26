import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { absoluteUrl } from '../lib/url';
import { SITE } from 'popular:config';

/* §8 llms.txt: a build-time plain-text summary for AI agents. Names the next
   upcoming event (regenerated every build so it stays true), how to join, and
   links to the key pages and the calendar feed. Mirrors Hugo's
   layouts/index.llms.txt. Always generated (SEO/discovery plumbing, like
   robots.txt). */
export const GET: APIRoute = async ({ site }) => {
  const abs = (p: string) => absoluteUrl(p, site);
  const now = Date.now();

  const events = (await getCollection('events'))
    .filter((e) => !e.data.draft)
    .sort((a, b) => +a.data.date - +b.data.date);
  const next = events.find((e) => +e.data.date >= now);

  const pageIds = new Set((await getCollection('pages')).map((p) => p.id));
  const chat = (SITE as Record<string, any>).community?.chat as { url: string; label?: string } | undefined;
  const talksOn = (SITE as Record<string, any>).talks === true;
  const fmt = (d: Date) =>
    d.toLocaleDateString(SITE.locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const lines: string[] = [`# ${SITE.title}`, ''];
  if (SITE.description) lines.push(SITE.description, '');
  lines.push(
    next
      ? `Next event: ${next.data.title} on ${fmt(next.data.date)}${next.data.time ? `, ${next.data.time}` : ''} (${abs(`/events/${next.id}/`)})`
      : 'No upcoming events are scheduled right now.',
    '',
  );
  if (chat) lines.push(`Join the community chat: ${abs(chat.url)}`, '');
  lines.push('## Links');
  if (pageIds.has('start')) lines.push(`Start here (newcomers): ${abs('/start/')}`);
  if (pageIds.has('about')) lines.push(`About and FAQ: ${abs('/about/')}`);
  lines.push(`Events: ${abs('/events/')}`);
  lines.push(`Calendar feed (iCalendar): ${abs('/events/calendar.ics')}`);
  if (talksOn) lines.push(`Talk archive: ${abs('/talks/')}`);
  lines.push('', 'Built with the Popular theme.');

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
