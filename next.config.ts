import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignorar ESLint durante el build
  },
  typescript: {
    ignoreBuildErrors: true, // Ignorar errores de TypeScript durante el build
  },
};

export default nextConfig;
