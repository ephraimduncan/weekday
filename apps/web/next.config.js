import "@weekday/env";

/** @type {import("next").NextConfig} */
const config = {
  compiler: {
    reactRemoveProperties: process.env.NODE_ENV === "production",
    removeConsole: process.env.NODE_ENV === "production",
  },
  // experimental: {
  //   optimizeCss: true,
  //   optimizePackageImports: ["@radix-ui/react-select"],
  //   scrollRestoration: true,
  // },
  experimental: {
    nodeMiddleware: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
        protocol: "https",
      },
      {
        hostname: "ik.imagekit.io",
        protocol: "https",
      },
    ],
  },
  reactStrictMode: true,
  transpilePackages: [
    "@weekday/api",
    "@weekday/db",
    "@weekday/env",
    "@weekday/auth",
  ],
  webpack: (config) => {
    // Ensure Jotai uses a single instance
    config.resolve.alias = {
      ...config.resolve.alias,
      jotai: require.resolve("jotai"),
    };
    return config;
  },
  async redirects() {
    return [
      {
        destination: "/login",
        permanent: true,
        source: "/signup",
      },
    ];
  },
};

export default config;
