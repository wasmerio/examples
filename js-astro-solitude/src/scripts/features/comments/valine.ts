import { Solitude } from '@/scripts/core/api';
import { createIcon } from '@/scripts/core/icons';
import { lifecycle } from '@/scripts/core/lifecycle';
import { initializeMessageBarrage } from '@/scripts/features/comments/message-barrage';
import {
  commentText,
  formatCommentText,
  setStatus,
} from '@/scripts/features/comments/shared';
import {
  commentBarrageEnabled,
  fetchAggregateComments,
  fetchAggregateCount,
  fetchPageComments,
  fetchPostCardComments,
  fetchSiteComments,
  type NormalizedComment,
  postCardAvatarLimit,
  restoreValineStyles,
  runtimeConfig,
  valineConfig,
  valineStyles,
} from '@/scripts/features/comments/valine-data';
export const createAvatar = (comment: NormalizedComment) => {
  const image = document.createElement('img');
  image.className = 'nolazyload';
  image.src = comment.avatar;
  image.alt = comment.nick;
  image.loading = 'lazy';
  image.addEventListener(
    'error',
    () => {
      image.src = runtimeConfig().default_avatar || '/img/default_avatar.avif';
    },
    { once: true },
  );
  return image;
};

export const renderPostCardParticipants = async () => {
  const containers = [
    ...document.querySelectorAll<HTMLElement>(
      '.post-card-commenters[data-comment-path]',
    ),
  ].filter((container) => !container.dataset.commentState);
  if (!containers.length) return;

  containers.forEach((container) => {
    container.dataset.commentState = 'loading';
  });

  try {
    const comments = await fetchPostCardComments(
      containers.map((container) => container.dataset.commentPath || ''),
    );
    const participantsByPath = new Map<
      string,
      Map<string, NormalizedComment>
    >();
    comments.forEach((comment: NormalizedComment) => {
      const participants =
        participantsByPath.get(comment.url) ||
        new Map<string, NormalizedComment>();
      if (!participants.has(comment.participantKey)) {
        participants.set(comment.participantKey, comment);
      }
      participantsByPath.set(comment.url, participants);
    });

    containers.forEach((container) => {
      if (!container.isConnected) return;
      const pathParticipants = participantsByPath
        .get(container.dataset.commentPath || '')
        ?.values();
      const participants = [...(pathParticipants || [])];
      if (!participants.length) {
        container.dataset.commentState = 'empty';
        return;
      }

      const visible = participants.slice(0, postCardAvatarLimit);
      const remaining = participants.length - visible.length;
      const fragment = document.createDocumentFragment();
      visible.forEach((comment) => {
        const item = document.createElement('span');
        item.className = 'post-card-commenter';
        item.title = comment.nick;
        item.setAttribute('aria-hidden', 'true');
        const avatar = createAvatar(comment);
        avatar.alt = '';
        item.append(avatar);
        fragment.append(item);
      });

      const moreText = remaining
        ? formatCommentText('moreParticipants', '${count} more participants', {
            count: remaining,
          })
        : '';
      if (remaining) {
        const more = document.createElement('span');
        more.className = 'post-card-commenter-more';
        more.textContent = `+${remaining}`;
        more.title = moreText;
        more.setAttribute('aria-hidden', 'true');
        fragment.append(more);
      }

      const names = visible.map((comment) => comment.nick).join(', ');
      const participantText = formatCommentText(
        'participants',
        'Comment participants: ${names}',
        { names },
      );
      container.setAttribute('role', 'group');
      container.setAttribute(
        'aria-label',
        moreText ? `${participantText}; ${moreText}` : participantText,
      );
      container.replaceChildren(fragment);
      container.hidden = false;
      container.dataset.commentState = 'ready';
      container.parentElement
        ?.querySelector<HTMLElement>('.article-meta.tags')
        ?.setAttribute('hidden', '');
    });

    window.lazyLoadInstance?.update?.();
  } catch {
    containers.forEach((container) => {
      if (container.isConnected) container.dataset.commentState = 'error';
    });
  }
};

export const refreshTimes = (container: Element) => {
  Solitude.changeTimeFormat?.(container.querySelectorAll('time'));
  window.lazyLoadInstance?.update?.();
  Solitude.pjax?.refresh?.();
};

