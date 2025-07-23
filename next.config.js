/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    // Fix for pdfjs-dist compatibility
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      encoding: false,
    };
    
    // Only add pdfjs-dist alias for client side
    if (!isServer) {
      config.resolve.alias['pdfjs-dist'] = 'pdfjs-dist/legacy/build/pdf';
    }
    
    return config;
  }
};

module.exports = nextConfig;
