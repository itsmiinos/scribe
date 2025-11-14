import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  //   config.resolve.alias.canvas = false;
  //   config.resolve.alias.encoding = false;
  //   // config.externals.push("pdf-parse");
  //   return config;
  // },
  reactStrictMode: true,
  serverExternalPackages: ["pdf-parse", "canvas"],
  turbopack: {},
};

export default nextConfig;