export const renderAside = (
  container: Element,
  comments: NormalizedComment[],
) => {
  const limit = Number(Solitude.config.comment?.newest_comment?.limit || 5);
  const items = comments.slice(0, limit);
  container.setAttribute('aria-busy', 'false');
  if (!items.length) {
    setStatus(container, commentText('empty', 'No comments yet'), 'empty');
    return;
  }
  const fragment = document.createDocumentFragment();
  items.forEach((comment) => {
    const item = document.createElement('a');
    item.className = 'aside-list-item';
    item.href = comment.url;
    item.title = comment.title;
    const thumbnail = document.createElement('div');
    thumbnail.className = 'thumbnail';
    const avatar = createAvatar(comment);
    avatar.alt = '';
    thumbnail.append(avatar);
    const content = document.createElement('div');
    content.className = 'content';
    const meta = document.createElement('div');
    meta.className = 'comment-meta';
    const author = document.createElement('span');
    author.className = 'comment-author';
    author.textContent = comment.nick;
    const time = document.createElement('time');
    time.className = 'datetime';
    time.dateTime = comment.date;
    meta.append(author, time);
    const summary = document.createElement('div');
    summary.className = 'comment';
    summary.textContent =
      comment.content || commentText('empty', 'No comments yet');
    const source = document.createElement('div');
    source.className = 'comment-source';
    const sourceIcon = createIcon('lucide:file-text');
    const sourceTitle = document.createElement('span');
    sourceTitle.textContent = comment.title;
    source.append(sourceIcon, sourceTitle);
    content.append(meta, summary, source);
    item.append(thumbnail, content);
    fragment.append(item);
  });
  container.replaceChildren(fragment);
  refreshTimes(container);
};

export const createCommentCard = (comment: NormalizedComment) => {
  const card = document.createElement('div');
  card.className = 'comment-card';
  card.title = comment.title;
  card.dataset.solitudeAction = 'navigateTo';
  card.dataset.solitudeUrl = comment.url;
  const info = document.createElement('div');
  info.className = 'comment-info';
  info.append(createAvatar(comment));
  const user = document.createElement('span');
  user.className = 'comment-user';
  user.textContent = comment.nick;
  const userMeta = document.createElement('div');
  userMeta.append(user);
  const time = document.createElement('time');
  time.className = 'comment-time';
  time.dateTime = comment.date;
  info.append(userMeta, time);
  const content = document.createElement('div');
  content.className = 'comment-content';
  content.textContent =
    comment.content || commentText('empty', 'No comments yet');
  const title = document.createElement('div');
  title.className = 'comment-title';
  const icon = createIcon('lucide:message-circle');
  title.append(icon, document.createTextNode(` ${comment.title}`));
  card.append(info, content, title);
  return card;
};

export const renderCards = (
  container: Element,
  comments: NormalizedComment[],
  limit: number,
) => {
  const items = comments.slice(0, limit);
  container.setAttribute('aria-busy', 'false');
  if (!items.length) {
    container.textContent = commentText('empty', 'No comments yet');
    return;
  }
  container.replaceChildren(...items.map(createCommentCard));
  Solitude.diffDateFormat?.(container.querySelectorAll('time.comment-time'));
  window.lazyLoadInstance?.update?.();
  Solitude.pjax?.refresh?.();
};

export const renderAggregateSurfaces = async () => {
  const aside = [
    ...document.querySelectorAll<HTMLElement>(
      '.card-recent-comment .aside-list',
    ),
  ];
  const consoleList = document.querySelector<HTMLElement>(
    '#console .console_recentcomments',
  );
  const recentPage = document.querySelector<HTMLElement>(
    '#page .console_recentcomments.recent-comments-list',
  );
  if (!aside.length && !consoleList && !recentPage) return;
  try {
    const comments = await fetchAggregateComments();
    aside.forEach((container) => renderAside(container, comments));
    if (consoleList) renderCards(consoleList, comments, 6);
    if (recentPage)
      renderCards(
        recentPage,
        comments,
        Number(Solitude.config.recent_comments?.limit || 50),
      );
  } catch {
    aside.forEach((container) => {
      container.setAttribute('aria-busy', 'false');
      setStatus(
        container,
        commentText('error', 'Unable to load comments'),
        'error',
      );
    });
    [consoleList, recentPage]
      .filter((container): container is HTMLElement => Boolean(container))
      .forEach((container) => {
        container.setAttribute('aria-busy', 'false');
        container.textContent = commentText('error', 'Unable to load comments');
      });
  }
};

