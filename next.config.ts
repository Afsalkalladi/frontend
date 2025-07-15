import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'ui-avatars.com',
      'via.placeholder.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-backend-domain.com',
        pathname: '/media/**',
      },
      // Keep localhost for development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
