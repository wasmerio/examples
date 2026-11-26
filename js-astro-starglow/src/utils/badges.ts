/**
 * 88x31 badge icons: 11x11 bitmaps drawn with 2px cells in the badge's icon
 * well. `#` is a lit cell. Colours come from the `--badge-<type>` tokens in
 * site-theme.css; unknown types use the generic `link` icon.
 */
export type BadgeIcon = {
  /** One-line badge text. */
  label: string;
  /** Tooltip and accessible name. */
  title: string;
  bitmap: string[];
};

export const BADGE_ICONS: Record<string, BadgeIcon> = {
  github: {
    label: "github",
    title: "GitHub",
    bitmap: [
      ".#.......#.",
      ".##.....##.",
      ".#########.",
      "###########",
      "##..###..##",
      "##..###..##",
      "###########",
      ".#########.",
      "..#.###.#..",
      "...#####...",
      "....#.#....",
    ],
  },
  gitlab: {
    label: "gitlab",
    title: "GitLab",
    bitmap: [
      "#.........#",
      "##.......##",
      "###.....###",
      "###########",
      "###########",
      ".#########.",
      "..#######..",
      "...#####...",
      "....###....",
      ".....#.....",
      "...........",
    ],
  },
  codeberg: {
    label: "codeberg",
    title: "Codeberg",
    bitmap: [
      ".....#.....",
      "....###....",
      "....###....",
      "...#####...",
      "...##.##...",
      "..##...##..",
      "..##...##..",
      ".##.....##.",
      ".##.....##.",
      "###########",
      "...........",
    ],
  },
  srht: {
    label: "srht",
    title: "SourceHut",
    bitmap: [
      "...#####...",
      "..#.....#..",
      ".#.......#.",
      "#.........#",
      "#.........#",
      "#.........#",
      "#.........#",
      "#.........#",
      ".#.......#.",
      "..#.....#..",
      "...#####...",
    ],
  },
  linkedin: {
    label: "linkedin",
    title: "LinkedIn",
    bitmap: [
      "###########",
      "#.........#",
      "#.#.......#",
      "#.........#",
      "#.#.#.##..#",
      "#.#.##..#.#",
      "#.#.#...#.#",
      "#.#.#...#.#",
      "#.#.#...#.#",
      "#.........#",
      "###########",
    ],
  },
  mastodon: {
    label: "mastodon",
    title: "Mastodon",
    bitmap: [
      "...........",
      ".#########.",
      "###########",
      "##.#####.##",
      "##.#.#.#.##",
      "##.#.#.#.##",
      "##.#.#.#.##",
      "###########",
      ".########..",
      ".......##..",
      "...........",
    ],
  },
  bluesky: {
    label: "bluesky",
    title: "Bluesky",
    bitmap: [
      "...........",
      "##.......##",
      "###.....###",
      "####...####",
      "#####.#####",
      ".####.####.",
      "..###.###..",
      ".####.####.",
      ".###...###.",
      "..#.....#..",
      "...........",
    ],
  },
  stack: {
    label: "stack",
    title: "Stack Overflow",
    bitmap: [
      ".......#...",
      "......#....",
      "....##.....",
      "..###......",
      "...........",
      ".#######...",
      "...........",
      "#.........#",
      "#.#######.#",
      "#.........#",
      "###########",
    ],
  },
  hackaday: {
    label: "hackaday",
    title: "Hackaday.io",
    bitmap: [
      "...#####...",
      "..#######..",
      ".#########.",
      ".##..#..##.",
      ".##..#..##.",
      ".#########.",
      "..###.###..",
      "...#####...",
      "...#.#.#...",
      "...........",
      "...........",
    ],
  },
  crates: {
    label: "crates",
    title: "crates.io",
    bitmap: [
      "...........",
      "###########",
      "#.........#",
      "###########",
      "#.#.#.#.#.#",
      "#.#.#.#.#.#",
      "#.#.#.#.#.#",
      "#.#.#.#.#.#",
      "###########",
      "...........",
      "...........",
    ],
  },
  email: {
    label: "email",
    title: "Email",
    bitmap: [
      "...........",
      "###########",
      "##.......##",
      "#.#.....#.#",
      "#..#...#..#",
      "#...#.#...#",
      "#....#....#",
      "#.........#",
      "###########",
      "...........",
      "...........",
    ],
  },
  rss: {
    label: "rss",
    title: "RSS feed",
    bitmap: [
      "#####......",
      ".....##....",
      ".......#...",
      "###.....#..",
      "...##....#.",
      ".....#...#.",
      "##....#...#",
      "###...#...#",
      "###...#...#",
      "...........",
      "...........",
    ],
  },
  sparkle: {
    label: "sparkle",
    title: "Sparkle",
    bitmap: [
      ".....#.....",
      ".....#.....",
      "....###....",
      "....###....",
      ".#########.",
      "..#######..",
      "....###....",
      "....###....",
      ".....#.....",
      ".....#.....",
      "...........",
    ],
  },
  link: {
    label: "link",
    title: "Link",
    bitmap: [
      "......#####",
      ".........##",
      "........#.#",
      "#####..#..#",
      "#.....#....",
      "#....#.....",
      "#..........",
      "#.........#",
      "#.........#",
      "#.........#",
      "###########",
    ],
  },
};

/** The icon of a badge type, the generic one for unknown types. */
export const badgeIcon = (type: string): BadgeIcon =>
  Object.hasOwn(BADGE_ICONS, type) ? BADGE_ICONS[type] : BADGE_ICONS.link;

/** Badge types that are profiles of the site owner (`rel="me"`). */
export const PROFILE_BADGES = new Set([
  "github",
  "gitlab",
  "codeberg",
  "srht",
  "linkedin",
  "mastodon",
  "bluesky",
  "stack",
  "hackaday",
  "crates",
  "lemmy",
  "x",
  "reddit",
  "devto",
  "medium",
]);

/** Horizontal runs of lit cells: [column, row, length]. */
export function bitmapRuns(bitmap: string[]): [number, number, number][] {
  const runs: [number, number, number][] = [];
  bitmap.forEach((row, y) => {
    for (const match of row.matchAll(/#+/g)) {
      runs.push([match.index ?? 0, y, match[0].length]);
    }
  });
  return runs;
}
