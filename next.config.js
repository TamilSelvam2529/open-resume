/** @type {import('next').NextConfig} */
const nextConfig = {
  // Existing configurations
  output: 'standalone',
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  
  // NEW: Add API route configurations
  api: {
    bodyParser: false, // Required for binary PDF uploads
    externalResolver: true, // Recommended for API routes
  },
  
  // Enable App Router features
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
