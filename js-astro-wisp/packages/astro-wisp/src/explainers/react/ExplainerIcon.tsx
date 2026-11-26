/**
 * 讲解外壳的 Lucide 图标（与主题 Icon.astro 同一套图标、同一描边）。
 * 只内联用到的图标路径，避免把整套图标数据打进客户端。
 */
const PATHS = {
  prev: <path d="m15 18-6-6 6-6" />,
  next: <path d="m9 18 6-6-6-6" />,
  /** Lucide rotate-ccw：重播当前步动画 */
  replay: (
    <>
      <path d="M3 12a9 9 0 1 0 9-9a9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </>
  ),
  play: (
    <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
  ),
  stop: <rect width="12" height="12" x="6" y="6" rx="1.5" />,
  expand: (
    <>
      <path d="M15 3h6v6" />
      <path d="M9 21H3v-6" />
      <path d="m21 3-7 7" />
      <path d="m3 21 7-7" />
    </>
  ),
  close: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
} as const;

export type ExplainerIconName = keyof typeof PATHS;

export default function ExplainerIcon({ name }: { name: ExplainerIconName }) {
  return (
    <svg
      className="wisp-icon"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
