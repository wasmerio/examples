import { siteConfig } from "@/site.config";
import { getCachedData, setCachedData, CACHE_KEYS } from "@/lib/indexeddb-cache";

export interface WakaTimeLanguage {
  name: string;
  total_seconds: number;
  percent: number;
  text: string;
  hours: number;
  minutes: number;
  digital: string;
}

export interface WakaTimeStats {
  totalSeconds: number;
  totalHours: number;
  totalText: string;
  dailyAverage: string;
  dailyAverageSeconds: number;
  languages: WakaTimeLanguage[];
  editors: { name: string; percent: number; text: string }[];
  operatingSystems: { name: string; percent: number; text: string }[];
  bestDay: { date: string; text: string; total_seconds: number } | null;
  range: { start: string; end: string; text: string };
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours >= 1000) {
    return `${(hours / 1000).toFixed(1)}k hrs`;
  }
  if (hours > 0) {
    return `${hours} hrs ${minutes} mins`;
  }
  return `${minutes} mins`;
}

export function getWakaTimeLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    Python: "#3572A5",
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Zig: "#ec915c",
    Rust: "#dea584",
    Go: "#00ADD8",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    Ruby: "#701516",
    PHP: "#4F5D95",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
    Bash: "#89e051",
    JSON: "#292929",
    YAML: "#cb171e",
    Markdown: "#083fa1",
    Vue: "#41b883",
    Svelte: "#ff3e00",
    Astro: "#ff5d01",
    Other: "#6e7681"
  };

  return colors[language] || colors.Other;
}

function getDefaultStats(): WakaTimeStats {
  return {
    totalSeconds: 500000,
    totalHours: 138,
    totalText: "138 hrs",
    dailyAverage: "4 hrs 30 mins",
    dailyAverageSeconds: 16200,
    languages: [
      { name: "Python", total_seconds: 150000, percent: 30, text: "41 hrs", hours: 41, minutes: 0, digital: "41:00" },
      { name: "TypeScript", total_seconds: 120000, percent: 24, text: "33 hrs", hours: 33, minutes: 0, digital: "33:00" },
      { name: "Zig", total_seconds: 100000, percent: 20, text: "27 hrs", hours: 27, minutes: 0, digital: "27:00" },
      { name: "JavaScript", total_seconds: 80000, percent: 16, text: "22 hrs", hours: 22, minutes: 0, digital: "22:00" },
      { name: "Rust", total_seconds: 50000, percent: 10, text: "13 hrs", hours: 13, minutes: 0, digital: "13:00" }
    ],
    editors: [
      { name: "VS Code", percent: 85, text: "117 hrs" },
      { name: "Neovim", percent: 15, text: "21 hrs" }
    ],
    operatingSystems: [
      { name: "Linux", percent: 70, text: "96 hrs" },
      { name: "Windows", percent: 30, text: "42 hrs" }
    ],
    bestDay: { date: "2024-12-25", text: "8 hrs 30 mins", total_seconds: 30600 },
    range: { start: "2024-12-21", end: "2024-12-28", text: "Last 7 Days" }
  };
}

export async function fetchWakaTimeStats(
  forceRefresh: boolean = false
): Promise<WakaTimeStats> {
  if (!forceRefresh) {
    const cached = await getCachedData<WakaTimeStats>(CACHE_KEYS.WAKATIME_STATS);
    if (cached) {
      return cached;
    }
  }

  const shareEmbedId = siteConfig.wakatime.shareEmbedId;
  
  if (!shareEmbedId) {
    return getDefaultStats();
  }

  const username = siteConfig.wakatime.username;

  try {
    const response = await fetch(
      `https://wakatime.com/share/@${username}/${shareEmbedId}.json`
    );

    if (!response.ok) {
      const cached = await getCachedData<WakaTimeStats>(CACHE_KEYS.WAKATIME_STATS);
      if (cached) return cached;
      return getDefaultStats();
    }

    const data = await response.json();

    const stats: WakaTimeStats = {
      totalSeconds: data.data?.grand_total?.total_seconds || 0,
      totalHours: Math.floor((data.data?.grand_total?.total_seconds || 0) / 3600),
      totalText: data.data?.grand_total?.text || "0 hrs",
      dailyAverage: data.data?.daily_average?.text || "0 hrs",
      dailyAverageSeconds: data.data?.daily_average?.seconds || 0,
      languages: (data.data?.languages || []).slice(0, 8).map((lang: Record<string, unknown>) => ({
        name: lang.name as string,
        total_seconds: lang.total_seconds as number,
        percent: lang.percent as number,
        text: lang.text as string,
        hours: Math.floor((lang.total_seconds as number) / 3600),
        minutes: Math.floor(((lang.total_seconds as number) % 3600) / 60),
        digital: lang.digital as string
      })),
      editors: (data.data?.editors || []).map((editor: Record<string, unknown>) => ({
        name: editor.name as string,
        percent: editor.percent as number,
        text: editor.text as string
      })),
      operatingSystems: (data.data?.operating_systems || []).map((os: Record<string, unknown>) => ({
        name: os.name as string,
        percent: os.percent as number,
        text: os.text as string
      })),
      bestDay: data.data?.best_day
        ? {
            date: data.data.best_day.date,
            text: data.data.best_day.text,
            total_seconds: data.data.best_day.total_seconds
          }
        : null,
      range: {
        start: data.data?.range?.start || "",
        end: data.data?.range?.end || "",
        text: data.data?.range?.text || "Last 7 Days"
      }
    };

    await setCachedData(CACHE_KEYS.WAKATIME_STATS, stats);
    return stats;
  } catch {
    const cached = await getCachedData<WakaTimeStats>(CACHE_KEYS.WAKATIME_STATS);
    if (cached) return cached;
    return getDefaultStats();
  }
}

export async function clearWakaTimeCache(): Promise<void> {
  const { clearCachedData } = await import("@/lib/indexeddb-cache");
  await clearCachedData(CACHE_KEYS.WAKATIME_STATS);
}
