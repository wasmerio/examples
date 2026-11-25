export interface RadioTrack {
  id: string;
  title: string;
  artist: string;
  genre: "Lo-Fi" | "Synthwave" | "Chiptune" | "Ambient" | "YouTube";
  url: string;
  duration?: string;
  type?: "mp3" | "youtube";
  youtubeId?: string;
  isCustom?: boolean;
}

export interface RadioConfig {
  defaultVolume: number; // 0.0 to 1.0
  autoPlay: boolean;
  tracks: RadioTrack[];
}

export const RADIO_PLAYLIST: RadioTrack[] = [
  {
    id: "track-1",
    title: "Midnight Terminal",
    artist: "RetroWave Audio",
    genre: "Lo-Fi",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
    duration: "2:27",
  },
  {
    id: "track-2",
    title: "8-Bit Cyber Arcade",
    artist: "Chiptune Collective",
    genre: "Chiptune",
    url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=game-8-bit-arcade-138828.mp3",
    duration: "1:45",
  },
  {
    id: "track-3",
    title: "Tokyo Coffee Shop",
    artist: "ChillHop Beats",
    genre: "Lo-Fi",
    url: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=chill-abstract-intention-12099.mp3",
    duration: "2:08",
  },
  {
    id: "track-4",
    title: "Lofi Hip Hop Radio 24/7 🔴 LIVE",
    artist: "Lofi Girl",
    genre: "Lo-Fi",
    url: "https://www.youtube.com/watch?v=rFZHOHl-L8A",
    type: "youtube",
    youtubeId: "rFZHOHl-L8A",
    duration: "LIVE",
  },
  {
    id: "track-5",
    title: "Synthwave Radio 24/7 🔴 LIVE",
    artist: "Lofi Girl Synthwave",
    genre: "Synthwave",
    url: "https://www.youtube.com/watch?v=4xDzrJKXOOY",
    type: "youtube",
    youtubeId: "4xDzrJKXOOY",
    duration: "LIVE",
  },
  {
    id: "track-6",
    title: "Chillhop Radio 24/7 🔴 LIVE",
    artist: "Chillhop Music",
    genre: "Lo-Fi",
    url: "https://www.youtube.com/watch?v=5yx6BWlEVcY",
    type: "youtube",
    youtubeId: "5yx6BWlEVcY",
    duration: "LIVE",
  },
];

export const RADIO_CONFIG: RadioConfig = {
  defaultVolume: 1.0,
  autoPlay: false,
  tracks: RADIO_PLAYLIST,
};

