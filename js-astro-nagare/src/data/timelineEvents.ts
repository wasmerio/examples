// src/data/timelineEvents.ts

export interface TimelineEventItem {
  date: string; // YYYY-MM format (represents END date for sorting intervals)
  dateRange?: string; // Formatted display range (e.g., "Jul 2024 – Sep 2024")
  title: string;
  category: "Experiences" | "Honors" | "Publications";
  description?: string; // HTML string
  isHighlight?: boolean;
  highlightSummary?: string;
}

export const allTimelineEvents: TimelineEventItem[] = [
  // Experiences (Sorted by end date implicitly for data entry)

  {
    date: "2024-09",
    dateRange: "July 2024 – September 2024",
    title: "Lorem Ipsum",
    category: "Experiences",
    description: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
    isHighlight: true,
    highlightSummary: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  },
  {
    date: "2024-06",
    dateRange: "September 2023 – June 2024",
    title: "Lorem Ipsum",
    category: "Experiences",
    description: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
  },
  {
    date: "2024-08",
    title: "Sleeping is all you need",
    category: "Publications",
    isHighlight: true,
    description: `<em>Sleeping is all you need</em> accepted by International Conference on Sleep Deprivation and Coffee Addiction.`,
    highlightSummary:
      "A groundbreaking study proving that people need sleeping, accepted by ICSDCA.",
  },
  {
    date: "2023-05",
    title: "Lorem Ipsum",
    category: "Experiences",
    description: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
  },
  {
    date: "2022-09",
    title: "Lorem Ipsum",
    category: "Experiences",
    description: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
  },

  // Honors
  {
    date: "2024-11",
    title: "International Vibe Coding Award",
    category: "Honors",
    isHighlight: true,
    description: `<p>Awarded the prestigious International Vibe Coding Award.</p>`,
    highlightSummary:
      "Awarded the prestigious International Vibe Coding Award.",
  },
  {
    date: "2024-11",
    title: "Lorem Ipsum",
    category: "Honors",
    description: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
  },
  {
    date: "2024-11",
    title: "Lorem Ipsum",
    category: "Honors",
    description: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
  },
  {
    date: "2024-10",
    title: "Lorem Ipsum",
    category: "Honors",
    description: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
  },
  {
    date: "2024-05",
    title: "Lorem Ipsum",
    category: "Honors",
    description: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
  },
  {
    date: "2023-11",
    title: "Lorem Ipsum",
    category: "Honors",
    description: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
  },
  {
    date: "2023-10",
    title: "Lorem Ipsum",
    category: "Honors",
    description: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
  },
];
