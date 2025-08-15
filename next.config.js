const { withGenkit } = require('@genkit-ai/next');

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    // Required for wav package.
    config.externals.push('node-fetch');
    return config;
  },
};

module.exports = nextConfig;
