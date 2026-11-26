#!/usr/bin/env node
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse, stringify } from "yaml";

function text(value) {
	return typeof value === "string" && value.trim() ? value.trim() : null;
}

function strings(value) {
	return Array.isArray(value) ? value.map(text).filter(Boolean) : [];
}

function objects(value) {
	return Array.isArray(value)
		? value.filter((item) => item && typeof item === "object" && !Array.isArray(item))
		: [];
}

function externalLinks(value, fallback, location) {
	const links = objects(value);
	const candidates = links.length > 0 ? links : fallback ? [fallback] : [];

	return candidates.map((link, index) => {
		const label = text(link.label);
		const href = text(link.href);
		if (!label || !href) {
			throw new Error(`${location} link ${index + 1} requires label and href.`);
		}

		let url;
		try {
			url = new URL(href);
		} catch {
			throw new Error(`${location} link ${index + 1} must use an absolute HTTP(S) URL.`);
		}
		if (url.protocol !== "http:" && url.protocol !== "https:") {
			throw new Error(`${location} link ${index + 1} must use an absolute HTTP(S) URL.`);
		}

		return { label, href };
	});
}

function metadata(value, location) {
	return objects(value).map((item, index) => {
		const label = text(item.label);
		const itemValue = text(item.value);
		if (!label || !itemValue) {
			throw new Error(`${location} metadata ${index + 1} requires label and value.`);
		}
		return { label, value: itemValue };
	});
}

function compact(record) {
	return Object.fromEntries(
		Object.entries(record).filter(
			([, value]) => value !== undefined && (!Array.isArray(value) || value.length > 0),
		),
	);
}

function slug(value, fallback) {
	return (
		value
			.normalize("NFKD")
			.toLowerCase()
			.replace(/\p{Mark}/gu, "")
			.replace(/[^\p{Letter}\p{Number}]+/gu, "-")
			.replace(/^-|-$/g, "") || fallback
	);
}

function uniqueSlug(base, used) {
	let candidate = base;
	let suffix = 2;
	while (used.has(candidate)) {
		candidate = `${base}-${suffix}`;
		suffix += 1;
	}
	used.add(candidate);
	return candidate;
}

function markdown(data) {
	return `---\n${stringify(data, { lineWidth: 0 }).trimEnd()}\n---\n`;
}

async function readLegacyYaml(root, relativePath) {
	try {
		return parse(await readFile(join(root, relativePath), "utf8"));
	} catch (error) {
		if (error.code === "ENOENT") return null;
		throw error;
	}
}

async function hasMarkdownEntries(directory) {
	try {
		return (await readdir(directory, { recursive: true })).some((file) =>
			/\.mdx?$/.test(file),
		);
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw error;
	}
}

async function writeEntries(directory, entries) {
	await mkdir(directory, { recursive: true });
	await Promise.all(
		entries.map(({ filename, data }) =>
			writeFile(join(directory, filename), markdown(data), { flag: "wx" }),
		),
	);
}

function projectEntries(value) {
	if (!Array.isArray(value)) {
		throw new Error("src/data/projects.yml must contain a project list.");
	}

	const used = new Set();
	return value.map((project, index) => {
		if (!project || typeof project !== "object" || Array.isArray(project)) {
			throw new Error(`Project ${index + 1} must be an object.`);
		}
		const location = `Project ${index + 1}`;
		const title = text(project.title);
		const summary = text(project.description);
		if (!title || !summary) {
			throw new Error(`${location} requires title and description.`);
		}
		const legacyPeriod = text(project.period);
		const period = legacyPeriod ?? "Not specified";
		const explicitStatus = text(project.status);
		const status =
			explicitStatus ??
			(legacyPeriod
				? /\bpresent\b/i.test(legacyPeriod)
					? "active"
					: "past"
				: "unspecified");
		if (!new Set(["active", "past", "unspecified"]).has(status)) {
			throw new Error(`${location} has an unsupported status: ${status}.`);
		}
		const links = externalLinks(
			project.links,
			text(project.url) ? { label: "View project", href: text(project.url) } : null,
			location,
		);

		return {
			filename: `${uniqueSlug(slug(title, `project-${index + 1}`), used)}.md`,
			data: compact({
				title,
				subtitle: text(project.subtitle) ?? undefined,
				summary,
				status,
				period,
				order: index + 1,
				featured: typeof project.featured === "boolean" ? project.featured : undefined,
				badges: strings(project.badges),
				tech: strings(project.tech),
				highlights: strings(project.highlights),
				metadata: metadata(project.metadata, location),
				links,
			}),
		};
	});
}

function teachingEntries(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) {
		throw new Error("src/data/teaching.yml must contain current and past sections.");
	}

	const used = new Set();
	const entries = [];
	for (const group of ["current", "past"]) {
		const sections = value[group] ?? [];
		if (!Array.isArray(sections)) {
			throw new Error(`Teaching ${group} must be a list.`);
		}
		for (const [sectionIndex, section] of sections.entries()) {
			if (!section || typeof section !== "object" || Array.isArray(section)) {
				throw new Error(`Teaching ${group} section ${sectionIndex + 1} must be an object.`);
			}
			const term = text(section.term) ?? "Term not specified";
			const modules = section.modules ?? [];
			if (!Array.isArray(modules)) {
				throw new Error(`Teaching ${group} section ${sectionIndex + 1} modules must be a list.`);
			}

			for (const [moduleIndex, course] of modules.entries()) {
				if (!course || typeof course !== "object" || Array.isArray(course)) {
					throw new Error(
						`Teaching ${group} section ${sectionIndex + 1} course ${moduleIndex + 1} must be an object.`,
					);
				}
				const location = `Teaching ${group} section ${sectionIndex + 1} course ${moduleIndex + 1}`;
				const title = text(course.title) ?? text(course.code) ?? `Course ${entries.length + 1}`;
				const code = text(course.code) ?? "Course";
				const summary = text(course.summary) ?? title;
				const links = externalLinks(course.links, course.link, location);
				const base = slug(`${title}-${term}`, `course-${entries.length + 1}`);

				entries.push({
					filename: `${uniqueSlug(base, used)}.md`,
					data: compact({
						title,
						code,
						summary,
						term,
						status: group === "current" ? "current" : "past",
						order: entries.length + 1,
						badges: strings(course.badges),
						tags: strings(course.tags),
						highlights: strings(course.highlights),
						links,
					}),
				});
			}
		}
	}

	return entries;
}

async function migrateCollection({ root, legacyPath, contentPath, convert }) {
	const legacy = await readLegacyYaml(root, legacyPath);
	if (legacy === null) return { status: "absent", count: 0 };

	const directory = join(root, contentPath);
	if (await hasMarkdownEntries(directory)) {
		return { status: "existing", count: 0 };
	}

	const entries = convert(legacy);
	await writeEntries(directory, entries);
	return { status: "migrated", count: entries.length };
}

export async function migrateLegacyContent(root = process.cwd()) {
	const [projects, teaching] = await Promise.all([
		migrateCollection({
			root,
			legacyPath: "src/data/projects.yml",
			contentPath: "src/content/projects",
			convert: projectEntries,
		}),
		migrateCollection({
			root,
			legacyPath: "src/data/teaching.yml",
			contentPath: "src/content/teaching",
			convert: teachingEntries,
		}),
	]);

	return { projects, teaching };
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
	const result = await migrateLegacyContent();
	console.log(
		`Legacy content migration: projects ${result.projects.status} (${result.projects.count}), teaching ${result.teaching.status} (${result.teaching.count}).`,
	);
}
