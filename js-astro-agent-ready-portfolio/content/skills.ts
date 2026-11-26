import type { SkillGroup } from "$lib/types/portfolio";

// `featured` skills show first; `more` skills sit behind "show more".
export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    featured: ["TypeScript", "Go", "SQL"],
    more: ["Python", "Bash"],
  },
  {
    title: "Backend",
    featured: ["Node.js", "PostgreSQL", "Redis"],
    more: ["Kafka", "RabbitMQ", "GraphQL", "OpenAPI"],
  },
  {
    title: "Platform",
    featured: ["Kubernetes", "Docker", "Terraform", "GitHub Actions"],
    more: ["Helm", "Argo CD", "AWS", "NGINX", "Linux"],
  },
  {
    title: "Observability",
    featured: ["Prometheus"],
    more: ["Grafana", "OpenTelemetry", "PagerDuty", "Sentry"],
  },
  {
    title: "Tooling",
    featured: [],
    more: ["Vitest", "Git"],
  },
];
