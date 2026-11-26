type Summary = {
  name: string;
  email: string;
  linkedin: string;
  github: string;
  location: {
    title: string;
    href: string;
  };
  phone: string;
  title: string;
};

type Education = {
  period: [string, string];
  institution: string;
  description: string;
};

const all = {
  summary: {
    name: 'Leslie Knope',
    email: 'leslieknope@example.com',
    linkedin: '',
    github: '',
    location: { title: 'Pawnee, IN', href: 'https://example.com' },
    phone: '+15555550142',
    title: 'Parks Director & Public Servant',
  },
  skills: [
    'Program Management',
    'Public Policy',
    'Municipal Budgeting',
    'Grant Writing',
    'Community Organizing',
    'Stakeholder Engagement',
    'Capital Projects',
    'Parks & Land-Use Planning',
    'Permitting & Compliance',
    'Event Production',
    'Coalition Building',
    'Open Data & Reporting',
    'GIS Mapping',
    // 'Volunteer Coordination',
    // 'Public Speaking',
    // 'Constituent Services',
    // 'Crisis Communications',
  ],
  education: [
    {
      period: ['Sep 1993', 'May 1997'],
      institution: 'Pawnee State University',
      description: 'Bachelor of Arts, Political Science',
    },
    {
      period: ['Sep 1997', 'May 1999'],
      institution: 'Wamapoke County University',
      description: 'Master of Public Administration',
    },
  ],
} as const satisfies {
  summary: Summary;
  skills: string[];
  education: Education[];
};

export default all;
