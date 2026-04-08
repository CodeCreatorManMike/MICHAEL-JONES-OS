import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Ensure static files and traces resolve from this app when multiple lockfiles exist
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
