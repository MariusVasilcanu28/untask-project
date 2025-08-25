// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "untask-s3.s3.eu-central-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
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
