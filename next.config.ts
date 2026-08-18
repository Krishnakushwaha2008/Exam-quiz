import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  turbopack: {
    root: path.resolve(__dirname, "../../"), 
    // points two levels up from Aditya-portfolio → Nodejs-project → New-project
  },
};

export default nextConfig;
