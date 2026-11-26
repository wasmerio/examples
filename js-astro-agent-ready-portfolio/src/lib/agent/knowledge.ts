import { copy } from "$content/copy";
import { site } from "$lib/site";
import { postMarkdown, postMarkdownUrl } from "$lib/content/agent-markdown";
import { blogEntries, blogPosts } from "$lib/content/blog";
import { experience } from "$content/experience";
import { githubProjects } from "$content/github-projects";
import { careerStartDate, profile } from "$content/profile";
import { selectedWork } from "$content/selected-work";
import { skillGroups } from "$content/skills";
import { formatExperience } from "$lib/utils/experience";

// Markdown views of the portfolio data for agents. llms.txt and llms-full.txt
// both read from here, so they never drift from the page.

const years = () => formatExperience(careerStartDate, new Date());
const list = (items: string[]) => items.map((item) => `- ${item}`).join("\n");

export function profileSummary() {
  return `${profile.role} at ${profile.company}. ${years()} years of professional experience.${profile.location ? ` Based in ${profile.location}.` : ""}

Focus: ${profile.focus}

${profile.current}

${profile.previous}`;
}

export function profileMarkdown() {
  return `# ${profile.name}

${profileSummary()}`;
}

export function experienceMarkdown() {
  const roles = experience.map(
    (item) => `## ${item.role}, ${item.company} (${item.period})

${item.summary}

${list(item.highlights)}

Stack: ${item.stack.join(", ")}`,
  );
  return `# Experience\n\n${roles.join("\n\n")}`;
}

export function selectedWorkMarkdown() {
  const items = selectedWork.map((item) => {
    const metrics = item.metrics.map((m) => `${m.value} ${m.label}`).join("; ");
    const link = item.href ? `\n\nMore: ${item.href}` : "";
    return `## ${item.name} (${item.context})

${item.description}

Metrics: ${metrics}
Stack: ${item.stack.join(", ")}${link}`;
  });
  return `# Selected work\n\n${items.join("\n\n")}`;
}

export function projectsMarkdown() {
  const items = githubProjects.map((project) => {
    const metrics = project.metrics?.length
      ? `\nMetrics: ${project.metrics.map((m) => `${m.value} ${m.label}`).join("; ")}`
      : "";
    const language = project.language ? `
Language: ${project.language}` : "";
    return `## ${project.name}

${project.description}

Link: ${project.href}${language}${metrics}
Topics: ${project.topics.join(", ")}`;
  });
  return `# Open-source and side projects\n\n${items.join("\n\n")}`;
}

export function skillsMarkdown() {
  const groups = skillGroups.map(
    (group) =>
      `## ${group.title}\n\nPrimary: ${group.featured.join(", ")}${
        group.more.length ? `\nAlso: ${group.more.join(", ")}` : ""
      }`,
  );
  return `# Skills\n\n${groups.join("\n\n")}`;
}

export function contactMarkdown() {
  const links = profile.links.map(
    (link) => `- ${link.label}: ${link.username} (${link.href})`,
  );
  return `# Contact\n\nEmail: ${profile.email}\nWebsite: ${site.url}\n\n${links.join("\n")}`;
}

export function blogMarkdown() {
  const posts = site.features.blog ? blogPosts : [];
  if (!posts.length) return "# Blog\n\nNo posts published yet.";
  return `# Blog\n\n${list(
    posts.map(
      (post) =>
        `[${post.title}](${site.url}/blog/${post.slug}) (${post.published}, slug \`${post.slug}\`): ${post.description} Markdown: ${postMarkdownUrl(post.slug)}`,
    ),
  )}`;
}

const publishedEntries = () => (site.features.blog ? blogEntries : []);

export function findPost(slug: string) {
  return publishedEntries().find((entry) => entry.slug === slug);
}

// Every published post in full, for llms-full.txt.
export function blogPostsMarkdown() {
  return publishedEntries().map(postMarkdown).join("\n\n---\n\n");
}

export const sections = {
  profile: profileMarkdown,
  experience: experienceMarkdown,
  "selected-work": selectedWorkMarkdown,
  projects: projectsMarkdown,
  skills: skillsMarkdown,
  blog: blogMarkdown,
  contact: contactMarkdown,
} as const;

export type SectionName = keyof typeof sections;

export function fullMarkdown() {
  return Object.values(sections)
    .map((render) => render())
    .join("\n\n---\n\n");
}

// Small passages for keyword search, each tagged with the section it came from.
type Passage = { section: SectionName; title: string; text: string };

// Blog posts split into paragraphs, titled with the post and its section heading.
function blogPassages(): Passage[] {
  return publishedEntries().flatMap((entry) => {
    let heading = "";
    return entry.body.split(/\r?\n\s*\r?\n/).flatMap((block) => {
      const text = block.trim();
      const match = text.match(/^#{2,3}\s+(.*)$/);
      if (match) heading = match[1];
      if (!text || match || text.startsWith("::figure")) return [];
      return [
        {
          section: "blog" as const,
          title: `${entry.title}${heading ? ` > ${heading}` : ""} (${site.url}/blog/${entry.slug})`,
          text,
        },
      ];
    });
  });
}

function passages(): Passage[] {
  return [
    { section: "profile", title: profile.name, text: profileMarkdown() },
    ...experience.flatMap((item) =>
      [item.summary, ...item.highlights].map((text) => ({
        section: "experience" as const,
        title: `${item.role}, ${item.company} (${item.period})`,
        text,
      })),
    ),
    ...selectedWork.map((item) => ({
      section: "selected-work" as const,
      title: item.name,
      text: `${item.description} Stack: ${item.stack.join(", ")}.`,
    })),
    ...githubProjects.map((project) => ({
      section: "projects" as const,
      title: project.name,
      text: `${project.description} Topics: ${project.topics.join(", ")}. ${project.href}`,
    })),
    ...skillGroups.map((group) => ({
      section: "skills" as const,
      title: group.title,
      text: [...group.featured, ...group.more].join(", "),
    })),
    ...blogPassages(),
  ];
}

const tokenize = (value: string) =>
  value.toLowerCase().match(/[a-z0-9][a-z0-9.+#-]*/g) ?? [];

export function search(query: string, limit = 5) {
  const terms = Array.from(new Set(tokenize(query))).filter(
    (term) => term.length > 1,
  );
  if (!terms.length) return [];

  return passages()
    .map((passage) => {
      const words = tokenize(`${passage.title} ${passage.text}`);
      const score = terms.reduce(
        (total, term) => total + words.filter((word) => word === term).length,
        0,
      );
      return { ...passage, score };
    })
    .filter((passage) => passage.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// Every technology named anywhere on the site, for keyword overlap.
const knownTerms = Array.from(
  new Set([
    ...skillGroups.flatMap((group) => [...group.featured, ...group.more]),
    ...experience.flatMap((item) => item.stack),
    ...selectedWork.flatMap((item) => item.stack),
    ...copy.matchTerms,
  ]),
);

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Technologies that are also ordinary English words ("react to feedback",
// "the rest of the team") only match with their exact capitalization.
const caseSensitiveTerms = new Set(["React", "Express", "REST", "Remix", "Gamut", "Jest", "Ingestion"]);

export function keywordOverlap(posting: string) {
  return knownTerms.filter((term) => {
    const exact = caseSensitiveTerms.has(term);
    return new RegExp(
      `(^|[^A-Za-z0-9])${escapeRegExp(term)}($|[^A-Za-z0-9])`,
      exact ? "" : "i",
    ).test(posting);
  });
}
