import { SITE_CONFIG } from '../src/config/site.js';
import { memories } from '../src/data/memories.js';
import { annualRecaps } from '../src/data/annual-recaps.js';
import { relationshipTimelineMemoryIds } from '../src/data/relationship-timeline.js';
import { sharedWishCategories, sharedWishes } from '../src/data/shared-wishes.js';
import { places } from '../src/data/places.js';
import { relationshipOrigins, relationshipPhases, relationshipLocationMilestones } from '../src/data/relationship-timeline.js';

export function validateContent({
  memories: memoryRecords = memories,
  annualRecaps: recapRecords = annualRecaps,
  relationshipTimelineMemoryIds: timelineIds = relationshipTimelineMemoryIds,
  sharedWishCategories: wishCategories = sharedWishCategories,
  sharedWishes: wishRecords = sharedWishes,
  places: placeRecords = places,
} = {}) {
  const errors = [];
  const requireBilingual = (value, label) => {
    if (!value || typeof value !== 'object' || typeof value.zh !== 'string' || !value.zh.trim() || typeof value.en !== 'string' || !value.en.trim()) {
      errors.push(`${label}: Chinese (zh) and English (en) text are required`);
    }
  };
  const uniqueIds = (items, label) => {
    const seen = new Set();
    for (const item of items) {
      if (!item.id || seen.has(item.id)) errors.push(`${label}: missing or duplicate ID "${item.id ?? ''}"`);
      seen.add(item.id);
    }
    return seen;
  };
  requireBilingual(SITE_CONFIG.brand.name, 'site title');
  requireBilingual(SITE_CONFIG.brand.description, 'site description');
  const memoryIds = uniqueIds(memoryRecords, 'memories');
  const placeIds = uniqueIds(placeRecords, 'places');
  const categoryIds = uniqueIds(wishCategories, 'wish categories');
  uniqueIds(wishRecords, 'wishes');
  uniqueIds(recapRecords, 'annual recaps');
  for (const memory of memoryRecords) {
    const parsedDate = new Date(`${memory.date}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(memory.date) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== memory.date) errors.push(`memory "${memory.id}": date must be a valid YYYY-MM-DD date`);
    for (const placeId of memory.placeIds) if (!placeIds.has(placeId)) errors.push(`memory "${memory.id}": unknown place "${placeId}"`);
    if (!memory.image || !memory.alt) errors.push(`memory "${memory.id}": image and alt text are required`);
    for (const field of ['title', 'description', 'alt']) requireBilingual(memory[field], `memory "${memory.id}" ${field}`);
    if (memory.place) requireBilingual(memory.place, `memory "${memory.id}" place`);
  }
  for (const id of timelineIds) if (!memoryIds.has(id)) errors.push(`timeline: unknown memory "${id}"`);
  for (const recap of recapRecords) {
    requireBilingual(recap.theme, `recap ${recap.year} theme`);
    for (const item of recap.highlights) {
      if (item.memoryId && !memoryIds.has(item.memoryId)) errors.push(`recap ${recap.year}: unknown memory "${item.memoryId}"`);
      if (item.title) requireBilingual(item.title, `recap ${recap.year} highlight "${item.id}" title`);
    }
  }
  for (const wish of wishRecords) if (!categoryIds.has(wish.category)) errors.push(`wish "${wish.id}": unknown category "${wish.category}"`);
  for (const wish of wishRecords) requireBilingual(wish.title, `wish "${wish.id}" title`);
  for (const category of wishCategories) {
    requireBilingual(category.title, `wish category "${category.id}" title`);
    requireBilingual(category.eyebrow, `wish category "${category.id}" eyebrow`);
    requireBilingual(category.description, `wish category "${category.id}" description`);
  }
  for (const place of placeRecords) {
    requireBilingual(place.name, `place "${place.id}" name`);
    requireBilingual(place.region, `place "${place.id}" region`);
    requireBilingual(place.travelArea?.country, `place "${place.id}" country`);
    requireBilingual(place.travelArea?.label, `place "${place.id}" travel area`);
  }
  for (const origin of relationshipOrigins) {
    requireBilingual(origin.person, `origin ${origin.year} person`);
    requireBilingual(origin.label, `origin ${origin.year} label`);
  }
  for (const phase of relationshipPhases) {
    requireBilingual(phase.title, `timeline phase "${phase.id}" title`);
    requireBilingual(phase.description, `timeline phase "${phase.id}" description`);
  }
  for (const location of relationshipLocationMilestones) {
    for (const field of ['period', 'personA', 'personB']) requireBilingual(location[field], `timeline location ${location.year} ${field}`);
    if (location.note) requireBilingual(location.note, `timeline location ${location.year} note`);
  }
  for (const [kind, anniversary] of Object.entries(SITE_CONFIG.anniversaries)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(anniversary.date)) errors.push(`anniversary "${kind}": date must be YYYY-MM-DD`);
    requireBilingual(anniversary.label, `anniversary "${kind}" label`);
  }
  for (const [id, birthday] of Object.entries(SITE_CONFIG.birthdays)) requireBilingual(birthday.name, `birthday "${id}" name`);
  if (errors.length) throw new Error(`Sample content validation failed:\n- ${errors.join('\n- ')}`);
  return true;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  validateContent();
  process.stdout.write(`Validated ${memories.length} memories, ${places.length} places, ${annualRecaps.length} recaps, and ${sharedWishes.length} wishes.\n`);
}
