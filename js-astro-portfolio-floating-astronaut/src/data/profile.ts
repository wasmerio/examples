// Everything about you lives here. Replace the placeholder copy with your own;
// the sections read these arrays, so no component edits are needed.
export type Proof = { value: string; label: string };
export type Role = { role: string; org: string; period: string; place: string; summary: string; bullets: string[] };
// `logo` is optional: without one, the school's initials are shown instead.
export type School = { school: string; credential: string; period: string; logo?: string };

export const proof: Proof[] = [
  { value: '2018', label: 'Started in the field' },
  { value: '40+', label: 'Projects shipped' },
  { value: '3', label: 'Products launched' },
  { value: '2', label: 'Degrees' },
];

export const experience: Role[] = [
  {
    role: 'Senior Product Designer',
    org: 'Northwind Studio',
    period: '2024 - Present',
    place: 'Remote',
    summary: 'Lead design on the core product, from research through to shipped UI.',
    bullets: [
      'Replace this with a result you are proud of, with a number if you have one.',
      'Describe the scope: the team, the product, the people you worked with.',
      'Keep each bullet to one line a recruiter can scan in two seconds.',
    ],
  },
  {
    role: 'Product Designer',
    org: 'Acme Labs',
    period: '2021 - 2024',
    place: 'Your City',
    summary: 'Designed and tested features for a fast-growing consumer app.',
    bullets: [
      'Shipped a redesign that improved a metric you can name.',
      'Ran weekly usability tests and fed the results into the roadmap.',
    ],
  },
  {
    role: 'Junior Designer',
    org: 'Placeholder Agency',
    period: '2018 - 2021',
    place: 'Remote',
    summary: 'Client work across branding, web and campaign design.',
    bullets: ['Delivered sites and campaigns for a range of client brands.'],
  },
];

export const education: School[] = [
  { school: 'Example University', credential: 'Master of Design', period: '2020 - 2022' },
  { school: 'Sample College', credential: 'Bachelor of Arts - Visual Communication', period: '2015 - 2018' },
];

export const certifications: string[] = ['Certification one', 'Certification two', 'Certification three'];
export const languages: string[] = ['English - full professional', 'Second language - conversational'];
