import type { Stat } from '~/types';

export const stats: Stat[] = [
  { value: 15, label: 'Years independent' },
  { value: 40, suffix: '+', label: 'Teams partnered' },
  { value: 96, suffix: '%', label: 'Would hire again' },
];

/** Headline above the stats band, split so the tail can be dimmed. */
export const statsHeading = {
  lead: 'Design is mostly deciding what to leave out,',
  tail: 'then defending that decision for six straight weeks.',
};

/**
 * Poster frame for the studio reel. Set `embedUrl` to a YouTube/Vimeo
 * privacy-friendly embed to make the play button load a real video;
 * leave it empty and the button is hidden.
 */
export const reel = {
  image: '/images/reel-poster.webp',
  alt: 'Two people reviewing notes and sketches at a studio table',
  width: 1000,
  height: 625,
  embedUrl: '',
  label: 'Play the studio reel',
};