export const renderMessageBarrage = async () => {
  const container = document.querySelector<HTMLElement>(
    '#barrage[data-native-barrage]',
  );
  const status = document.getElementById('message-barrage-status');
  if (!container || !status) return;
  const signal = lifecycle.signal;
  try {
    const comments = await fetchSiteComments();
    if (signal.aborted || !container.isConnected) return;
    status.textContent = comments.length
      ? ''
      : commentText('empty', 'No comments yet');
    status.setAttribute('aria-busy', 'false');
    initializeMessageBarrage(container, comments, createAvatar);
  } catch {
    if (signal.aborted || !container.isConnected) return;
    status.setAttribute('aria-busy', 'false');
    status.textContent = commentText('error', 'Unable to load comments');
  }
};

export const renderAggregateCount = async () => {
  const target = document.getElementById('valine_allcount');
  if (!target) return;
  try {
    target.textContent = String(await fetchAggregateCount());
  } catch {
    target.textContent = '–';
    target.title = commentText('error', 'Unable to load comments');
  }
};

export const initializePageBarrage = async (comments: NormalizedComment[]) => {
  if (
    !commentBarrageEnabled() ||
    !document.querySelector<HTMLElement>('.comment-barrage')
  ) {
    return;
  }
  const script = runtimeConfig().barrage_script;
  if (!script) return;
  await Solitude.loadScript(script);
  window.initializeCommentBarrage?.(
    comments.map((comment) => ({
      content: comment.content,
      nick: comment.nick,
      avatar: comment.avatar,
      id: comment.id,
      url: comment.url,
    })),
  );
};

export const initializeValineEffects = async () => {
  if (document.querySelector<HTMLElement>('#barrage[data-native-barrage]'))
    return;
  try {
    const comments = await fetchPageComments(location.pathname);
    await initializePageBarrage(comments);
  } catch {
    const barrage = document.querySelector<HTMLElement>('.comment-barrage');
    if (barrage) barrage.replaceChildren();
  }
};

export const mountValine = async (mount: HTMLElement) => {
  if (mount.dataset.initialized === 'true') return;
  mount.dataset.initialized = 'true';
  try {
    const signal = lifecycle.signal;
    await Solitude.loadScript(Solitude.config.cdn.valine);
    document.head.querySelectorAll('style').forEach((style) => {
      if (style.textContent?.includes('.v[data-class=v]'))
        valineStyles.add(style);
    });
    restoreValineStyles();
    if (signal.aborted || !mount.isConnected) return;
    const Valine = window.Valine;
    if (typeof Valine !== 'function') throw new Error('Valine is unavailable');
    const config = valineConfig();
    const instance = new Valine({
      ...(config.option || {}),
      el: '#vcomment',
      appId: config.appId,
      appKey: config.appKey,
      serverURLs: config.serverURLs,
      avatar: config.avatar,
      visitor: Boolean(config.visitor),
      path: location.pathname,
    });
    // Valine replaces the mount element's class name while rendering. Restore
    // the theme opt-in afterwards so the Hugo output matches the Hexo styles.
    mount.classList.toggle('valine-theme-style', Boolean(config.style));
    Solitude.lightbox?.(
      document.querySelectorAll<HTMLImageElement>(
        '#vcomment .vcontent img:not(.vemoji)',
      ),
    );
    Solitude.owoBig?.({ body: '#vcomment .vwrap', item: '.vemojis i' });
    Solitude.onPageCleanup?.(() => instance?.destroy?.());
    await initializeValineEffects();
  } catch {
    mount.dataset.initialized = 'false';
    setStatus(mount, commentText('error', 'Unable to load comments'), 'error');
  }
};

export const initializeValine = () => {
  const mount = document.getElementById('vcomment');
  if (!mount) return;
  if (
    !Solitude.config.comment?.lazyload ||
    !('IntersectionObserver' in window)
  ) {
    void mountValine(mount);
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      void mountValine(mount);
    },
    { rootMargin: '200px 0px' },
  );
  observer.observe(mount);
  Solitude.onPageCleanup?.(() => observer.disconnect());
};
