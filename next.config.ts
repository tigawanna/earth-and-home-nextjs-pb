import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // {
      //   protocol: "https",
      //   hostname: process.env.NEXT_PUBLIC_R2_PUBLIC_ORIGIN || "",
      // },
    ],
  },
  experimental: {
    reactCompiler: true,
    viewTransition: true,
  },
};

export default nextConfig;
