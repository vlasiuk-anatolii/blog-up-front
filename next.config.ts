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
  }
};

export default nextConfig;
