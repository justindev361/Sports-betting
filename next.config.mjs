/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "www.overtimemarkets.xyz", protocol: "http" },
      { hostname: "overtimemarkets.xyz", protocol: "http" },
    ],
  },
};

export default nextConfig;
