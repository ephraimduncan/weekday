import "@weekday/env";

/** @type {import("next").NextConfig} */
const config = {
  compiler: {
    reactRemoveProperties: process.env.NODE_ENV === "production",
    removeConsole: process.env.NODE_ENV === "production",
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
  // experimental: {
  //   optimizeCss: true,
  //   optimizePackageImports: ["@radix-ui/react-select"],
  //   scrollRestoration: true,
  // },
  transpilePackages: [
    "@weekday/api",
    "@weekday/db",
    "@weekday/env",
    "@weekday/auth",
  ],
};

export default config;
