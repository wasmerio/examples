import { Solitude } from '@/scripts/core/api';
import { commentText } from '@/scripts/features/comments/shared';
export interface ValineRecord {
  objectId?: string;
  nick?: string;
  mail?: string;
  comment?: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NormalizedComment {
  id: string;
  nick: string;
  participantKey: string;
  content: string;
  url: string;
  title: string;
  avatar: string;
  date: string;
}

export interface CommentRuntimeConfiguration {
  routes?: Record<string, string>;
  default_avatar?: string;
  barrage_script?: string;
}

export const routeChunkSize = 40;

export const postCardPageSize = 1000;

export const postCardAvatarLimit = 5;

export const aggregateCacheVersion = 3;

export let aggregateRequest: Promise<NormalizedComment[]> | null = null;

export let siteCommentsRequest: Promise<NormalizedComment[]> | null = null;

export let countRequest: Promise<number> | null = null;

export let md5Request: Promise<((value: string) => string) | undefined> | null =
  null;

export const postCardRequests = new Map<string, Promise<NormalizedComment[]>>();

export const valineStyles = new Set<HTMLStyleElement>();

export const restoreValineStyles = () => {
  for (const style of valineStyles) {
    if (!style.isConnected) document.head.append(style);
  }
};

document.addEventListener('astro:after-swap', restoreValineStyles);

export const runtimeConfig = () =>
  (Solitude.config.comment_runtime || {}) as CommentRuntimeConfiguration;

export const valineConfig = () => {
  const config = Solitude.config.valine || {};
  return config;
};

export const commentBarrageEnabled = () =>
  Boolean(Solitude.config.comment?.commentBarrage);

export const valineReady = () => {
  const config = valineConfig();
  return Boolean(config.appId && config.appKey && config.serverURLs);
};

export const routeEntries = () => Object.entries(runtimeConfig().routes || {});

export const chunks = <T>(items: T[], size: number) => {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
};

export const stableSignature = (source: string) => {
  let hash = 5381;
  for (let index = 0; index < source.length; index += 1) {
    hash = ((hash << 5) + hash) ^ source.charCodeAt(index);
  }
  return (hash >>> 0).toString(36);
};

export const requestValine = async (
  parameters: Record<string, string | number>,
) => {
  const config = valineConfig();
  const endpoint = new URL(
    `${String(config.serverURLs).replace(/\/$/, '')}/1.1/classes/Comment`,
  );
  Object.entries(parameters).forEach(([key, value]) =>
    endpoint.searchParams.set(key, String(value)),
  );
  const response = await fetch(endpoint, {
    headers: {
      'X-LC-Id': String(config.appId),
      'X-LC-Key': String(config.appKey),
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok)
    throw new Error(`Valine request failed with ${response.status}`);
  return response.json();
};

export const loadMd5 = () => {
  if (typeof window.md5 === 'function') {
    return Promise.resolve(window.md5 as (value: string) => string);
  }
  if (md5Request) return md5Request;
  const source = Solitude.config.cdn?.blueimp_md5;
  md5Request = source
    ? Solitude.loadScript(source)
        .then(() =>
          typeof window.md5 === 'function'
            ? (window.md5 as (value: string) => string)
            : undefined,
        )
        .catch(() => undefined)
    : Promise.resolve(undefined);
  return md5Request;
};

export const avatarUrl = async (mail = '') => {
  const fallback = runtimeConfig().default_avatar || '/img/default_avatar.avif';
  if (!mail.trim()) return fallback;
  const md5 = await loadMd5();
  if (!md5) return fallback;
  const root = String(Solitude.config.comment?.avatar || 'https://weavatar.com')
    .replace(/\/$/, '')
    .replace(/\/avatar$/, '');
  return `${root}/avatar/${md5(mail.trim().toLowerCase())}`;
};

export const summarize = (source = '') => {
  const image = `[${commentText('image', 'Image')}]`;
  const link = `[${commentText('link', 'Link')}]`;
  const code = `[${commentText('code', 'Code')}]`;
  const emoji = `[${commentText('emoji', 'Emoji')}]`;
  return String(source)
    .replace(/```[\s\S]*?```/g, code)
    .replace(/<pre[\s\S]*?<\/pre>/gi, code)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, image)
    .replace(/<img\b[^>]*>/gi, image)
    .replace(/\[[^\]]*\]\([^)]*\)/g, link)
    .replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, link)
    .replace(/:[a-z0-9_\u4e00-\u9fa5]+:/gi, emoji)
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 150);
};

