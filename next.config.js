const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  webpack: (config) => {
    // Important: return the modified config
    alias: {
      react: path.resolve("./node_modules/react");
    }
    return config;
  },
};

module.exports = nextConfig;
