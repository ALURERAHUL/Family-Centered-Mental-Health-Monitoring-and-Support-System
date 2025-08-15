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
  experimental: {
    // Vercel and other hosting providers have short timeouts for serverless functions.
    // This setting extends the timeout for server actions, which is crucial for AI operations.
    serverActions: {
      bodySizeLimit: '2mb',
    },
    serverMinification: false,
  },
};

module.exports = withGenkit(nextConfig);
