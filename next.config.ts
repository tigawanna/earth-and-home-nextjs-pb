import "dotenv/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "https",
        hostname: process.env.PB_ORIGIN || "",
      },
    ],
  },
  experimental: {
    reactCompiler: true,
    viewTransition: true,
  },
  rewrites: async () => [
    {
      source: "/dashboard",
      destination: "/dashboard/client",
    },
    {
      source: "/dashboard/:path*",
      destination: "/dashboard/client",
    },
  ],
};

export default nextConfig;
