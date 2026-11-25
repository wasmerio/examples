export interface CollabItem {
  id: string;
  partner: string;
  partnerType: "Open Source Org" | "Startup" | "Tech Studio" | "Research Team";
  title: string;
  role: string;
  period: string;
  description: string;
  contributions: string[];
  techStack: string[];
  link?: string;
  status: "ACTIVE" | "COMPLETED" | "ONGOING";
  asciiLogo?: string;
}

export interface SkillCategory {
  category: string;
  icon: string;
  skills: { name: string; level: number; experience: string; tag: string }[];
}

export type Max8Colors =
  | []
  | [string]
  | [string, string]
  | [string, string, string]
  | [string, string, string, string]
  | [string, string, string, string, string]
  | [string, string, string, string, string, string]
  | [string, string, string, string, string, string, string]
  | [string, string, string, string, string, string, string, string];

export const PORTFOLIO_DATA = {
  developer: {
    name: "Alex Devson",
    handle: "alexdevson",
    title: "Senior Full Stack & Systems Engineer",
    alias: "root@quantum-box",
    email: "alexdevson@dev.com",
    github: "https://github.com/nivinvysakh/astro-tui-portfolio",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
    location: "San Francisco, CA // UTC-7",
    status: " OPEN FOR COLLABORATIONS & CONTRACTS",
    CLI_EMOJI: "🫐",
    palette: [
      "#0f0f0f",
      "#ef4444",
      "#22c55e",
      "#eab308",
      "#3b82f6",
      "#a855f7",
      "#06b6d4",
      "#f8fafc",
    ],
    bio: "Passionate systems & web engineer with 7+ years of experience building high-throughput edge systems, interactive web applications, and developer tools. Active open-source contributor and collaborative team player.",
    quote:
      '"Code is like humor. When you have to explain it, it’s bad." – Cory House',
    asciiBanner: `
    _    _     _______  __
   / \\  | |   | ____\\ \\/ /
  / _ \\ | |   |  _|  \\  / 
 / ___ \\| |___| |___ /  \\ 
/_/   \\_\\_____|_____/_/\\_\\
  ____  _______   ______   ___  _   _ 
 |  _ \\| ____\\ \\ / / ___| / _ \\| \\ | |
 | | | |  _|  \\ V /\\___ \\| | | |  \\| |
 | |_| | |___  | |  ___) | |_| | |\\  |
 |____/|_____| |_| |____/ \\___/|_| \\_|
`,
    specs: {
      OS: "Arch Linux x86_64 / macOS Darwin",
      Kernel: "6.10.8-zen1-1-zen",
      Uptime: "42 days, 13 hours, 37 mins",
      Shell: "zsh 5.9 (x86_64-apple-darwin22.0)",
      Terminal: "Alacritty / Web-TUI Astro",
      WM: "i3-gaps / yabai",
      Editor: "Neovim (NVChad) / VS Code",
      CPU: "Apple M3 Max (16 cores)",
      Memory: "24.5GiB / 64.0GiB",
    },
  },

  skills: [
    {
      category: "Core Languages",
      icon: "⚡",
      skills: [
        {
          name: "TypeScript / JavaScript",
          level: 95,
          experience: "7 yrs",
          tag: "EXPERT",
        },
        { name: "Rust", level: 85, experience: "4 yrs", tag: "ADVANCED" },
        {
          name: "Go (Golang)",
          level: 80,
          experience: "3 yrs",
          tag: "ADVANCED",
        },
        {
          name: "HTML5 / CSS3 / Tailwind",
          level: 95,
          experience: "7 yrs",
          tag: "EXPERT",
        },
        { name: "Python", level: 88, experience: "5 yrs", tag: "PRO" },
        { name: "SQL & NoSQL", level: 90, experience: "6 yrs", tag: "PRO" },
      ],
    },
    {
      category: "Frameworks & Frontend",
      icon: "🌐",
      skills: [
        { name: "Astro.js", level: 95, experience: "3 yrs", tag: "EXPERT" },
        { name: "React / Next.js", level: 92, experience: "6 yrs", tag: "PRO" },
        {
          name: "Tailwind CSS v4",
          level: 95,
          experience: "4 yrs",
          tag: "EXPERT",
        },
        {
          name: "Node.js / Hono / Express",
          level: 90,
          experience: "6 yrs",
          tag: "PRO",
        },
        { name: "Vue / Nuxt", level: 80, experience: "3 yrs", tag: "ADVANCED" },
        {
          name: "WebAssembly (Wasm)",
          level: 75,
          experience: "2 yrs",
          tag: "INTERMEDIATE",
        },
      ],
    },
    {
      category: "DevOps, Cloud & Architecture",
      icon: "☁️",
      skills: [
        {
          name: "Docker / Containerization",
          level: 88,
          experience: "5 yrs",
          tag: "PRO",
        },
        {
          name: "Kubernetes & Helm",
          level: 80,
          experience: "3 yrs",
          tag: "ADVANCED",
        },
        {
          name: "Linux Administration & Bash",
          level: 92,
          experience: "6 yrs",
          tag: "PRO",
        },
        {
          name: "PostgreSQL & Redis",
          level: 90,
          experience: "5 yrs",
          tag: "PRO",
        },
        {
          name: "CI/CD GitHub Actions",
          level: 88,
          experience: "5 yrs",
          tag: "PRO",
        },
        {
          name: "Cloudflare Edge Workers",
          level: 85,
          experience: "4 yrs",
          tag: "ADVANCED",
        },
      ],
    },
    {
      category: "Web3 & Blockchain",
      icon: "🔗",
      skills: [
        { name: "Solidity", level: 75, experience: "2 yrs", tag: "INTERMEDIATE" },
        { name: "EVM", level: 80, experience: "3 yrs", tag: "ADVANCED" },
        { name: "Hardhat", level: 85, experience: "4 yrs", tag: "PRO" },
        { name: "Truffle", level: 80, experience: "3 yrs", tag: "ADVANCED" },
        { name: "Ethers.js", level: 90, experience: "5 yrs", tag: "PRO" },
        { name: "Web3.js", level: 85, experience: "4 yrs", tag: "PRO" },
      ],
    },
  ] as SkillCategory[],

  collabs: [
    {
      id: "collab-hyper-edge",
      partner: "HyperEdge Foundation",
      partnerType: "Open Source Org",
      title: "Distributed Edge Cache Protocol (v2.0)",
      role: "Lead Protocol Architect & Contributor",
      period: "2024 - PRESENT",
      status: "ACTIVE",
      description:
        "Co-designed an open-source, ultra-low latency distributed edge cache protocol for multi-region serverless runtimes.",
      contributions: [
        "Architected lock-free data structures in Rust, reducing memory footprint by 35%.",
        "Co-authored RFC specs for async peer-to-peer buffer sync over QUIC.",
        "Mentored 12+ open-source contributors on core module development.",
      ],
      techStack: ["Rust", "Tokio", "QUIC Protocol", "WebAssembly"],
      link: "https://github.com",
      asciiLogo: `+--------------------+
| HYPEREDGE PROTOCOL |
| [STATUS: ACTIVE]   |
+--------------------+`,
    },
    {
      id: "collab-astrosynth",
      partner: "Aetheria Audio Labs",
      partnerType: "Tech Studio",
      title: "Browser WebAudio DSP Sequencer",
      role: "Senior Frontend Engineer & Audio Specialist",
      period: "2023 - 2024",
      status: "COMPLETED",
      description:
        "Joint collaboration to create a browser-based polyphonic synthesizer engine powered by Astro.js and WebAudio Worklets.",
      contributions: [
        "Implemented real-time audio wave visualization using HTML5 Canvas & WebGL shaders.",
        "Optimized audio buffer rendering latency down to sub-5ms across Chrome & Safari.",
        "Built responsive TUI modular controls using Tailwind CSS.",
      ],
      techStack: [
        "Astro.js",
        "TypeScript",
        "WebAudio API",
        "Tailwind CSS",
        "Canvas",
      ],
      link: "https://github.com",
      asciiLogo: `/\\_/\\   AETHERIA
( o.o ) [AUDIO LABS]
 > ^ <  ♪ ♫ ♩ ♬`,
    },
    {
      id: "collab-neural-cli",
      partner: "KernelAI Research Collective",
      partnerType: "Research Team",
      title: "Context-Aware Terminal AI Co-Pilot",
      role: "Core Systems Collaborator",
      period: "2023 - PRESENT",
      status: "ONGOING",
      description:
        "Partnered with AI researchers to build a lightweight, privacy-focused CLI co-pilot that translates intent to verified shell commands.",
      contributions: [
        "Designed local LLM token streaming pipeline via IPC socket sockets.",
        "Engineered strict command validation sandboxing for dangerous shell commands.",
      ],
      techStack: ["Node.js", "TypeScript", "Ollama API", "Inquirer.js"],
      link: "https://github.com",
      asciiLogo: `[KERNEL-AI COLLAB]
Intent    --> [Local LLM]
Execution --> bash -c`,
    },
  ] as CollabItem[],

  commands: [
    {
      name: "help",
      desc: "List all available terminal commands",
      usage: "help",
    },
    {
      name: "about",
      desc: "Display bio, engineering philosophy & summary",
      usage: "about [or cat bio.txt]",
    },
    {
      name: "skills",
      desc: "Display interactive skill proficiency meters",
      usage: "skills [or cat skills.sh]",
    },
    {
      name: "collabs",
      desc: "Display list of team collaborations & partner projects",
      usage: "collabs [or cat collabs.md]",
    },
    {
      name: "neofetch",
      desc: "Display ASCII banner & hardware system specs",
      usage: "neofetch",
    },
    {
      name: "spotify",
      desc: "Display Spotify Now Playing song activity & Audio RPC status",
      usage: "spotify [or np, nowplaying]",
    },
    {
      name: "contact",
      desc: "Display contact info and social handles",
      usage: "contact [or mail]",
    },
    {
      name: "links",
      desc: "Display interactive links to GitHub, LinkedIn, X/Twitter & Email",
      usage: "links [or socials, urls]",
    },
    {
      name: "theme",
      desc: "Switch theme (green, amber, cyan, dracula, mono)",
      usage: "theme <green|amber|cyan|dracula|mono>",
    },
    {
      name: "pong",
      desc: "Play retro 1972 arcade Pong mini-game vs CPU",
      usage: "pong [or game, play, ./pong.sh]",
    },
    {
      name: "snake",
      desc: "Play classic retro Snake arcade mini-game",
      usage: "snake [or playsnake, ./snake.sh]",
    },
    {
      name: "github",
      desc: "Display live GitHub stats, stars, forks, and language metrics",
      usage: "github [or gh, stats]",
    },
    {
      name: "repos",
      desc: "List featured GitHub repositories with star counts and links",
      usage: "repos [or projects]",
    },
    {
      name: "radio",
      desc: "Play retro Lo-Fi/Chiptune radio or stream custom songs from YouTube",
      usage: "radio [play|pause|next|add <url>|vol <n>|list]",
    },
    {
      name: "matrix",
      desc: "Toggle digital rain CRT overlay animation",
      usage: "matrix",
    },
    { name: "crt", desc: "Toggle CRT scanline screen effect", usage: "crt" },
    {
      name: "sfx",
      desc: "Toggle audio feedback keypress sounds",
      usage: "sfx",
    },
    {
      name: "clear",
      desc: "Clear terminal buffer screen",
      usage: "clear [or cls]",
    },
    {
      name: "gui",
      desc: "Switch window layout to TUI Visual Dashboard",
      usage: "gui",
    },
    {
      name: "cli",
      desc: "Switch window layout to Interactive CLI Mode",
      usage: "cli",
    },
  ],
};
