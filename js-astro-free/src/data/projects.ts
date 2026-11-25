import PhoenixIcon from '../assets/logos/Phoenix-logo.svg?raw';
import N8nIcon from '../assets/logos/N8n-logo.svg?raw';
import SupabaseIcon from '../assets/logos/Supabase-logo.svg?raw';
import PosthogIcon from '../assets/logos/posthog-logo.svg?raw';
import PythonIcon from '../assets/logos/Python-logo.svg?raw';
import TailwindIcon from '../assets/logos/Tailwind-logo.svg?raw';


export const projects = [
	{
		title: "Workflow Automation Orchestrator (n8n)",
		techStack: "n8n • Node.js • TypeScript • PostgreSQL",
		description: "Event‑driven workflows for data sync, notifications, and back‑office automation. Custom nodes, secrets management, retries, and metrics.",
		ctaText: "View Repo →",
		ctaLink: "#",
		icon: N8nIcon
	},
	{
		title: "SaaS API Starter (Auth, Billing, RBAC)",
		techStack: "Node.js • TypeScript • PostgreSQL • Supabase • Stripe",
		description: "Production‑ready REST/GraphQL API with JWT auth, role‑based access, Stripe subscriptions, and rate‑limited endpoints.",
		ctaText: "Get Source < / >",
		ctaLink: "#",
		icon: SupabaseIcon
	},
	{
		title: "Realtime Chat Service",
		techStack: "Phoenix • WebSockets • Redis • Docker",
		description: "Low‑latency chat with channels, presence, and backpressure handling. Includes load tests and horizontal scaling notes.",
		ctaText: "Live Demo →",
		ctaLink: "#",
		icon: PhoenixIcon
	},
	{
		title: "Product Analytics Pipeline",
		techStack: "Node.js • PostHog • PostgreSQL • ClickHouse",
		description: "Event ingestion, batching, and replay; user properties and cohorts; dashboards for funnels, retention, and feature adoption.",
		ctaText: "Read Case Study →",
		ctaLink: "#",
		icon: PosthogIcon
	},
	{
		title: "Data Ingestion & ETL",
		techStack: "Python • Airflow • PostgreSQL • S3",
		description: "Scheduled extract/transform/load with schema migrations, data quality checks, and partitioned tables for analytics.",
		ctaText: "View Repo →",
		ctaLink: "#",
		icon: PythonIcon
	},
	{
		title: "Design System",
		techStack: "React • TypeScript • Tailwind CSS • Storybook",
		description: "Accessible UI kit with tokens, theming, and testing. Published as a versioned package with changelogs and docs.",
		ctaText: "Docs →",
		ctaLink: "#",
		icon: TailwindIcon
	},
];