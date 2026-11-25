import type { APIRoute } from 'astro';
import { caseStudies, profile, socialLinks } from '../data/site';

export const GET: APIRoute = () => {
  const projects = caseStudies
    .map((project) => `- ${project.title}: ${project.summary}`)
    .join('\n');
  const profiles = socialLinks.map((link) => `- [${link.label}](${link.href})`).join('\n');
  const body = `# ${profile.name}\n\n> ${profile.bio}\n\n${profile.name} is a ${profile.role} based in ${profile.location}. Core areas: evaluated AI applications, retrieval-augmented generation, agent workflows, machine learning systems, and product engineering.\n\n## Selected work\n\n${projects}\n\n## Profiles\n\n${profiles}\n`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
