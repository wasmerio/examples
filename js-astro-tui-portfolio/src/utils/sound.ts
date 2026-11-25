// Web Audio API Synthesizer for Retro TUI Sound Effects

let audioCtx: AudioContext | null = null;
let sfxEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isSfxEnabled(): boolean {
  return sfxEnabled;
}

export function toggleSfx(force?: boolean): boolean {
  sfxEnabled = force !== undefined ? force : !sfxEnabled;
  if (typeof window !== 'undefined') {
    localStorage.setItem('tui_sfx_enabled', String(sfxEnabled));
  }
  if (sfxEnabled) {
    playBeep(880, 0.05, 'triangle');
  }
  return sfxEnabled;
}

export function initSfxFromStorage(): void {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tui_sfx_enabled');
    if (saved !== null) {
      sfxEnabled = saved === 'true';
    }
  }
}

export function playKeypressSound(): void {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const audio = ctx;

  try {
    const osc = audio.createOscillator();
    const gain = audio.createGain();

    osc.type = 'triangle';
    const now = audio.currentTime;
    const freq = 120 + Math.random() * 40;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.015);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    osc.connect(gain);
    gain.connect(audio.destination);

    osc.start(now);
    osc.stop(now + 0.015);
  } catch (e) {}
}

export function playBeep(freq: number = 440, duration: number = 0.08, type: OscillatorType = 'sine', volume: number = 0.05): void {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const audio = ctx;

  try {
    const osc = audio.createOscillator();
    const gain = audio.createGain();

    const now = audio.currentTime;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(audio.destination);

    osc.start(now);
    osc.stop(now + duration);
  } catch (e) {}
}

export function playSuccessSound(): void {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const audio = ctx;

  try {
    const now = audio.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      gain.gain.setValueAtTime(0.03, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.1);
      osc.connect(gain);
      gain.connect(audio.destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.1);
    });
  } catch (e) {}
}

export function playErrorSound(): void {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const audio = ctx;

  try {
    const now = audio.currentTime;
    [220, 180].forEach((freq, idx) => {
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.04, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.06);
      osc.connect(gain);
      gain.connect(audio.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.06);
    });
  } catch (e) {}
}
