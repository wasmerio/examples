// What you do — two groups of six cards. Each card names the proof behind it.
export type Capability = { title: string; body: string; proof: string };

export const primary: Capability[] = [
  { title: 'Skill one', body: 'One or two sentences on what you do and the outcome it produces.', proof: 'Where you did it' },
  { title: 'Skill two', body: 'Lead with the result, not the tool.', proof: 'Project One' },
  { title: 'Skill three', body: 'Keep each card short enough to read at a glance.', proof: 'Acme Labs' },
  { title: 'Skill four', body: 'Name the numbers that matter in your field.', proof: 'Northwind Studio' },
  { title: 'Skill five', body: 'Six cards fill the 3-column grid evenly.', proof: 'Project Two' },
  { title: 'Skill six', body: 'Proof lines turn claims into evidence.', proof: 'Placeholder Agency' },
];

export const secondary: Capability[] = [
  { title: 'Skill seven', body: 'A second group — e.g. engineering, research, or leadership.', proof: 'Project Three' },
  { title: 'Skill eight', body: 'Rename the section titles in src/pages/index.astro.', proof: 'Project Five' },
  { title: 'Skill nine', body: 'Delete a group entirely if one is enough.', proof: 'Project One' },
  { title: 'Skill ten', body: 'Every card tilts toward the pointer on desktop.', proof: 'This template' },
  { title: 'Skill eleven', body: 'Touch devices and reduced motion keep cards flat.', proof: 'This template' },
  { title: 'Skill twelve', body: 'Replace this copy with your own.', proof: 'You' },
];
