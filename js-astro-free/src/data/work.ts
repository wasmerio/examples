import jobIconRaw from '../assets/icons/job-title-icon.svg?raw';
import companyIconRaw from '../assets/icons/company-icon.svg?raw';
import locationIconRaw from '../assets/icons/location-icon.svg?raw';
import { sanitizeToOutline } from '../lib/svg';

export const workIcons = {
  job: sanitizeToOutline(jobIconRaw, 15),
  company: sanitizeToOutline(companyIconRaw, 15),
  location: sanitizeToOutline(locationIconRaw, 15),
};

export const work = [
  {
    title: "Senior Software Engineer",
    company: "Acme Cloud",
    region: "United States",
    description:
      "Led the design and delivery of a multi‑tenant platform, decomposed critical monolith paths into services, improved p95 latency by 40%, defined SLOs and on‑call rotations, and mentored junior engineers.",
    technologies: [
      "TypeScript",
      "Node.js",
      "React",
      "PostgreSQL",
      "Redis",
      "AWS",
      "Docker",
      "Kubernetes",
      "Terraform",
      "GraphQL",
    ],
  },
  {
    title: "Staff Software Engineer",
    company: "FinchPay",
    region: "Global",
    description:
      "Architected event‑driven payment services with idempotency and retries, introduced Kafka for async processing, enforced API versioning, and drove observability with structured logging and tracing.",
    technologies: [
      "TypeScript",
      "NestJS",
      "Kafka",
      "PostgreSQL",
      "Redis",
      "gRPC",
      "OpenTelemetry",
      "AWS",
    ],
  },
  {
    title: "Senior Frontend Engineer",
    company: "Insight Analytics",
    region: "Europe",
    description:
      "Owned the design system and SSR/ISR strategy, improved Core Web Vitals (LCP/INP) into the green, and shipped accessible UI components with strong tests and story coverage.",
    technologies: [
      "React",
      "Next.js",
      "Astro",
      "Tailwind CSS",
      "Playwright",
      "Vitest",
    ],
  },
  {
    title: "Software Engineer",
    company: "LaunchPad",
    region: "Brazil",
    description:
      "Built MVPs end‑to‑end: designed REST/GraphQL APIs, set up CI/CD with preview environments, introduced feature flags, and migrated data to Postgres.",
    technologies: [
      "Node.js",
      "Express",
      "GraphQL",
      "Supabase",
      "PostgreSQL",
      "GitHub Actions",
      "Docker",
    ],
  },
];

export type WorkItem = (typeof work)[number];

