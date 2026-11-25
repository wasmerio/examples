import { siteConfig } from '@/config/site';
import { projectHref, type Project } from '@/lib/work';

const absolute = (path: string) => new URL(path, siteConfig.siteUrl).toString();

const person = {
  '@type': 'Person',
  '@id': absolute('/#person'),
  name: siteConfig.author.name,
  jobTitle: siteConfig.author.role,
  email: `mailto:${siteConfig.author.email}`,
  url: siteConfig.siteUrl,
  sameAs: siteConfig.socials.map((social) => social.href),
};

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    person,
    {
      '@type': 'WebSite',
      '@id': absolute('/#website'),
      name: siteConfig.name,
      url: siteConfig.siteUrl,
      description: siteConfig.description,
      inLanguage: siteConfig.language,
      author: { '@id': absolute('/#person') },
    },
  ],
});

export const profileSchema = (path: string) => ({
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: absolute(path),
  inLanguage: siteConfig.language,
  mainEntity: person,
});

export const breadcrumbs = (items: { name: string; href: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absolute(item.href),
  })),
});

export const caseStudySchema = (project: Project, image: string) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CreativeWork',
      name: `${project.data.client} case study`,
      headline: project.data.title,
      description: project.data.summary,
      image: absolute(image),
      dateCreated: String(project.data.year),
      url: absolute(projectHref(project)),
      author: { '@id': absolute('/#person'), '@type': 'Person', name: siteConfig.author.name },
      inLanguage: siteConfig.language,
    },
    breadcrumbs([
      { name: 'Home', href: '/' },
      { name: 'Work', href: '/work/' },
      { name: project.data.client, href: projectHref(project) },
    ]),
  ],
});
