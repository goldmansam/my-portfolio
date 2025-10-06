import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals = config.externals || [];
    config.externals.push({
      sharp: 'commonjs sharp',
      canvas: 'commonjs canvas',
    });
    return config;
  },
  // Disable image optimization for production since we're using 3D assets
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
