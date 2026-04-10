import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "s3.ap-southeast-1.wasabisys.com",
      },
    ],
  },
};

export default nextConfig;
