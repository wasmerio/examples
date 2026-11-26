import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContent } from '../scripts/validate-content.js';
import { memories } from '../src/data/memories.js';
import { annualRecaps } from '../src/data/annual-recaps.js';
import { relationshipTimelineMemoryIds } from '../src/data/relationship-timeline.js';
import { sharedWishCategories, sharedWishes } from '../src/data/shared-wishes.js';
import { places } from '../src/data/places.js';

const current = { memories, annualRecaps, relationshipTimelineMemoryIds, sharedWishCategories, sharedWishes, places };

test('sample content passes the shared validator', () => {
  assert.equal(validateContent(current), true);
});

test('validator reports duplicate IDs and invalid calendar dates', () => {
  const altered = [...memories, { ...memories[0], date: '2024-02-30' }];
  assert.throws(() => validateContent({ ...current, memories: altered }), (error) => (
    error.message.includes('duplicate ID "first-walk"') && error.message.includes('valid YYYY-MM-DD')
  ));
});

test('validator catches dangling timeline, recap, wish, and place references', () => {
  const alteredMemories = memories.map((memory, index) => index ? memory : { ...memory, placeIds: ['unknown-place'] });
  const alteredRecaps = annualRecaps.map((recap, index) => index ? recap : { ...recap, highlights: [{ id: 'missing', memoryId: 'unknown-memory' }] });
  const alteredWishes = sharedWishes.map((wish, index) => index ? wish : { ...wish, category: 'unknown-category' });
  assert.throws(() => validateContent({
    ...current,
    memories: alteredMemories,
    annualRecaps: alteredRecaps,
    relationshipTimelineMemoryIds: [...relationshipTimelineMemoryIds, 'unknown-timeline-memory'],
    sharedWishes: alteredWishes,
  }), /unknown place|unknown memory|unknown category/);
});
