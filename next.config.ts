import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  images: {
    domains: ["localhost"], // add your Docker host or domain here if different
  },
};

export default nextConfig;