export const normalizeRecords = async (records: ValineRecord[]) => {
  const routes = runtimeConfig().routes || {};
  const normalized = await Promise.all(
    records.map(async (record) => {
      const url = String(record.url || '');
      if (!routes[url]) return null;
      const nick =
        String(record.nick || '').trim() ||
        commentText('anonymous', 'Anonymous');
      const normalizedMail = String(record.mail || '')
        .trim()
        .toLowerCase();
      return {
        id: String(record.objectId || `${url}-${record.createdAt || ''}`),
        nick,
        participantKey: normalizedMail
          ? `mail:${stableSignature(normalizedMail)}`
          : `nick:${nick.toLocaleLowerCase()}`,
        content: summarize(record.comment),
        url,
        title: routes[url],
        avatar: await avatarUrl(record.mail),
        date: String(record.updatedAt || record.createdAt || ''),
      } satisfies NormalizedComment;
    }),
  );
  return normalized.filter((item): item is NormalizedComment => Boolean(item));
};

export const aggregateLimit = () =>
  Math.max(
    Number(Solitude.config.comment?.newest_comment?.limit || 5),
    Number(Solitude.config.recent_comments?.limit || 50),
    8,
  );

export const cacheTtl = () => {
  const values = [
    Solitude.config.comment?.newest_comment?.storage,
    Solitude.config.console?.recentComment?.storage,
    Solitude.config.recent_comments?.cache,
  ]
    .map(Number)
    .filter((value) => Number.isFinite(value) && value > 0);
  return values.length ? Math.min(...values) : 0;
};

export const routeCacheSignature = () => {
  const source = routeEntries()
    .map(([path]) => path)
    .sort()
    .join('|');
  return stableSignature(source);
};

export const aggregateCacheKey = () =>
  `valine-hugo-comments:v${aggregateCacheVersion}:${location.host}:${routeCacheSignature()}`;

export const countCacheKey = () =>
  `valine-hugo-count:v${aggregateCacheVersion}:${location.host}:${routeCacheSignature()}`;

export const postCardCacheKey = (signature: string) =>
  `valine-hugo-post-card:v${aggregateCacheVersion}:${location.host}:${signature}`;

export const fetchAggregateComments = () => {
  if (aggregateRequest) return aggregateRequest;
  const routes = routeEntries();
  const allowed = new Set(routes.map(([path]) => path));
  const cached =
    Solitude.saveToLocal.get<NormalizedComment[]>(aggregateCacheKey());
  if (cached) {
    aggregateRequest = Promise.resolve(
      cached.filter((item: NormalizedComment) => allowed.has(item.url)),
    );
    return aggregateRequest;
  }
  aggregateRequest = (async () => {
    if (!routes.length) return [];
    const limit = aggregateLimit();
    const responses = await Promise.all(
      chunks(
        routes.map(([path]) => path),
        routeChunkSize,
      ).map((paths) =>
        requestValine({
          where: JSON.stringify({ url: { $in: paths } }),
          order: '-createdAt',
          limit,
        }),
      ),
    );
    const records = responses.flatMap((response) => response.results || []);
    const unique = [
      ...new Map(records.map((record) => [record.objectId, record])).values(),
    ] as ValineRecord[];
    const result = (await normalizeRecords(unique))
      .sort((left, right) => Date.parse(right.date) - Date.parse(left.date))
      .slice(0, limit);
    if (result.length) {
      Solitude.saveToLocal.set(aggregateCacheKey(), result, cacheTtl());
    }
    return result;
  })().catch((error) => {
    aggregateRequest = null;
    throw error;
  });
  return aggregateRequest;
};

