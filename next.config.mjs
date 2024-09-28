/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Apply these headers to all routes, including both API and page routes
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Allow all origins
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer-when-downgrade", // Apply to all routes
          },
        ],
      },
    ];
  },
  images: {
    domains: ['img.clerk.com'], // Add any other domains if needed
  },
};

export default nextConfig;