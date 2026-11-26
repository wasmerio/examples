// Headlines and short descriptions that frame each section. They say what your
// work is about, so write them in your own voice.
export const copy = {
  selectedWork: {
    title: "Work I'm proud of.",
    description:
      "A few projects from my day job: what they do and the scale they run at.",
  },
  experience: {
    title: "Where I've worked.",
    description: "What shipped in each role, with the scale it reached.",
  },
  projects: {
    title: "Selected public projects.",
    description: "Tools, libraries, and apps I have built in the open.",
  },
  skills: {
    title: "Focused stack, compact toolbox.",
    description: "The languages, platforms, and tools I use most, in one view.",
  },
  // Used on /blog and in its structured data. The site name is appended: "... by <name>."
  blogDescription: "Notes on software engineering and what I learn along the way",
  // Extra terms the job-posting matcher recognises, on top of every skill and stack entry.
  matchTerms: [] as string[],
  // Prompts offered in the Ask AI dialog. {name} becomes your name.
  askAiQuestions: [
    {
      id: "summary",
      label: "Quick summary",
      ask: "summarize who {name} is, the most notable work shipped, and the strongest areas.",
    },
    {
      id: "work",
      label: "Notable work",
      ask: "list the most notable projects {name} has shipped, the role played in each, and the scale.",
    },
    {
      id: "fit",
      label: "Fit for a role",
      ask: "assess how {name}'s experience fits the job posting below. Cover strong matches and gaps.",
    },
    {
      id: "interview",
      label: "Interview prep",
      ask: "suggest five interview questions tailored to {name}'s experience, with what a strong answer would cover.",
    },
  ],
};
