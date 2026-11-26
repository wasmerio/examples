#!/usr/bin/env bun
/**
 * Shared helpers for the project sync / add scripts.
 */

export interface Project {
	name: string;
	description: string;
	repo: string;
	stars: string;
	updated: string;
	url: string;
	size: string;
	date: string;
	homepage?: string;
}

export interface GHRepo {
	full_name: string;
	name: string;
	description: string | null;
	html_url: string;
	homepage: string | null;
	stargazers_count: number;
	size: number;
	updated_at: string;
}

const MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

export function formatStars(n: number): string {
	const comma = (x: number) => x.toLocaleString("en-US");
	if (n >= 1_000_000) {
		const v = (n / 1_000_000).toFixed(1).replace(/\.0$/, "");
		return `★ ${v}m`;
	}
	if (n >= 1_000) {
		const v = (n / 1_000).toFixed(1).replace(/\.0$/, "");
		return `★ ${v}k`;
	}
	if (n === 0) return "★ 1";
	return `★ ${comma(n)}`;
}

export function formatSize(kb: number): string {
	const trimmed = (x: number) =>
		x.toLocaleString("en-US", { maximumFractionDigits: 1 });
	if (kb === 0) return "—";
	if (kb >= 1024 * 1024) return `${trimmed(kb / 1024 / 1024)}G`;
	if (kb >= 1024) return `${trimmed(kb / 1024)}M`;
	return `${kb.toLocaleString("en-US")}K`;
}

export function formatDate(iso: string): string {
	const d = new Date(iso);
	return `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, "0")}`;
}

export function formatRelative(iso: string): string {
	const d = new Date(iso);
	const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
	if (days < 1) return "updated today";
	if (days === 1) return "updated yesterday";
	if (days < 7) return `updated ${days} days ago`;
	if (days < 30) {
		const w = Math.floor(days / 7);
		return `updated ${w} week${w > 1 ? "s" : ""} ago`;
	}
	if (days < 365) {
		const m = Math.floor(days / 30);
		return `updated ${m} month${m > 1 ? "s" : ""} ago`;
	}
	const y = Math.floor(days / 365);
	return `updated ${y} year${y > 1 ? "s" : ""} ago`;
}

export function parseRepoUrl(
	url: string,
): { owner: string; repo: string } | null {
	const m = url.match(
		/^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/,
	);
	return m ? { owner: m[1], repo: m[2] } : null;
}

export async function fetchRepo(
	owner: string,
	repo: string,
): Promise<GHRepo | null> {
	const url = `https://api.github.com/repos/${owner}/${repo}`;
	const headers: Record<string, string> = {
		Accept: "application/vnd.github+json",
		"User-Agent": "astro-distro-sync",
		"X-GitHub-Api-Version": "2022-11-28",
	};
	const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
	if (token) headers.Authorization = `Bearer ${token}`;

	const res = await fetch(url, { headers });
	if (!res.ok) {
		console.error(
			`  ✗ GitHub ${res.status} ${res.statusText} — ${owner}/${repo}`,
		);
		return null;
	}
	return (await res.json()) as GHRepo;
}

export function buildProjectFromUrl(repo: GHRepo, url: string): Project {
	const description = (repo.description ?? "").trim();
	const project: Project = {
		name: repo.name,
		description:
			description.length > 90
				? `${description.slice(0, 87).trimEnd()}…`
				: description,
		repo: `github.com/${repo.full_name}`,
		stars: formatStars(repo.stargazers_count),
		updated: formatRelative(repo.updated_at),
		size: formatSize(repo.size),
		date: formatDate(repo.updated_at),
		url,
	};
	if (repo.homepage) project.homepage = repo.homepage;
	return project;
}
