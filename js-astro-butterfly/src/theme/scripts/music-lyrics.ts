type Cue = [time: number, text: string];

export type FixedLyricsPlayer = {
  audio: HTMLAudioElement;
  list: { audios: { lrc?: string }[] };
  lrc: { switch: (index: number) => void; update: (time?: number) => void };
  on: (event: string, callback: () => void) => void;
};

function parseLyrics(source: string): Cue[] {
  const cues = new Map<number, string>([[0, '']]);
  for (const line of source.split(/\r?\n/)) {
    const stamps = [...line.matchAll(/\[(\d+):(\d{2})(\.\d{1,3})?\]/g)];
    const text = line.replace(/\[\d+:\d{2}(?:\.\d{1,3})?\]|<\d+:\d{2}(?:\.\d{1,3})?>/g, '').trim();
    for (const [, minutes, seconds, fraction = ''] of stamps) {
      cues.set(Number(minutes) * 60 + Number(seconds + fraction), text);
    }
  }
  return [...cues].sort(([a], [b]) => a - b);
}

/** Keep APlayer's controls and playback clock, with a separate fixed-player lyric viewport. */
export function setupFixedLyrics(root: HTMLElement, player: FixedLyricsPlayer) {
  const contents = root.querySelector<HTMLElement>('.aplayer-lrc-contents')!;
  const viewport = document.createElement('div');
  viewport.className = 'aplayer-lrc-viewport';
  contents.before(viewport);
  viewport.append(contents);
  const cache = new Map<string, Cue[]>();
  let cues: Cue[] = [];
  let lines: HTMLParagraphElement[] = [];
  let current = -1;
  let request: AbortController | undefined;

  function update(time = player.audio.currentTime, slide = !player.audio.seeking) {
    if (!slide) contents.classList.remove('aplayer-lrc-sliding');
    const index = cues.findLastIndex(([start]) => time >= start);
    if (index === current) return;
    contents.classList.toggle('aplayer-lrc-sliding', slide && current >= 0 && Math.abs(index - current) === 1);
    lines[current]?.classList.remove('aplayer-lrc-current');
    lines[index]?.classList.add('aplayer-lrc-current');
    contents.style.transform = `translateY(${-16 * Math.max(index, 0)}px)`;
    current = index;
  }

  function render(next: Cue[]) {
    cues = next;
    current = -1;
    contents.classList.remove('aplayer-lrc-sliding');
    contents.style.transform = '';
    lines = cues.map(([, text]) => {
      const line = document.createElement('p');
      line.textContent = text;
      return line;
    });
    contents.replaceChildren(...lines);
    update(player.audio.currentTime, false);
  }

  player.lrc.update = update;
  player.lrc.switch = (index) => {
    request?.abort();
    const url = player.list.audios[index]?.lrc;
    const cached = url && cache.get(url);
    render(cached || []);
    if (!url || url === 'data:text/plain,' || cached) return;
    request = new AbortController();
    const { signal } = request;
    void fetch(url, { signal: AbortSignal.any([signal, AbortSignal.timeout(8000)]) })
      .then(async (response) => {
        if (!response.ok) return;
        const text = await response.text();
        if (signal.aborted) return;
        const next = parseLyrics(text);
        cache.set(url, next);
        render(next);
      })
      .catch(() => { /* A failed lyric request leaves playback running. */ });
  };
  const snapToPlaybackTime = () => update(player.audio.currentTime, false);
  player.on('seeking', snapToPlaybackTime);
  player.on('seeked', snapToPlaybackTime);
  player.on('listclear', () => { request?.abort(); render([]); });
  player.on('destroy', () => request?.abort());
}
