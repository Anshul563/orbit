import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" }, // <--- Add this
      { protocol: "https", hostname: "lh3.googleusercontent.com" } // Google avatars
    ],
  },
};

export default nextConfig;
