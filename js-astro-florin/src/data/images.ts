// Unsplash images used across the Florin screens.
// Hot-linked (per Unsplash license) so the template has no binary assets.

const unsplash = (id: string, params: string) => `https://images.unsplash.com/${id}?${params}&q=80&auto=format`;

export const face = (id: string, size = 96) => unsplash(id, `w=${size}&h=${size}&fit=crop&crop=faces`);

// One photo per persona — keep consistent on every page.
export const PEOPLE_IDS = {
  JD: 'photo-1517841905240-472988babdf9', // Jane Doe
  MK: 'photo-1494790108377-be9c29b29330', // Maria Kim
  TW: 'photo-1507003211169-0a1dd7228f2d', // Tom Walker
  SL: 'photo-1534528741775-53994a69daeb', // Sofia Lee
  JR: 'photo-1500648767791-00dcc994a43e', // James Rodriguez
  AP: 'photo-1438761681033-6461ffad8d80', // Anna Petrova
};

export const FACES = Object.fromEntries(
  Object.entries(PEOPLE_IDS).map(([k, id]) => [k, face(id)]),
) as Record<keyof typeof PEOPLE_IDS, string>;
