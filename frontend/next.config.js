/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  typescript: {
    ignoreBuildErrors: true, // Skip TypeScript type checking
  },
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint checks during builds
  },
};

module.exports = nextConfig;
