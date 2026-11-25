export interface AudioTrack {
  name?: string;
  title?: string;
  artist?: string;
  album?: string;
  cover?: string;
  pic?: string;
  url?: string;
}
export interface APlayer {
  audio: HTMLAudioElement;
  list: {
    audios: AudioTrack[];
    index: number;
    hide(): void;
    show(): void;
    toggle(): void;
    switch(index: number): void;
  };
  lrc?: { current?: [number, string][]; update?(time: number): void };
  disableTimeupdate?: boolean;
  solitudeCapsuleBound?: boolean;
  bar?: { set(name: string, value: number, direction: string): void };
  template?: { ptime?: HTMLElement };
  play(): void;
  pause(): void;
  toggle(): void;
  seek(time: number): void;
  volume(value: number, nostorage?: boolean): void;
  skipBack(): void;
  skipForward(): void;
  destroy(): void;
  on(event: string, listener: () => void): void;
  off?(event: string, listener: () => void): void;
}
export interface PlayerElement extends HTMLElement {
  aplayer?: APlayer;
}
