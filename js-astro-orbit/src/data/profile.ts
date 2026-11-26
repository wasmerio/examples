export type TimelineItem = {
  title: string;
  organization: string;
  period: string;
  description?: string;
};

export type AcademicProject = {
  title: string;
  institution: string;
  period: string;
  description: string;
  stack: string[];
  links?: { label: string; href: string }[];
};

/** Sample content. Replace every field with your own. */
export const profile = {
  summary:
    "Two or three sentences introducing yourself: what you work on, the domains you move between, and what you care about doing well.",
  perspective:
    "A second paragraph for context that does not fit a CV — an exchange, a career change, a domain you came from, or how you approach unfamiliar problems.",
  experience: [
    {
      title: "Platform Engineer",
      organization: "Example Company",
      period: "Jan 2025 - Present",
      description: "One line on scope: the systems you run and the outcomes you own.",
    },
    {
      title: "Software Engineer",
      organization: "Example Company",
      period: "Jun 2023 - Jan 2025",
      description: "One line on what you built and what changed because of it.",
    },
  ] satisfies TimelineItem[],
  education: [
    {
      title: "Master's degree in Computer Science",
      organization: "Example University",
      period: "Sep 2024 - Present",
    },
    {
      title: "Bachelor's degree in Computer Science",
      organization: "Example University",
      period: "Sep 2020 - Jun 2024",
    },
  ] satisfies TimelineItem[],
  academicProjects: [
    {
      title: "Distributed systems coursework",
      institution: "Example University",
      period: "Feb 2024 - Jun 2024",
      description: "One or two lines on the problem and what the project demonstrated.",
      stack: ["Go", "gRPC", "Raft"],
    },
    {
      title: "Interactive graphics project",
      institution: "Example University",
      period: "Feb 2023 - Jun 2023",
      description: "Team-built scene with modelling, animation, and shader work.",
      stack: ["JavaScript", "WebGL", "Team project"],
    },
  ] satisfies AcademicProject[],
  recognition: [
    {
      title: "Award or role",
      organization: "Issuing organization",
      period: "Nov 2024",
      description: "One line on what it was for.",
    },
  ] satisfies TimelineItem[],
  certifications: [
    { title: "Certification name", issuer: "Issuing organization", date: "2024" },
    { title: "Another certification", issuer: "Issuing organization", date: "2023" },
  ],
  languages: [
    { language: "English", level: "C1" },
    { language: "Your language", level: "Native" },
  ],
};
