export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  initials: string;
}

export const team: TeamMember[] = [
  {
    name: 'Mara Ellis',
    role: 'Founder & Head Coach',
    bio: 'Mara has coached strength training for twelve years and still believes the best programme is the one you actually show up for.',
    initials: 'ME',
  },
  {
    name: 'Jonah Reed',
    role: 'Strength & Conditioning Coach',
    bio: 'A former competitive powerlifter, Jonah builds programmes that make you stronger without making your joints pay for it.',
    initials: 'JR',
  },
  {
    name: 'Priya Nair',
    role: 'Mobility & Recovery Coach',
    bio: 'Priya specialises in the work most gyms skip: the warm-up, the cool-down, and the sleep. Your future self will thank her.',
    initials: 'PN',
  },
  {
    name: 'Diego Santos',
    role: 'Nutrition Coach',
    bio: 'Diego helps members fuel training and recover properly — with food they enjoy, not a spreadsheet of numbers.',
    initials: 'DS',
  },
];

export interface Value {
  title: string;
  description: string;
}

export const values: Value[] = [
  {
    title: 'Strong for life',
    description:
      'We train for the body you take into your sixties, not a look for one summer. Every programme is built to last.',
  },
  {
    title: 'Coaching, not barking',
    description:
      'No yelling, no ego. Our coaches explain the why behind every set so you can train intelligently on your own.',
  },
  {
    title: 'Everyone belongs',
    description:
      'Whatever your starting point, the floor is yours. We scale every class and meet you exactly where you are.',
  },
];
