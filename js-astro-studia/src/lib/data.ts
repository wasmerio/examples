/**
 * Typed access to `src/data/`, imported with `?raw` rather than read with
 * `fs` (see images.ts). Nothing here is conditional: a switched-off feature's
 * YAML is parsed and then read by nobody, which is cheaper than the branch.
 */
import { parse } from 'yaml';

import citationsRaw from '../data/citations.yml?raw';

import socialsRaw from '../data/socials.yml?raw';

import repositoriesRaw from '../data/repositories.yml?raw';
import languageColorsRaw from '../data/language_colors.yml?raw';
import githubMetadata from '../data/github-metadata.json';

export type CitationsFile = {
  metadata: { last_updated: string };
  papers: Record<string, { citations?: number; title?: string; year?: number }>;
};

export type Socials = {
  orcid_id: string | null;
  scholar_userid: string | null;
  github_username: string | null;
  dblp_url: string | null;
  linkedin_username: string | null;
  semanticscholar_id: string | null;
  researchgate_username: string | null;
  work_url: string | null;
  pgp_fingerprint: string | null;
  /**
   * Anything the fixed fields do not cover. `icon` names one of the marks in
   * SocialRow.astro; without one the entry renders as a text chip.
   */
  extra?: { label: string; url: string; icon?: string }[] | null;
};

export type Repositories = {
  github_users?: string[];
  github_repos?: string[];
  zenodo_repos?: { name: string; doi: string }[];
};

export type GithubMetadata = {
  fetched: string;
  users: Record<
    string,
    {
      login: string;
      name: string | null;
      bio: string | null;
      followers: number;
      publicRepos: number;
      htmlUrl: string;
      avatarUrl: string;
    }
  >;
  repos: Record<
    string,
    {
      fullName: string;
      description: string | null;
      stars: number;
      forks: number;
      language: string | null;
      license: string | null;
      archived: boolean;
      htmlUrl: string;
      pushedAt: string | null;
    }
  >;
};

// A bare `papers:` with its rows deleted parses as null, not as an empty map.
const parsedCitations = parse(citationsRaw) as Omit<CitationsFile, 'papers'> & {
  papers: CitationsFile['papers'] | null;
};
export const citations: CitationsFile = {
  ...parsedCitations,
  papers: parsedCitations.papers ?? {},
};
export const socials = parse(socialsRaw) as Socials;
export const repositories = parse(repositoriesRaw) as Repositories;
export const languageColors = parse(languageColorsRaw) as Record<string, string>;

/** Written by scripts/fetch-github-metadata.mjs and committed; never fetched
    during the build. */
export const github = githubMetadata as GithubMetadata;
