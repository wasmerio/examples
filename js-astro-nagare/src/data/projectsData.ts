// src/data/projectsData.ts

export interface ProjectDataItem {
  title: string;
  timeframe?: string;
  githubUrl?: string;
  githubRepos?: { title?: string; url: string }[];
  projectUrl?: string;
  techStack?: string[];
  imageSrc?: string;
  imageAlt?: string;
  thumbnailSrc?: string; // Optional: Path to a square thumbnail image
  description: string; // HTML string
  homepageSummary?: string; // Concise summary for homepage
  isFeatured?: boolean; // Flag for featuring on homepage
}

// Example data (replace with your actual data later)
export const allProjectsData: ProjectDataItem[] = [
  {
    title: "Nagare",
    timeframe: "April 2025",
    githubUrl: "https://github.com/angine04/nagare",
    projectUrl: "https://nagare.angine.tech",
    techStack: ["Astro", "TypeScript"],
    imageSrc: "/images/projects/nagare.png",
    imageAlt: "Screenshot of the portfolio website homepage",
    description: `
        <p>Nagare, the <strong>portfolio website template</strong> you're currently viewing, built with <em>Astro</em>.</p>
        <p>Features dynamic background effects, responsive design, smooth transitions, and content showcasing timeline, projects, and resume.</p>
      `,
    isFeatured: true,
    homepageSummary:
      "Nagare, the <strong>portfolio website template</strong> you're currently viewing, built with <em>Astro</em>.",
  },
  {
    title: "Example Project",
    timeframe: "April 2025",
    githubUrl: "https://github.com/angine04/nagare",
    projectUrl: "https://nagare.angine.tech",
    techStack: ["Astro", "TypeScript"],
    imageSrc: "/images/projects/nagare.png",
    imageAlt: "Screenshot of the portfolio website homepage",
    description: `
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
      `,
    isFeatured: true,
    homepageSummary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    title: "Sample Project",
    timeframe: "April 2025",
    githubUrl: "https://github.com/angine04/nagare",
    projectUrl: "https://nagare.angine.tech",
    techStack: ["Astro", "TypeScript"],
    imageSrc: "/images/projects/nagare.png",
    imageAlt: "Screenshot of the portfolio website homepage",
    description: `
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      `,
    isFeatured: true,
    homepageSummary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    title: "Specimen Project",
    timeframe: "April 2025",
    githubUrl: "https://github.com/angine04/nagare",
    projectUrl: "https://nagare.angine.tech",
    techStack: ["Astro", "TypeScript"],
    imageSrc: "/images/projects/nagare.png",
    imageAlt: "Screenshot of the portfolio website homepage",
    description: `
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
      `,
    isFeatured: true,
    homepageSummary:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  },
  {
    title: "Some Project",
    timeframe: "April 2025",
    githubUrl: "https://github.com/angine04/nagare",
    projectUrl: "https://nagare.angine.tech",
    techStack: ["Astro", "TypeScript"],
    imageSrc: "/images/projects/nagare.png",
    imageAlt: "Screenshot of the portfolio website homepage",
    description: `
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      `,
    isFeatured: false,
  },
  {
    title: "Some Other Project",
    timeframe: "April 2025",
    githubUrl: "https://github.com/angine04/nagare",
    projectUrl: "https://nagare.angine.tech",
    techStack: ["Astro", "TypeScript"],
    imageSrc: "/images/projects/nagare.png",
    imageAlt: "Screenshot of the portfolio website homepage",
    description: `
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
      `,
    isFeatured: false,
  },
  // Add more projects here
];
