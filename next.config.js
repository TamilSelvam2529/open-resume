/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config) => {
    // Fix for pdfjs-dist compatibility
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      encoding: false,
      'pdfjs-dist': path.join(__dirname, 'node_modules/pdfjs-dist/legacy/build/pdf.js')
    };
    return config;
  },
  // Enable experimental features if needed
  experimental: {
    serverComponentsExternalPackages: ['pdf-lib', 'pdfjs-dist']
  }
};

module.exports = nextConfig;
