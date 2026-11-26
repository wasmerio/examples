// Your work. The first four show as square tiles in a 2×2 grid; a fifth (or
// later) project shows as a full-width "featured" bar under them.
// Covers are 16:10 screenshots in public/projects/ (1600×1000 webp works well).
export type Project = { slug: string; index: number; name: string; status: 'LIVE' | 'IN PROGRESS';
  pitch: string; facts: [string, string, string]; role: string; href?: string; cover: string };

export const projects: Project[] = [
  { slug: 'project-one', index: 1, name: 'Project One', status: 'LIVE', pitch: 'One sentence on what it does and who it is for.', facts: ['Fact one', 'Fact two', 'Fact three'], role: 'Product, design, build.', href: 'https://example.com', cover: '/projects/project-one.webp' },
  { slug: 'project-two', index: 2, name: 'Project Two', status: 'LIVE', pitch: 'The problem it solves, in plain words.', facts: ['Web + mobile', 'Open source', '1k users'], role: 'Design, front end.', href: 'https://example.com', cover: '/projects/project-two.webp' },
  { slug: 'project-three', index: 3, name: 'Project Three', status: 'LIVE', pitch: 'A short, specific pitch beats a long one.', facts: ['API', 'Dashboard', 'Docs'], role: 'Product, build.', href: 'https://example.com', cover: '/projects/project-three.webp' },
  { slug: 'project-four', index: 4, name: 'Project Four', status: 'IN PROGRESS', pitch: 'Work in progress is fine — say so.', facts: ['Prototype', 'User tests', 'Launching soon'], role: 'Research, design.', cover: '/projects/project-four.webp' },
  { slug: 'project-five', index: 5, name: 'Project Five', status: 'LIVE', pitch: 'Your featured project gets the full-width bar.', facts: ['Native iOS', 'On the App Store', 'Featured'], role: 'Product, build, launch.', href: 'https://example.com', cover: '/projects/project-five.webp' },
];
