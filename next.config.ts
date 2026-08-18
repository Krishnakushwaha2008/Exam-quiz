import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  turbopack: {
    root: path.resolve(__dirname, "/"), 
    // This should point to the folder containing your pnpm-lock.yaml
    // In your case: C:\Users\nanua\New-project
  },
};

export default nextConfig;
