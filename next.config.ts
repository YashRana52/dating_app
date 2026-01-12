import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // ⚠️ TypeScript errors ko ignore karke build karne do
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
