// SPDX-License-Identifier: MIT
// ── Customize your profile, timeline, skills, etc. below ──

export const profile = {
  name: "Your Name",
  roleTop: "Full-Stack Developer",
  roleMid: "& Open-Source Contributor",
  tagline: {
    en: "I build modern web apps, contribute to open source, and love turning ideas into shipping products.",
    de: "Ich entwickle moderne Web-Apps, trage zu Open Source bei und verwandle Ideen gern in fertige Produkte.",
  },
  links: {
    github: "https://github.com/username",
    linkedin: "https://www.linkedin.com/in/username/",
    email: "mailto:hello@example.com",
  },
  about: {
    en: "Full-Stack Developer passionate about clean architecture, developer tooling, and automation. I work with TypeScript, React, Node.js, and Docker to build reliable, well-tested software. Always exploring new ways to improve workflows and ship faster.",
    de: "Full-Stack-Entwickler mit Leidenschaft für saubere Architektur, Developer-Tooling und Automatisierung. Ich arbeite mit TypeScript, React, Node.js und Docker, um zuverlässige, gut getestete Software zu bauen. Immer auf der Suche nach neuen Wegen, Workflows zu verbessern und schneller auszuliefern.",
  },
};

export const locationLabel = "Berlin";

export const languages = {
  en: [
    { name: "English", level: "Native" },
    { name: "German", level: "B2" },
    { name: "Spanish", level: "A2" },
  ],
  de: [
    { name: "Englisch", level: "Muttersprache" },
    { name: "Deutsch", level: "B2" },
    { name: "Spanisch", level: "A2" },
  ],
};

export const timeline = {
  en: [
    {
      kind: "Work",
      title: "Senior Developer — Acme Corp",
      date: "01/2024 – Present",
      text: "Leading frontend architecture for the main product. Building design system components, improving CI/CD pipelines, and mentoring junior developers.",
      logo: "company-a.svg",
    },
    {
      kind: "Education",
      title: "B.Sc. Computer Science — Example University",
      date: "09/2018 – 06/2022",
      text: "Bachelor's degree covering algorithms, distributed systems, software engineering, and web technologies. Capstone project: real-time collaboration tool.",
      logo: "university.svg",
    },
    {
      kind: "Internship",
      title: "Frontend Intern — StartupXYZ",
      date: "06/2021 – 09/2021",
      text: "Built interactive dashboards with React and D3.js. Contributed to the component library and wrote unit tests.",
      logo: "startup.svg",
    },
  ],
  de: [
    {
      kind: "Arbeit",
      title: "Senior Developer — Acme Corp",
      date: "01/2024 – Heute",
      text: "Leitung der Frontend-Architektur für das Hauptprodukt. Aufbau von Design-System-Komponenten, Verbesserung der CI/CD-Pipelines und Mentoring von Junior-Entwicklern.",
      logo: "company-a.svg",
    },
    {
      kind: "Studium",
      title: "B.Sc. Informatik — Beispiel-Universit\u00e4t",
      date: "09/2018 – 06/2022",
      text: "Bachelorstudium in Algorithmen, verteilten Systemen, Software Engineering und Web-Technologien. Abschlussprojekt: Echtzeit-Kollaborationstool.",
      logo: "university.svg",
    },
    {
      kind: "Praktikum",
      title: "Frontend Praktikant — StartupXYZ",
      date: "06/2021 – 09/2021",
      text: "Interaktive Dashboards mit React und D3.js erstellt. Beitr\u00e4ge zur Komponentenbibliothek und Unit-Tests geschrieben.",
      logo: "startup.svg",
    },
  ],
};

export const volunteering = {
  en: [
    {
      kind: "Volunteer",
      title: "Workshop Lead — Local Dev Meetup",
      date: "03/2023 – Present",
      text: "Organizing monthly workshops on web development topics. Teaching beginners HTML, CSS, and JavaScript fundamentals.",
      logo: "meetup.svg",
    },
  ],
  de: [
    {
      kind: "Ehrenamt",
      title: "Workshop-Leitung — Lokales Dev Meetup",
      date: "03/2023 – Heute",
      text: "Organisation monatlicher Workshops zu Webentwicklungsthemen. Vermittlung von HTML, CSS und JavaScript-Grundlagen an Anf\u00e4nger.",
      logo: "meetup.svg",
    },
  ],
};

export const exploring = {
  en: [
    {
      icon: "🤖",
      title: "AI-Assisted Development",
      text: "Exploring how AI tools can improve developer workflows — from code review to automated testing and documentation.",
    },
    {
      icon: "🐳",
      title: "Container Orchestration",
      text: "Deepening Docker and Kubernetes skills toward production-grade deployment and infrastructure as code.",
    },
  ],
  de: [
    {
      icon: "🤖",
      title: "KI-gestützte Entwicklung",
      text: "Erforschung, wie KI-Tools Entwickler-Workflows verbessern können — von Code-Review über automatisiertes Testen bis zur Dokumentation.",
    },
    {
      icon: "🐳",
      title: "Container-Orchestrierung",
      text: "Vertiefung von Docker- und Kubernetes-Kenntnissen in Richtung produktionsreifer Bereitstellung und Infrastructure as Code.",
    },
  ],
};

export const skills = {
  core: ["TypeScript", "React", "Node.js", "Git", "REST APIs", "GraphQL"],
  automation: ["CI/CD", "GitHub Actions", "Docker Compose"],
  infrastructure: ["Docker", "Nginx", "Linux", "Cloud (AWS/GCP)"],
  monitoring: ["Logging", "Metrics", "Error Tracking", "Alerting"],
  dev: [
    "JavaScript",
    "Python",
    "PostgreSQL",
    "MongoDB",
    "Jest",
    "Playwright",
    "Figma",
    "Agile / Scrum",
  ],
};
