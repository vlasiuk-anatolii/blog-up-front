import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: 'backend',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
       {
        protocol: 'http',
        hostname: 'blog-up-backend-v6-env.eba-mamhw7rc.eu-north-1.elasticbeanstalk.com',
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'http://blog-up-backend-v6-env.eba-mamhw7rc.eu-north-1.elasticbeanstalk.com/:path*',
      },
    ];
  },
};

export default nextConfig;
