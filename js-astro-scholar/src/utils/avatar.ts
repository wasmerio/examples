const AVATAR_PALETTE = [
  { bg: "#DCEBFF", fg: "#1D4ED8" },
  { bg: "#DFF7E2", fg: "#166534" },
  { bg: "#FDE7D8", fg: "#C2410C" },
  { bg: "#F5E3FF", fg: "#7E22CE" },
  { bg: "#FFE3E3", fg: "#BE123C" },
  { bg: "#E3F7F5", fg: "#0F766E" },
];

export function getInitials(name: string) {
  const parts = name
    .split(/\s+/)
    .map((part) => part.replace(/[^A-Za-z]/g, ""))
    .filter(Boolean);

  if (parts.length === 0) return "NA";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getPalette(name: string) {
  const seed = Array.from(name).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AVATAR_PALETTE[seed % AVATAR_PALETTE.length];
}

export function generateFallbackAvatar(name: string) {
  const safeName = name || "Unknown";
  const initials = getInitials(safeName);
  const palette = getPalette(safeName);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="${safeName}">
      <rect width="200" height="200" rx="100" fill="${palette.bg}" />
      <text
        x="50%"
        y="50%"
        dominant-baseline="central"
        text-anchor="middle"
        font-family="Atkinson, Arial, sans-serif"
        font-size="76"
        font-weight="700"
        letter-spacing="2"
        fill="${palette.fg}"
      >${initials}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
