import type { APIRoute } from 'astro';
import localHomeData from '../data/home.json';
import localCareerData from '../data/career.json';
import localProjectsData from '../data/projects.json';
import localTechData from '../data/tech.json';

export const GET: APIRoute = async () => {
  const isApiLive = import.meta.env.PROD;
  const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;

  let home = localHomeData;
  let career = localCareerData;
  let projects = localProjectsData;
  let tech = localTechData;

  if (isApiLive && BASE_URL) {
    try {
      const [homeRes, careerRes, projectsRes, techRes] = await Promise.all([
        fetch(`${BASE_URL}/home`),
        fetch(`${BASE_URL}/career`),
        fetch(`${BASE_URL}/projects`),
        fetch(`${BASE_URL}/tech`),
      ]);
      if (homeRes.ok) home = await homeRes.json();
      if (careerRes.ok) career = await careerRes.json();
      if (projectsRes.ok) projects = await projectsRes.json();
      if (techRes.ok) tech = await techRes.json();
    } catch (error) {
      console.error('[llms.txt] API fetch failed, falling back to local JSON data', error);
    }
  }

  const siteUrl = (home.siteUrl || 'https://your-domain.com').replace(/\/$/, '');

  const techCategoriesStr = tech.categories
    ? tech.categories
        .map((cat: any) => `- **${cat.title}:** ${cat.skills.map((s: any) => s.name).join(', ')}`)
        .join('\n')
    : '';

  const careerStr = Array.isArray(career)
    ? career
        .map((item: any) => `- **${item.role}** — ${item.company} (${item.period})\n  * ${item.description}`)
        .join('\n')
    : '';

  const projectsStr = Array.isArray(projects)
    ? projects
        .map((proj: any) => `- **${proj.title}:** ${proj.description}${proj.link ? ` (${proj.link})` : ''}`)
        .join('\n')
    : '';

  const socialsStr = Array.isArray(home.socials)
    ? home.socials
        .filter((s: any) => s.url && s.url !== '#' && s.url !== '')
        .map((s: any) => `- **${s.name}:** ${s.url}`)
        .join('\n')
    : '';

  const markdown = `# ${home.name}

> ${home.description}

## Overview
${home.name} is a ${home.jobTitle || 'Lead Software Engineer'}${home.location ? ` based in ${home.location}` : ''}. ${home.description}

## Key Information
${home.location ? `- **Location:** ${home.location}` : ''}
${home.availability ? `- **Availability:** ${home.availability}` : ''}
- **Portfolio:** ${siteUrl}
${home.resumeUrl ? `- **Resume:** ${home.resumeUrl}` : ''}

## Technical Skills & Categories
${techCategoriesStr}

## Experience & Education
${careerStr}

## Featured Projects
${projectsStr}

## Contact & Links
- **Website:** ${siteUrl}
${socialsStr}
`;

  return new Response(markdown.trim() + '\n', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
