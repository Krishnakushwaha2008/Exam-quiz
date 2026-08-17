import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // turbopack: {
  //   root: path.resolve(__dirname, "../../"), // Points to monorepo root (C:\Users\nanua\New-project)
  // },
};

export default nextConfig;