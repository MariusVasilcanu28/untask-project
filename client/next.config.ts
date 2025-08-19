// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: [
    "local-origin.dev",
    "*.local-origin.dev",
    "192.168.50.118",
  ],
};

export default nextConfig;
