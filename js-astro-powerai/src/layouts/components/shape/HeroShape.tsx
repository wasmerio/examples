import theme from "@/config/theme.json";
const HeroShape = () => {
  const primaryColor = theme?.colors?.default?.theme_color?.primary;
  const secondaryColor = theme?.colors?.default?.theme_color?.secondary;
  return (
    <svg
      width="1519"
      height="912"
      viewBox="0 0 1519 912"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_35_6567)">
        <path
          d="M120.488 280.343C117.157 261.935 131.301 245 150.009 245H1368.05C1386.8 245 1400.95 262.008 1397.55 280.447L1307.63 767.447C1305 781.674 1292.59 792 1278.12 792H238.149C223.642 792 211.213 781.619 208.629 767.343L120.488 280.343Z"
          fill="url(#paint0_linear_35_6567)"
        />
      </g>
      <g filter="url(#filter1_f_35_6567)">
        <path
          d="M1219.09 636C1219.09 568.238 1207.19 501.139 1184.08 438.535C1160.96 375.931 1127.08 319.048 1084.36 271.133C1041.65 223.218 990.936 185.21 935.126 159.278C879.316 133.347 819.5 120 759.092 120C698.684 120 638.867 133.347 583.057 159.278C527.247 185.21 476.537 223.218 433.822 271.133C391.107 319.048 357.224 375.931 334.107 438.535C310.99 501.139 299.092 568.238 299.092 636L1219.09 636Z"
          fill="url(#paint1_linear_35_6567)"
          fillOpacity="0.3"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_35_6567"
          x="0"
          y="125"
          width="1518.05"
          height="787"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="60"
            result="effect1_foregroundBlur_35_6567"
          />
        </filter>
        <filter
          id="filter1_f_35_6567"
          x="179.092"
          y="0"
          width="1160"
          height="756"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="60"
            result="effect1_foregroundBlur_35_6567"
          />
        </filter>
        <linearGradient
          id="paint0_linear_35_6567"
          x1="134.092"
          y1="518.5"
          x2="1384.09"
          y2="518.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={primaryColor ? primaryColor : "#9A4DFE"} />
          <stop
            offset="1"
            stopColor={secondaryColor ? secondaryColor : "#E87CFF"}
          />
        </linearGradient>
        <linearGradient
          id="paint1_linear_35_6567"
          x1="299.092"
          y1="636"
          x2="1219.09"
          y2="636"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={primaryColor ? primaryColor : "#9A4DFE"} />
          <stop
            offset="1"
            stopColor={secondaryColor ? secondaryColor : "#E87CFF"}
          />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default HeroShape;
