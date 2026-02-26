/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Untuk static export ke Netlify
  },
  // Untuk static export (opsional)
  // output: 'export',
}

module.exports = nextConfig
