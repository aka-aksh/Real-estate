import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use a separate ignored build directory when OneDrive locks .next files.
  distDir: process.env.MASAL_NEXT_DIST_DIR ?? ".next",
};

export default nextConfig;
