/** §3 talk archive helpers, shared by the event page, the event row, and the
 *  /talks/ index. A "talk" is either an entry in an event's talks[] array or,
 *  for single-talk meetups, the event itself when it carries event-level
 *  recording/slides. When talks[] is present it wins; event-level
 *  recording/slides are ignored (not merged), matching the Hugo side. */
import type { CollectionEntry } from 'astro:content';

type EventData = CollectionEntry<'events'>['data'];

export interface Talk {
  title: string;
  speakerSlug?: string; // resolved speaker-profile slug, for linking
  speakerName?: string; // display name (profile title, or the free-text speaker)
  recording?: string;
  slides?: string;
}

export interface TalkRow extends Talk {
  eventId: string;
  eventTitle: string;
  date: Date;
  tags: string[];
}

/** True if an event has any recording (event-level or in a talk), for the
 *  browsing cue on past-event rows. */
export function eventHasRecording(d: EventData): boolean {
  const talks = (d as { talks?: { recording?: string }[] }).talks;
  if (talks?.length) return talks.some((t) => !!t.recording);
  return !!(d as { recording?: string }).recording;
}

/** The talks for one event, normalized. speakers is the resolved collection so
 *  a talk's speaker slug (or the event's first speaker, in the simple case)
 *  becomes a linkable name; an unresolved slug warns and renders name-less. */
export function eventTalks(
  d: EventData,
  speakers: CollectionEntry<'speakers'>[],
  eventId: string,
): Talk[] {
  const nameOf = (slug?: string): string | undefined => {
    if (!slug) return undefined;
    const found = speakers.find((s) => s.id === slug);
    if (!found) console.warn(`events/${eventId}: talk speaker "${slug}" matches no speaker page`);
    return found?.data.title;
  };
  const anyD = d as EventData & {
    talks?: Talk[]; recording?: string; slides?: string;
  };
  if (anyD.talks?.length) {
    return anyD.talks.map((t) => ({
      title: t.title,
      speakerSlug: nameOf(t.speaker) ? t.speaker : undefined,
      speakerName: nameOf(t.speaker),
      recording: t.recording,
      slides: t.slides,
    }));
  }
  if (anyD.recording || anyD.slides) {
    const slug = d.speakers[0];
    const name = nameOf(slug) ?? d.speaker;
    return [{
      title: d.title,
      speakerSlug: nameOf(slug) ? slug : undefined,
      speakerName: name,
      recording: anyD.recording,
      slides: anyD.slides,
    }];
  }
  return [];
}

/** Every talk across the given events, newest event first, for the /talks/
 *  index. Each row carries its parent event's link, date, and tags (the tags
 *  drive the shared blog-filter.js tag filter). */
export function collectTalks(
  events: CollectionEntry<'events'>[],
  speakers: CollectionEntry<'speakers'>[],
): TalkRow[] {
  const rows: TalkRow[] = [];
  for (const e of [...events].sort((a, b) => +b.data.date - +a.data.date)) {
    for (const t of eventTalks(e.data, speakers, e.id)) {
      rows.push({ ...t, eventId: e.id, eventTitle: e.data.title, date: e.data.date, tags: e.data.tags });
    }
  }
  return rows;
}
