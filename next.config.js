/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/chatgpt/:path*',
        destination: '/api/proxy?target=chatgpt&path=:path*',
      },
      {
        source: '/claude/:path*',
        destination: '/api/proxy?target=claude&path=:path*',
      },
    ];
  },
};
module.exports = nextConfig;
