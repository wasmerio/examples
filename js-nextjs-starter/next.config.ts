import type { NextConfig } from "next";

// `output: "export"` writes a static site to `out/`, which Wasmer Edge serves directly.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
