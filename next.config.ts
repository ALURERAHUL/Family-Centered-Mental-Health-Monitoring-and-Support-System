import {withGenkit} from '@genkit-ai/next';

const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  webpack: (config: any) => {
    // Required for wav package.
    config.externals.push('node-fetch');
    return config;
  },
};

export default withGenkit(nextConfig);
