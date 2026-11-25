import { Solitude } from '@/scripts/core/api';
import type { CommentProvider } from '@/types/runtime';
export const providers = () =>
  String(Solitude.config.comment?.use || '')
    .split(',')
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean) as CommentProvider[];

export const commentText = (
  key: keyof import('@/types/runtime').SolitudeSiteConfiguration['lang']['comments'],
  fallback: string,
) => Solitude.config.lang?.comments?.[key] || fallback;

export const formatCommentText = (
  key: keyof import('@/types/runtime').SolitudeSiteConfiguration['lang']['comments'],
  fallback: string,
  values: Record<string, string | number>,
) =>
  Object.entries(values).reduce(
    (text, [name, value]) => text.split(`\${${name}}`).join(String(value)),
    commentText(key, fallback),
  );

export const setStatus = (
  container: Element,
  message: string,
  state: string,
) => {
  const status = document.createElement('div');
  status.className = `comment-status is-${state}`;
  status.textContent = message;
  container.replaceChildren(status);
};
