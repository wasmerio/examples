export interface Experience {
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  start: string;
  end: string;
  current?: boolean;
  summary: string;
  bullets: string[];
  badges?: string[];
}

export interface Education {
  degree: string;
  field: string;
  school: string;
  start: string;
  end: string;
}

export interface SkillGroup {
  title: string;
  skills: string[];
}

/** Work history — newest first. Shown on /work */
export const experience: Experience[] = [
  {
    role: 'Senior Software Engineer',
    company: 'Example Corp',
    companyUrl: 'https://example.com',
    location: 'Remote',
    start: 'Mar 2024',
    end: 'Present',
    current: true,
    summary: 'Replace this with a one-line summary of what you own or lead.',
    bullets: [
      'Describe a thing you built, shipped, or led — outcomes over responsibilities.',
      'Another bullet. Numbers help: latency cut in half, adoption up 3×, etc.',
      'Mentoring, design reviews, on-call, whatever actually fills your week.',
    ],
    badges: ['TypeScript', 'Go', 'Kubernetes'],
  },
  {
    role: 'Software Engineer',
    company: 'Startup Inc.',
    companyUrl: 'https://example.com',
    location: 'Portland, OR',
    start: 'Jul 2021',
    end: 'Feb 2024',
    summary: 'One line about the product and your slice of it.',
    bullets: [
      'Owned X end to end — design, implementation, rollout.',
      'Built Y used by Z customers.',
    ],
  },
];

/** Smaller/older roles — rendered as compact rows under the main timeline */
export const earlierRoles: { role: string; company: string; start: string; end: string }[] = [
  { role: 'Engineering Intern', company: 'Some Company', start: '2020', end: '2021' },
];

export const education: Education[] = [
  {
    degree: 'B.S.',
    field: 'Computer Science',
    school: 'State University',
    start: '2016',
    end: '2020',
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: 'Languages',
    skills: ['TypeScript', 'Python', 'Go'],
  },
  {
    title: 'Platforms & Tools',
    skills: ['React', 'PostgreSQL', 'Docker', 'AWS'],
  },
  {
    title: 'Interests',
    skills: ['Distributed systems', 'Developer tooling', 'Photography'],
  },
];

/** Words typed out one character at a time in the hero */
export const typingRoles = [
  'software engineer',
  'occasional photographer',
  'weekend hiker',
  'coffee enthusiast',
];
