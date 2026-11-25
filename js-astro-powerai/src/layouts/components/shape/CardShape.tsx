import React from "react";
import theme from "@/config/theme.json";
const CardShape = ({ children }: { children: React.ReactNode }) => {
  const primaryColor = theme?.colors?.default?.theme_color?.primary;
  const secondaryColor = theme?.colors?.default?.theme_color?.secondary;
  return (
    <div className="rounded-3xl bg-card/60 relative p-3 backdrop-blur-2xl overflow-hidden">
      <svg
        className="absolute top-0 right-0"
        width="315"
        height="273"
        viewBox="0 0 315 273"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_35_13229)">
          <circle
            cx="243"
            cy="30"
            r="123"
            fill="url(#paint0_linear_35_13229)"
            fillOpacity="0.7"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_35_13229"
            x="0"
            y="-213"
            width="486"
            height="486"
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
              result="effect1_foregroundBlur_35_13229"
            />
          </filter>
          <linearGradient
            id="paint0_linear_35_13229"
            x1="120"
            y1="153"
            x2="366"
            y2="153"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#9A4DFE" />
            <stop offset="1" stopColor="#E87CFF" />
          </linearGradient>
        </defs>
      </svg>
      {children}
      <svg
        className="absolute bottom-0 left-0"
        width="301"
        height="244"
        viewBox="0 0 301 244"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_35_13228)">
          <circle
            cx="58"
            cy="243"
            r="123"
            fill="url(#paint0_linear_35_13228)"
            fillOpacity="0.7"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_35_13228"
            x="-185"
            y="0"
            width="486"
            height="486"
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
              result="effect1_foregroundBlur_35_13228"
            />
          </filter>
          <linearGradient
            id="paint0_linear_35_13228"
            x1="-65"
            y1="366"
            x2="181"
            y2="366"
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
    </div>
  );
};

export default CardShape;
