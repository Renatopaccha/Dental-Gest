import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Skip image optimization for development (allows local backend images)
    unoptimized: true,
    remotePatterns: [
      // Django backend - desarrollo local
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      // Django backend - Render production
      {
        protocol: 'https',
        hostname: '*.onrender.com',
        pathname: '/media/**',
      },
      // Imágenes externas permitidas
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
