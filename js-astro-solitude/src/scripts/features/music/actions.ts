import { Solitude } from '@/scripts/core/api';
import { createIcon } from '@/scripts/core/icons';
import type { APlayer, PlayerElement } from '@/scripts/types/vendor';
export const musicActions = {
  isMusicBind: false,
  musicPlaying: false,
  syncMusicState(isPlaying: boolean) {
    const $music = document.getElementById('nav-music');
    const $console = document.getElementById('consoleMusic');
    Solitude.musicPlaying = Boolean(isPlaying);
    if ($music) {
      const capsule = $music as HTMLElement & { collapseTimer?: number };
      if (capsule.collapseTimer) window.clearTimeout(capsule.collapseTimer);
      capsule.collapseTimer = 0;
      capsule.classList.toggle('playing', Solitude.musicPlaying);
      if (Solitude.musicPlaying) {
        capsule.classList.remove('collapsing');
        capsule.classList.add('stretch');
      } else if (
        capsule.classList.contains('stretch') ||
        capsule.classList.contains('collapsing')
      ) {
        capsule.classList.add('collapsing');
        capsule.classList.remove('stretch');
        capsule.collapseTimer = window.setTimeout(() => {
          capsule.classList.remove('collapsing');
          capsule.collapseTimer = 0;
        }, 360);
      } else {
        capsule.classList.remove('collapsing', 'stretch');
      }
    }
    $console?.classList.toggle('on', Solitude.musicPlaying);
    const musicLabels =
      Solitude.config.right_menu && Solitude.config.right_menu.music;
    if (musicLabels && Solitude.rightMenu?.menuItems?.music?.[0]) {
      const $rmText = document.querySelector<HTMLElement>(
        '#menu-music-toggle span',
      );
      const $rmIcon = document.querySelector<SVGSVGElement>(
        '#menu-music-toggle .solitude-icon',
      );
      if ($rmText) {
        const label = Solitude.musicPlaying
          ? musicLabels.stop
          : musicLabels.start;
        Solitude.rightMenu.setLabel($rmText, label);
      }
      if ($rmIcon) {
        $rmIcon.replaceWith(
          createIcon(Solitude.musicPlaying ? 'lucide:pause' : 'lucide:play'),
        );
      }
    }
  },
  musicScrubberBind() {
    const $music = document.getElementById('nav-music');
    const $hitarea = $music?.querySelector<HTMLElement>(
      '.music-capsule-hitarea',
    );
    const $tooltip = $music?.querySelector<HTMLElement>(
      '.music-progress-tooltip',
    );
    const $status = $music?.querySelector<HTMLElement>(
      '.music-progress-status',
    );
    if (
      !$music ||
      !$hitarea ||
      !$tooltip ||
      $music.dataset.scrubberBound === 'true'
    )
      return;
    $music.dataset.scrubberBound = 'true';
    const dragThreshold = 8;
    const keyboardSeekStep = 5;
    let activePointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let previewTime = 0;
    let previewDuration = 0;
    let previewSource = '';
    let isScrubbing = false;
    let suppressClick = false;
    let feedbackTimer = 0;
    const getAPlayer = () =>
      $music.querySelector<PlayerElement>('solitude-meting')?.aplayer || null;
    const getDuration = (aplayer: APlayer | null | undefined) => {
      const duration = Number(aplayer?.audio?.duration);
      return Number.isFinite(duration) && duration > 0 ? duration : 0;
    };
    const formatTime = (seconds: number) => {
      const value = Math.max(0, Number(seconds) || 0);
      const minutes = Math.floor(value / 60);
      const remaining = Math.floor(value % 60);
      return `${minutes}:${String(remaining).padStart(2, '0')}`;
    };
    const setFeedback = (time: number, duration: number, announce = false) => {
      const ratio =
        duration > 0 ? Math.min(1, Math.max(0, time / duration)) : 0;
      const label = `${formatTime(time)} / ${formatTime(duration)}`;
      $music.style.setProperty('--capsule-scrub-position', `${ratio * 100}%`);
      $tooltip.textContent = label;
      if (announce && $status) $status.textContent = label;
      return ratio;
    };
    const updatePreview = (aplayer: APlayer, clientX: number) => {
      const rect = $music.getBoundingClientRect();
      const ratio = Math.min(
        1,
        Math.max(0, (clientX - rect.left) / rect.width),
      );
      previewTime = ratio * previewDuration;
      aplayer.disableTimeupdate = true;
      aplayer.bar?.set?.('played', ratio, 'width');
      aplayer.lrc?.update?.(previewTime);
      if (aplayer.template?.ptime) {
        aplayer.template.ptime.textContent = formatTime(previewTime);
      }
      setFeedback(previewTime, previewDuration);
    };
    const restoreActualProgress = (aplayer: APlayer | null | undefined) => {
      if (!aplayer) return;
      const duration = getDuration(aplayer);
      const currentTime = Math.min(
        duration,
        Math.max(0, Number(aplayer?.audio?.currentTime) || 0),
      );
      const ratio = duration > 0 ? currentTime / duration : 0;
      aplayer.bar?.set?.('played', ratio, 'width');
      aplayer.lrc?.update?.(currentTime);
      if (aplayer.template?.ptime) {
        aplayer.template.ptime.textContent = formatTime(currentTime);
      }
      setFeedback(currentTime, duration);
    };
    const resetPointerState = () => {
      if (
        activePointerId !== null &&
        $hitarea.hasPointerCapture?.(activePointerId)
      ) {
        $hitarea.releasePointerCapture(activePointerId);
      }
      activePointerId = null;
      isScrubbing = false;
      previewTime = 0;
      previewDuration = 0;
      previewSource = '';
      $music.classList.remove('scrubbing', 'keyboard-scrubbing');
    };
    const cancelScrub = () => {
      window.clearTimeout(feedbackTimer);
      const aplayer = getAPlayer();
      if (isScrubbing && aplayer) {
        aplayer.disableTimeupdate = false;
        restoreActualProgress(aplayer);
      }
      resetPointerState();
    };
    const showKeyboardFeedback = (time: number, duration: number) => {
      window.clearTimeout(feedbackTimer);
      setFeedback(time, duration, true);
      $music.classList.add('scrubbing', 'keyboard-scrubbing');
      feedbackTimer = window.setTimeout(() => {
        $music.classList.remove('scrubbing', 'keyboard-scrubbing');
      }, 900);
    };
    $hitarea.addEventListener('pointerdown', (event) => {
      if (
        !event.isPrimary ||
        (event.pointerType === 'mouse' && event.button !== 0)
      )
        return;
      const aplayer = getAPlayer();
      const duration = getDuration(aplayer);
      if (!aplayer || !duration) return;
      window.clearTimeout(feedbackTimer);
      $music.classList.remove('scrubbing', 'keyboard-scrubbing');
      activePointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      previewDuration = duration;
      previewSource = String(
        aplayer.audio?.currentSrc || aplayer.audio?.src || '',
      );
      isScrubbing = false;
    });
    document.addEventListener('pointermove', (event) => {
      if (event.pointerId !== activePointerId) return;
      const deltaX = Math.abs(event.clientX - startX);
      const deltaY = Math.abs(event.clientY - startY);
      if (!isScrubbing) {
        if (deltaY >= dragThreshold && deltaY > deltaX) {
          resetPointerState();
          return;
        }
        if (deltaX < dragThreshold || deltaX <= deltaY) return;
        isScrubbing = true;
        $music.classList.add('scrubbing');
        $hitarea.setPointerCapture?.(event.pointerId);
      }
      const aplayer = getAPlayer();
      const currentSource = String(
        aplayer?.audio?.currentSrc || aplayer?.audio?.src || '',
      );
      if (!aplayer || (previewSource && currentSource !== previewSource)) {
        return cancelScrub();
      }
      event.preventDefault();
      updatePreview(aplayer, event.clientX);
    });
    document.addEventListener('pointerup', (event) => {
      if (event.pointerId !== activePointerId) return;
      const aplayer = getAPlayer();
      const currentSource = String(
        aplayer?.audio?.currentSrc || aplayer?.audio?.src || '',
      );
      if (
        isScrubbing &&
        aplayer &&
        (!previewSource || currentSource === previewSource)
      ) {
        updatePreview(aplayer, event.clientX);
        aplayer.seek(previewTime);
        aplayer.disableTimeupdate = false;
        suppressClick = true;
        window.setTimeout(() => {
          suppressClick = false;
        }, 0);
      } else if (isScrubbing && aplayer) {
        aplayer.disableTimeupdate = false;
        restoreActualProgress(aplayer);
      }
      resetPointerState();
    });
    document.addEventListener('pointercancel', cancelScrub);
    document.addEventListener(
      'click',
      (event) => {
        if (
          !suppressClick ||
          !(event.target instanceof Element ? event.target : null)?.closest(
            '#nav-music',
          )
        )
          return;
        suppressClick = false;
        event.preventDefault();
        event.stopPropagation();
      },
      true,
    );
    $hitarea.addEventListener('keydown', (event) => {
      const aplayer = getAPlayer();
      const duration = getDuration(aplayer);
      if (!aplayer || !duration) return;
      const currentTime = Math.min(
        duration,
        Math.max(0, Number(aplayer.audio?.currentTime) || 0),
      );
      const targets: Record<string, number> = {
        ArrowLeft: currentTime - keyboardSeekStep,
        ArrowRight: currentTime + keyboardSeekStep,
        Home: 0,
        End: duration,
      };
      if (!(event.key in targets)) return;
      event.preventDefault();
      event.stopPropagation();
      const target = Math.min(duration, Math.max(0, targets[event.key]));
      aplayer.seek(target);
      showKeyboardFeedback(target, duration);
    });
    document.addEventListener('solitude:beforeNavigate', cancelScrub);
  },
  musicBind() {
    const $meting = document.querySelector<PlayerElement>(
      '#nav-music solitude-meting',
    );
    const aplayer = $meting?.aplayer;
    if (!aplayer) {
      Solitude.isMusicBind = false;
      return null;
    }
    Solitude.isMusicBind = true;
    if (!aplayer.solitudeCapsuleBound) {
      aplayer.on('play', () => Solitude.syncMusicState(true));
      aplayer.on('pause', () => Solitude.syncMusicState(false));
      aplayer.on('ended', () => Solitude.syncMusicState(false));
      // APlayer emits listswitch before updating the cover background.
      aplayer.on('listswitch', () =>
        queueMicrotask(() => Solitude.coverColor?.(true)),
      );
      aplayer.on('loadeddata', () => {
        Solitude.syncMusicState(
          Boolean(aplayer.audio && !aplayer.audio.paused),
        );
      });
      aplayer.solitudeCapsuleBound = true;
    }
    Solitude.coverColor?.(true);
    Solitude.syncMusicState(Boolean(aplayer.audio && !aplayer.audio.paused));
    return aplayer;
  },
  handleMusicClick(event: MouseEvent) {
    if (
      (event.target instanceof Element ? event.target : null)?.closest(
        '.music-control-btn',
      )
    )
      return;
    if (!Solitude.musicPlaying) Solitude.musicToggle();
  },
  musicToggle(isMeting = true) {
    const aplayer = Solitude.musicBind();
    if (!aplayer) return;
    const shouldPlay = Boolean(aplayer.audio?.paused);
    if (!isMeting) {
      Solitude.syncMusicState(shouldPlay);
      return;
    }
    shouldPlay ? aplayer.play() : aplayer.pause();
  },
  musicSkipBack() {
    document
      .querySelector<PlayerElement>('#nav-music solitude-meting')
      ?.aplayer?.skipBack();
  },
  musicSkipForward() {
    document
      .querySelector<PlayerElement>('#nav-music solitude-meting')
      ?.aplayer?.skipForward();
  },
};
