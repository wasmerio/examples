import React, { useMemo } from "react";
import theme from "@/config/theme.json";

/* ─── seeded deterministic RNG so particles are stable across renders ─── */
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const CTAShape = () => {
  const primaryColor =
    theme?.colors?.default?.theme_color?.primary ?? "#9A4DFE";
  const secondaryColor =
    theme?.colors?.default?.theme_color?.secondary ?? "#E87CFF";


  /* stable star field */
  const stars = useMemo(() => {
    const r = seededRand(7);
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      cx: Math.round(100 + r() * 1320),
      cy: Math.round(8 + r() * 270),
      rad: +(0.6 + r() * 1.1).toFixed(2),
      dur: +(1.6 + r() * 3.4).toFixed(1),
      del: +(r() * 5.0).toFixed(2),
      lo: +(0.05 + r() * 0.14).toFixed(2),
      hi: +(0.38 + r() * 0.42).toFixed(2),
    }));
  }, []);

  /* stable ember particles that float upward */
  const embers = useMemo(() => {
    const r = seededRand(31);
    const cols = [
      primaryColor,
      secondaryColor,
      "#FF5DAA",
      "#C44DFF",
      "#B87CFE",
    ];
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      cx: Math.round(110 + r() * 1300),
      cy: Math.round(282 + r() * 14),
      rad: +(0.9 + r() * 2.0).toFixed(2),
      dur: +(3.4 + r() * 2.6).toFixed(1),
      del: +(r() * 7.0).toFixed(2),
      op: +(0.32 + r() * 0.34).toFixed(2),
      rise: Math.round(70 + r() * 55),
      color: cols[i % cols.length],
    }));
  }, [primaryColor, secondaryColor]);

  return (
    <svg
      width="1517"
      height="302"
      viewBox="0 0 1517 302"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          id="filter0_f_35_6567"
          x="0"
          y="130"
          width="1516.75"
          height="737"
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
          x="178.445"
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
          x1="133.445"
          y1="523.5"
          x2="1383.44"
          y2="523.5"
          gradientUnits="userSpaceOnUse"
        >
          <animate
            attributeName="x1"
            values="133.445;300;133.445"
            dur="9.6s"
            calcMode="spline"
            keyTimes="0;0.5;1"
            keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            repeatCount="indefinite"
          />
          <animate
            attributeName="x2"
            values="1383.44;1215;1383.44"
            dur="9.6s"
            calcMode="spline"
            keyTimes="0;0.5;1"
            keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y1"
            values="523.5;500;523.5"
            dur="8.4s"
            calcMode="spline"
            keyTimes="0;0.5;1"
            keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            repeatCount="indefinite"
          />
          <stop stopColor={primaryColor ? primaryColor : "#9A4DFE"}>
            <animate
              attributeName="stop-opacity"
              values="0.95;1;0.95"
              dur="8.8s"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
              repeatCount="indefinite"
            />
          </stop>
          <stop
            offset="1"
            stopColor={secondaryColor ? secondaryColor : "#E87CFF"}
          >
            <animate
              attributeName="stop-opacity"
              values="0.9;1;0.9"
              dur="9.4s"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
        <linearGradient
          id="paint1_linear_35_6567"
          x1="298.445"
          y1="636"
          x2="1218.44"
          y2="636"
          gradientUnits="userSpaceOnUse"
        >
          <animate
            attributeName="x1"
            values="298.445;430;298.445"
            dur="8.2s"
            calcMode="spline"
            keyTimes="0;0.5;1"
            keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            repeatCount="indefinite"
          />
          <animate
            attributeName="x2"
            values="1218.44;1088;1218.44"
            dur="8.2s"
            calcMode="spline"
            keyTimes="0;0.5;1"
            keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y2"
            values="636;610;636"
            dur="7.4s"
            calcMode="spline"
            keyTimes="0;0.5;1"
            keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            repeatCount="indefinite"
          />
          <stop stopColor={primaryColor ? primaryColor : "#9A4DFE"}>
            <animate
              attributeName="stop-opacity"
              values="0.92;1;0.92"
              dur="7.8s"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
              repeatCount="indefinite"
            />
          </stop>
          <stop
            offset="1"
            stopColor={secondaryColor ? secondaryColor : "#E87CFF"}
          >
            <animate
              attributeName="stop-opacity"
              values="0.88;1;0.88"
              dur="8.6s"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>

        {/* ── ADDED: extra defs for the animation overlays only ── */}
        <clipPath id="_oa_clip">
          <rect x="0" y="0" width="1517" height="302" />
        </clipPath>
        <linearGradient id="_oa_shim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="40%" stopColor="white" stopOpacity="0.06" />
          <stop offset="50%" stopColor="white" stopOpacity="0.22" />
          <stop offset="60%" stopColor="white" stopOpacity="0.06" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="_oa_tr1"
          x1="0"
          y1="0"
          x2="1517"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="42%" stopColor="white" stopOpacity="0.9" />
          <stop offset="52%" stopColor={secondaryColor} stopOpacity="0.7" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="_oa_tr2"
          x1="1517"
          y1="0"
          x2="0"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0" />
          <stop offset="42%" stopColor={primaryColor} stopOpacity="0.85" />
          <stop offset="52%" stopColor="white" stopOpacity="0.6" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>

        <style>{`
          @keyframes _oa_tw   { 0%,100%{opacity:var(--lo)} 50%{opacity:var(--hi)} }
          @keyframes _oa_emb  { 0%{transform:translateY(0);opacity:var(--op)} 78%{opacity:var(--op)} 100%{transform:translateY(calc(var(--rise) * -1px));opacity:0} }
          @keyframes _oa_shim { from{transform:translateX(0)} to{transform:translateX(2160px)} }
          ._oa_star { animation: _oa_tw  var(--dur) ease-in-out var(--del) infinite; }
          ._oa_emb  { animation: _oa_emb var(--dur) ease-in    var(--del) infinite; transform-box:fill-box; }
          ._oa_shim_rect { animation: _oa_shim 4.8s linear infinite; }
        `}</style>
      </defs>

      {/* ══════════════════════════════════════════════════════════════════
          YOUR ORIGINAL SHAPES — 100% unchanged
      ══════════════════════════════════════════════════════════════════ */}
      <g filter="url(#filter0_f_35_6567)">
        <path
          d="M120.588 285.861C116.892 267.303 131.088 250 150.01 250H1366.74C1385.7 250 1399.91 267.385 1396.13 285.974L1307.33 722.974C1304.49 736.954 1292.19 747 1277.93 747H237.058C222.749 747 210.432 736.894 207.636 722.861L120.588 285.861Z"
          fill="url(#paint0_linear_35_6567)"
        />
      </g>
      <g filter="url(#filter1_f_35_6567)">
        <path
          d="M1218.44 636C1218.44 568.238 1206.55 501.139 1183.43 438.535C1160.31 375.931 1126.43 319.048 1083.71 271.133C1041 223.218 990.289 185.21 934.479 159.278C878.669 133.347 818.853 120 758.445 120C698.037 120 638.22 133.347 582.41 159.278C526.601 185.21 475.891 223.218 433.176 271.133C390.461 319.048 356.577 375.931 333.46 438.535C310.343 501.139 298.445 568.238 298.445 636L1218.44 636Z"
          fill="url(#paint1_linear_35_6567)"
          fillOpacity="0.3"
        >
          <animate
            attributeName="fill-opacity"
            values="0.24;0.38;0.24"
            dur="8s"
            calcMode="spline"
            keyTimes="0;0.5;1"
            keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* ══════════════════════════════════════════════════════════════════
          ANIMATION OVERLAYS — added on top, nothing below touched
      ══════════════════════════════════════════════════════════════════ */}

      {/* 1 ── Twinkling star field */}
      <g clipPath="url(#_oa_clip)">
        {stars.map(({ id, cx, cy, rad, dur, del, lo, hi }) => (
          <circle
            key={id}
            className="_oa_star"
            cx={cx}
            cy={cy}
            r={rad}
            fill="white"
            style={
              {
                "--dur": `${dur}s`,
                "--del": `${del}s`,
                "--lo": lo,
                "--hi": hi,
              } as React.CSSProperties
            }
          />
        ))}
      </g>

      {/* 2 ── Rising ember particles */}
      <g clipPath="url(#_oa_clip)">
        {embers.map(({ id, cx, cy, rad, dur, del, op, rise, color }) => (
          <g
            key={id}
            className="_oa_emb"
            style={
              {
                "--dur": `${dur}s`,
                "--del": `${del}s`,
                "--op": op,
                "--rise": rise,
              } as React.CSSProperties
            }
          >
            <circle cx={cx} cy={cy} r={rad} fill={color} />
          </g>
        ))}
      </g>

      {/* 3 ── Expanding pulse rings */}
      <g clipPath="url(#_oa_clip)">
        {[
          {
            cx: 758,
            cy: 258,
            begin: "0s",
            dur: "3.4s",
            stroke: secondaryColor,
            sw: 1.4,
            maxR: 72,
            op: 0.65,
          },
          {
            cx: 758,
            cy: 258,
            begin: "1.7s",
            dur: "3.4s",
            stroke: primaryColor,
            sw: 1.0,
            maxR: 72,
            op: 0.45,
          },
          {
            cx: 310,
            cy: 280,
            begin: "0.8s",
            dur: "4.2s",
            stroke: secondaryColor,
            sw: 0.9,
            maxR: 44,
            op: 0.5,
          },
          {
            cx: 1210,
            cy: 277,
            begin: "2.3s",
            dur: "3.8s",
            stroke: primaryColor,
            sw: 0.9,
            maxR: 44,
            op: 0.46,
          },
          {
            cx: 540,
            cy: 272,
            begin: "1.4s",
            dur: "4.6s",
            stroke: "#FF5DAA",
            sw: 0.7,
            maxR: 32,
            op: 0.4,
          },
          {
            cx: 980,
            cy: 270,
            begin: "3.1s",
            dur: "3.6s",
            stroke: primaryColor,
            sw: 0.7,
            maxR: 32,
            op: 0.38,
          },
        ].map(({ cx, cy, begin, dur, stroke, sw, maxR, op }, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="2"
            fill="none"
            stroke={stroke}
            strokeWidth={sw}
          >
            <animate
              attributeName="r"
              values={`2;${maxR}`}
              dur={dur}
              begin={begin}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values={`${op};0`}
              dur={dur}
              begin={begin}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>
    </svg>
  );
};

export default CTAShape;
