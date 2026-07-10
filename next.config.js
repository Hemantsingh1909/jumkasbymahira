/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vnzuexfrupfmufohlvzr.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      }
    ],
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/products',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/api/products',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

