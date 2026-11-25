interface Props {
  className?: string;
}

function Spill({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 325 79">
      <defs>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="ssspill-grad">
          <stop stopColor="oklch(var(--p))" stopOpacity="1" offset="55%" />
          <stop stopColor="oklch(var(--s))" stopOpacity="1" offset="100%" />
        </linearGradient>
      </defs>
      <g fill="url(#ssspill-grad)">
        <rect width="100%" height="40" fill="oklch(var(--p))" />

        <rect x="0" width="7.69%" height="60" rx="15" />
        <rect x="50" width="7.69%" height="76" rx="15" />
        <rect x="100" width="7.69%" height="60" rx="15" />
        <rect x="150" width="7.69%" height="66" rx="15" />
        <rect x="200" width="7.69%" height="63" rx="15" />
        <rect x="250" width="7.69%" height="69" rx="15" />
        <rect x="300" width="7.69%" height="79" rx="15" />
      </g>
      <g fill="oklch(var(--b1)/1)" className="relative -z-50">
        <rect x="25" y="24" width="7.69%" height="30" rx="15" />
        <rect x="75" y="18" width="7.69%" height="35" rx="15" />
        <rect x="125" y="7" width="7.69%" height="50" rx="15" />
        <rect x="175" y="7" width="7.69%" height="50" rx="15" />
        <rect x="225" y="18" width="7.69%" height="40" rx="15" />
        <rect x="275" y="19" width="7.69%" height="40" rx="15" />
      </g>
    </svg>
  );
}

export default Spill;
