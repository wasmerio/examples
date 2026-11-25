import type { NormalizedComment } from '@/scripts/features/comments';
import { lifecycle } from '@/scripts/core/lifecycle';

interface Bullet {
  element: HTMLAnchorElement;
  x: number;
  width: number;
}
interface Lane {
  bullets: Bullet[];
  readyAt: number;
}

// Native, independently scheduled bullets: no duplicated card tracks or
// third-party animation runtime. Every lane shares a velocity to avoid collisions.
export const initializeMessageBarrage = (
  container: HTMLElement,
  comments: NormalizedComment[],
  createAvatar: (comment: NormalizedComment) => HTMLImageElement,
) => {
  if (container.dataset.initialized === 'true') return;
  container.dataset.initialized = 'true';
  const controls = [
    ...document.querySelectorAll<HTMLButtonElement>('[data-message-barrage]'),
  ];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const loop = container.dataset.loop === 'true';
  const hover = container.dataset.hover === 'true';
  const speed = Math.max(1, Number(container.dataset.speed) || 20) * 3;
  const gap = 64;
  const laneHeight = 56;
  let visible = !motion.matches;
  let frame: number | null = null;
  let lastTime = 0;
  let elapsed = 0;
  let nextComment = 0;
  let hoveredLane = -1;
  let focusedLane = -1;
  let width = 0;
  let height = 0;
  let lanes: Lane[] = [];
  let disposed = false;

  container.dataset.commentCount = String(comments.length);
  controls.forEach((button) => {
    button.disabled = !comments.length;
  });

  const createBullet = (laneIndex: number): Bullet => {
    const comment = comments[nextComment % comments.length];
    nextComment += 1;
    const element = document.createElement('a');
    element.className = 'message-danmaku';
    element.href = comment.url;
    element.tabIndex = -1;
    element.dataset.lane = String(laneIndex);
    element.dataset.commentId = comment.id;
    element.title = `${comment.nick}: ${comment.content} · ${comment.title}`;
    element.style.top = `${((laneIndex + 0.5) / lanes.length) * 100}%`;
    const avatar = createAvatar(comment);
    avatar.alt = '';
    avatar.loading = 'eager';
    const text = document.createElement('span');
    text.textContent = `${comment.nick}: ${comment.content}`;
    element.append(avatar, text);
    element.style.transform = `translate3d(${width}px, -50%, 0)`;
    container.append(element);
    return { element, x: width, width: element.getBoundingClientRect().width };
  };

  const tick = (time: number) => {
    frame = null;
    if (disposed || !visible || document.hidden) return;
    const delta = lastTime ? Math.min(time - lastTime, 64) : 0;
    lastTime = time;
    elapsed += delta;
    lanes.forEach((lane, index) => {
      if (index === hoveredLane || index === focusedLane) return;
      lane.bullets = lane.bullets.filter((bullet) => {
        bullet.x -= (speed * delta) / 1000;
        if (bullet.x + bullet.width < 0) {
          bullet.element.remove();
          return false;
        }
        bullet.element.tabIndex =
          bullet.x >= 0 && bullet.x + bullet.width <= width ? 0 : -1;
        bullet.element.style.transform = `translate3d(${bullet.x}px, -50%, 0)`;
        return true;
      });
      const tail = lane.bullets.at(-1);
      if (
        elapsed >= lane.readyAt &&
        (!tail || tail.x + tail.width + gap <= width) &&
        (loop || nextComment < comments.length)
      ) {
        lane.bullets.push(createBullet(index));
      }
    });
    if (
      loop ||
      nextComment < comments.length ||
      lanes.some((lane) => lane.bullets.length)
    ) {
      frame = requestAnimationFrame(tick);
    }
  };

  const resume = () => {
    if (
      !disposed &&
      visible &&
      !document.hidden &&
      comments.length &&
      frame === null
    ) {
      lastTime = 0;
      frame = requestAnimationFrame(tick);
    }
  };
  const stop = () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    lastTime = 0;
  };
  const updateVisibility = () => {
    container.classList.toggle('hide', !visible);
    container.setAttribute('aria-hidden', String(!visible));
    container.inert = !visible;
    controls.forEach((button) => {
      button.setAttribute(
        'aria-pressed',
        String((button.dataset.messageBarrage === 'show') === visible),
      );
    });
    if (visible) resume();
    else stop();
  };
  const resize = () => {
    const rect = container.getBoundingClientRect();
    if (rect.width === width && rect.height === height) return;
    width = rect.width;
    height = rect.height;
    const count = Math.min(
      comments.length,
      Math.max(1, Math.floor(height / laneHeight)),
      Math.max(1, Number(container.dataset.line) || 10),
    );
    container.replaceChildren();
    lanes = Array.from({ length: count }, (_, index) => ({
      bullets: [],
      readyAt: index * 650,
    }));
    elapsed = 0;
    nextComment = 0;
    hoveredLane = focusedLane = -1;
    resume();
  };

  controls.forEach((button) =>
    lifecycle.listen(button, 'click', () => {
      visible = button.dataset.messageBarrage === 'show';
      updateVisibility();
    }),
  );
  lifecycle.listen(document, 'visibilitychange', () => {
    if (document.hidden) stop();
    else resume();
  });
  lifecycle.listen(motion, 'change', () => {
    visible = !motion.matches;
    updateVisibility();
  });
  const bulletFrom = (target: EventTarget | null) =>
    target instanceof Element
      ? target.closest<HTMLElement>('.message-danmaku')
      : null;
  lifecycle.listen(container, 'pointerover', (event) => {
    if (!hover || (event as PointerEvent).pointerType === 'touch') return;
    const bullet = bulletFrom(event.target);
    if (bullet) hoveredLane = Number(bullet.dataset.lane);
  });
  lifecycle.listen(container, 'pointerout', (event) => {
    if (!hover) return;
    const next = bulletFrom((event as PointerEvent).relatedTarget);
    hoveredLane = next ? Number(next.dataset.lane) : -1;
  });
  lifecycle.listen(container, 'focusin', (event) => {
    const bullet = bulletFrom(event.target);
    if (!bullet) return;
    focusedLane = Number(bullet.dataset.lane);
  });
  lifecycle.listen(container, 'focusout', () => {
    focusedLane = -1;
  });
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();
  updateVisibility();
  lifecycle.add(() => {
    disposed = true;
    stop();
    observer.disconnect();
    container.replaceChildren();
    delete container.dataset.initialized;
  });
};
