import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
  },
  transpilePackages: [
    "ui",        // shared UI package
    "shared",    // shared utils
  ],
  reactStrictMode: true,
};

export default nextConfig;
