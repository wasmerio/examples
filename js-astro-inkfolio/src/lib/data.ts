import { parse } from 'yaml';
import projectsRaw from '../data/projects.yaml?raw';
import friendsRaw from '../data/friends.yaml?raw';
import logRaw from '../data/log.json';

export interface Project {
  title: string;
  tag: string;
  status?: string;
  desc: string;
  descZh?: string;
  url: string;
}

export interface Friend {
  name: string;
  url: string;
  desc: string;
  descZh?: string;
  avatar?: string;
}

export const projects = parse(projectsRaw) as Project[];
export const friends = parse(friendsRaw) as Friend[];

export interface LogDay {
  date: string;
  count: number;
}

export interface RepoStat {
  name: string;
  commits: number;
  last: string | null;
}

export const log = logRaw as { updated: string; repos: string[]; repoStats?: RepoStat[]; days: LogDay[] };

/** Streak of consecutive days with at least one entry, counted back from yesterday. */
export function currentStreak(days: LogDay[], today = new Date()): number {
  const byDate = new Map(days.map((d) => [d.date, d.count]));
  const cursor = new Date(today);
  cursor.setDate(cursor.getDate() - 1); // today is usually still empty
  let streak = 0;
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if ((byDate.get(key) ?? 0) > 0) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }
  return streak;
}
