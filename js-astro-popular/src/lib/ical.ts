/** iCalendar feed helpers, mirroring the Hugo events/list.calendar.ics
 *  template. DTSTART reuses parseEventTime (lib/eventld) so the feed and the
 *  Event JSON-LD agree. Folding is byte-accurate at 75 octets. */
import { parseEventTime } from './eventld';

const pad = (n: number) => String(n).padStart(2, '0');
const enc = new TextEncoder();

function ymd(d: Date): string {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
}

export function icsEscape(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

/** One content line, CRLF-terminated, folded at 75 octets (continuations
 *  begin with a space, which counts toward the limit). */
export function fold(line: string): string {
  if (enc.encode(line).length <= 75) return line + '\r\n';
  let out = '';
  let cur = '';
  let curBytes = 0;
  let first = true;
  for (const ch of line) {
    const cb = enc.encode(ch).length;
    const limit = first ? 75 : 74;
    if (curBytes + cb > limit) {
      out += (first ? '' : ' ') + cur + '\r\n';
      first = false;
      cur = ch;
      curBytes = cb;
    } else {
      cur += ch;
      curBytes += cb;
    }
  }
  out += (first ? '' : ' ') + cur + '\r\n';
  return out;
}

export interface IcsEvent {
  title: string;
  date: Date;
  time?: string;
  description?: string;
  checkin?: string;
  cancelled?: boolean;
  venue?: { name: string; address?: string };
  permalink: string;
}

export function buildIcs(
  events: IcsEvent[],
  opts: { siteTitle: string; dtstamp: string; durationMinutes: number },
): string {
  const L: string[] = [];
  L.push(fold('BEGIN:VCALENDAR'));
  L.push(fold('VERSION:2.0'));
  L.push(fold(`PRODID:-//${icsEscape(opts.siteTitle)}//Popular theme//EN`));
  L.push(fold('CALSCALE:GREGORIAN'));
  L.push(fold('METHOD:PUBLISH'));
  L.push(fold(`X-WR-CALNAME:${icsEscape(opts.siteTitle)} events`));
  /* Subscription refresh hints (RFC 7986 + the Apple/Outlook legacy twin).
     Google Calendar ignores both and polls on its own schedule. */
  L.push(fold('REFRESH-INTERVAL;VALUE=DURATION:PT12H'));
  L.push(fold('X-PUBLISHED-TTL:PT12H'));
  for (const e of events) {
    L.push(fold('BEGIN:VEVENT'));
    L.push(fold(`UID:${e.permalink}`));
    L.push(fold(`DTSTAMP:${opts.dtstamp}`));
    const hm = parseEventTime(e.time);
    if (hm) {
      const [h, m] = hm.split(':').map(Number);
      L.push(fold(`DTSTART:${ymd(e.date)}T${pad(h)}${pad(m)}00`));
      const total = h * 60 + m + opts.durationMinutes;
      const end = new Date(Date.UTC(e.date.getUTCFullYear(), e.date.getUTCMonth(), e.date.getUTCDate()) + total * 60000);
      L.push(fold(`DTEND:${ymd(end)}T${pad(end.getUTCHours())}${pad(end.getUTCMinutes())}00`));
    } else {
      L.push(fold(`DTSTART;VALUE=DATE:${ymd(e.date)}`));
    }
    L.push(fold(`SUMMARY:${icsEscape(e.title)}`));
    if (e.venue) {
      const loc = e.venue.address ? `${e.venue.name}, ${e.venue.address}` : e.venue.name;
      L.push(fold(`LOCATION:${icsEscape(loc)}`));
    }
    let desc = (e.description ?? '').trim();
    if (e.checkin) desc = `${desc}\n${e.checkin}`;
    desc = `${desc}\n${e.permalink}`;
    L.push(fold(`DESCRIPTION:${icsEscape(desc)}`));
    L.push(fold(`URL:${e.permalink}`));
    L.push(fold(`STATUS:${e.cancelled ? 'CANCELLED' : 'CONFIRMED'}`));
    L.push(fold('END:VEVENT'));
  }
  L.push(fold('END:VCALENDAR'));
  return L.join('');
}
