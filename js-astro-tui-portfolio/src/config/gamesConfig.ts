export interface GameActivity {
  isPlaying: boolean;
  gameName: string;
  details?: string;
  state?: string;
  icon?: string;
  largeImage?: string;
  smallImage?: string;
  elapsedMs?: number;
  startTimestamp?: number;
}

export interface GamesConfig {
  enabled: boolean;
  lanyardUserId?: string; // Optional Discord User ID for Lanyard live Game Activity RPC
}

/**
 * 🎮 LIVE GAME ACTIVITY CONFIGURATION
 * Stream live gaming activity from your Discord presence via Lanyard API!
 */
export const GAMES_CONFIG: GamesConfig = {
  enabled: false,
  lanyardUserId: "your_discord_id",
};

const gameIconCache: Record<string, string> = {};

/**
 * Dynamically fetch high-resolution game icons from RAWG API
 */
export async function fetchGameIconByName(gameName: string): Promise<string> {
  if (!gameName) return "";
  const key = gameName.toLowerCase().trim();
  if (gameIconCache[key]) return gameIconCache[key];

  try {
    const res = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(gameName)}&key=c5425b741b0b4317a7885b0d02ae7e74&page_size=1`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const img = data.results[0].background_image;
      if (img) {
        gameIconCache[key] = img;
        return img;
      }
    }
  } catch { }

  return "";
}

/**
 * Robust asset parser for Discord Game Rich Presence icons
 */
export function parseGameAsset(game: any): string {
  if (!game) return "";

  // 1. Check assets.large_image or small_image
  const asset = game.assets?.large_image || game.assets?.small_image;
  if (asset) {
    if (asset.startsWith("spotify:")) {
      return `https://i.scdn.co/image/${asset.replace("spotify:", "")}`;
    }
    if (asset.startsWith("mp:external/")) {
      return `https://media.discordapp.net/external/${asset.replace("mp:external/", "")}`;
    }
    if (asset.startsWith("external/")) {
      const match = asset.match(/https?\/.*/);
      if (match) return `https://${match[0].replace(/^https?\//, "")}`;
    }
    if (game.application_id) {
      return `https://cdn.discordapp.com/app-assets/${game.application_id}/${asset}.png`;
    }
  }

  // 2. Check application_id icon
  if (game.icon && game.application_id) {
    return `https://cdn.discordapp.com/app-icons/${game.application_id}/${game.icon}.png`;
  }

  // 3. Popular games fallback icon map (Roblox, Minecraft, Valorant, GTA V, etc.)
  const knownGameIcons: Record<string, string> = {
    roblox: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmHAHSmS08T6uotljZiAy9SkzIqJG7DSxecb7BSMhJGw&s=10",
    minecraft: "https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover_art.png",
    valorant: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Valorant_logo_-_symbol_only.svg",
    "league of legends": "https://upload.wikimedia.org/wikipedia/commons/d/d8/League_of_Legends_2019_vector.svg",
    "grand theft auto": "https://upload.wikimedia.org/wikipedia/commons/5/53/Grand_Theft_Auto_V_Logo.svg",
    "gta v": "https://upload.wikimedia.org/wikipedia/commons/5/53/Grand_Theft_Auto_V_Logo.svg",
    fortnite: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Fortnite_F_lettermark_logo.svg",
    "counter-strike": "https://upload.wikimedia.org/wikipedia/commons/8/87/Counter-Strike_2_logo.svg",
    genshin: "https://upload.wikimedia.org/wikipedia/en/5/5d/Genshin_Impact_logo.svg",
    overwatch: "https://upload.wikimedia.org/wikipedia/commons/5/55/Overwatch_circle_logo.svg",
    rocket: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Rocket_League_cover_art.jpg",
  };

  const nameLower = (game.name || "").toLowerCase().trim();
  for (const [key, iconUrl] of Object.entries(knownGameIcons)) {
    if (nameLower.includes(key)) {
      return iconUrl;
    }
  }

  return "";
}

/**
 * Helper to fetch live Game activity from Lanyard API
 */
export async function getLiveGameActivity(): Promise<GameActivity | null> {
  if (GAMES_CONFIG.lanyardUserId) {
    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${GAMES_CONFIG.lanyardUserId}`);
      const data = await res.json();
      if (data.success && data.data?.activities) {
        const game = data.data.activities.find(
          (a: any) => a.type === 0 && a.name.toLowerCase() !== "spotify"
        );

        if (game) {
          const now = Date.now();
          const start = game.timestamps?.start || now;
          let largeImg = parseGameAsset(game);

          if (!largeImg) {
            largeImg = await fetchGameIconByName(game.name);
          }

          return {
            isPlaying: true,
            gameName: game.name,
            details: game.details || "In Game",
            state: game.state || "",
            largeImage: largeImg,
            startTimestamp: start,
            elapsedMs: Math.max(0, now - start),
          };
        }
      }
    } catch {
      // Network error fallback
    }
  }

  return null;
}