export const fetchSiteComments = () => {
  if (siteCommentsRequest) return siteCommentsRequest;
  const cacheKey = `${aggregateCacheKey()}:all`;
  let cached: NormalizedComment[] | undefined;
  try {
    cached = Solitude.saveToLocal.get(cacheKey);
  } catch {
    // Private browsing may disable storage; the feed still works without it.
  }
  const allowed = new Set(routeEntries().map(([path]) => path));
  if (Array.isArray(cached)) {
    return Promise.resolve(
      cached.filter((comment: NormalizedComment) => allowed.has(comment.url)),
    );
  }
  siteCommentsRequest = (async () => {
    const records: ValineRecord[] = [];
    for (const paths of chunks([...allowed], routeChunkSize)) {
      let skip = 0;
      while (true) {
        const response = await requestValine({
          where: JSON.stringify({ url: { $in: paths } }),
          order: '-createdAt,objectId',
          limit: postCardPageSize,
          skip,
        });
        const page = (response.results || []) as ValineRecord[];
        records.push(...page);
        if (page.length < postCardPageSize) break;
        skip += page.length;
      }
    }
    const normalized = await normalizeRecords(records);
    const comments = [
      ...new Map(normalized.map((item) => [item.id, item])).values(),
    ].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    try {
      Solitude.saveToLocal.set(cacheKey, comments, cacheTtl());
    } catch {
      // A complete site feed may exceed the browser's cache quota.
    }
    return comments;
  })().finally(() => {
    siteCommentsRequest = null;
  });
  return siteCommentsRequest;
};

export const fetchPostCardComments = (paths: string[]) => {
  const availableRoutes = runtimeConfig().routes || {};
  const allowedPaths = [...new Set(paths)]
    .filter((path) => Boolean(availableRoutes[path]))
    .sort();
  if (!allowedPaths.length) return Promise.resolve([]);
  const signature = stableSignature(allowedPaths.join('|'));
  const activeRequest = postCardRequests.get(signature);
  if (activeRequest) return activeRequest;
  const cached = Solitude.saveToLocal.get<NormalizedComment[]>(
    postCardCacheKey(signature),
  );
  if (cached) {
    const result = Promise.resolve(
      cached.filter((comment: NormalizedComment) =>
        allowedPaths.includes(comment.url),
      ),
    );
    postCardRequests.set(signature, result);
    return result;
  }

  const request = (async () => {
    const records: ValineRecord[] = [];
    for (const pathGroup of chunks(allowedPaths, routeChunkSize)) {
      let skip = 0;
      while (true) {
        const response = await requestValine({
          where: JSON.stringify({ url: { $in: pathGroup } }),
          keys: 'objectId,nick,mail,url,createdAt,updatedAt',
          order: '-createdAt',
          limit: postCardPageSize,
          skip,
        });
        const page = (response.results || []) as ValineRecord[];
        records.push(...page);
        if (page.length < postCardPageSize) break;
        skip += page.length;
      }
    }
    const unique = [
      ...new Map(
        records.map((record) => [
          record.objectId ||
            `${record.url || ''}-${record.createdAt || ''}-${record.nick || ''}`,
          record,
        ]),
      ).values(),
    ];
    const result = (await normalizeRecords(unique)).sort(
      (left, right) => Date.parse(right.date) - Date.parse(left.date),
    );
    Solitude.saveToLocal.set(postCardCacheKey(signature), result, cacheTtl());
    return result;
  })();

  postCardRequests.set(signature, request);
  void request.catch(() => postCardRequests.delete(signature));
  return request;
};

export const fetchAggregateCount = () => {
  if (countRequest) return countRequest;
  const cached = Solitude.saveToLocal.get(countCacheKey());
  if (typeof cached === 'number') {
    countRequest = Promise.resolve(cached);
    return countRequest;
  }
  const paths = routeEntries().map(([path]) => path);
  countRequest = (async () => {
    if (!paths.length) return 0;
    const responses = await Promise.all(
      chunks(paths, routeChunkSize).map((group) =>
        requestValine({
          where: JSON.stringify({ url: { $in: group } }),
          count: 1,
          limit: 0,
        }),
      ),
    );
    const count = responses.reduce(
      (total, response) => total + Number(response.count || 0),
      0,
    );
    if (count > 0) {
      Solitude.saveToLocal.set(countCacheKey(), count, cacheTtl());
    }
    return count;
  })().catch((error) => {
    countRequest = null;
    throw error;
  });
  return countRequest;
};

export const fetchPageComments = async (path: string) => {
  const response = await requestValine({
    where: JSON.stringify({ url: path }),
    order: '-createdAt',
    limit: 1000,
  });
  return normalizeRecords(response.results || []);
};
