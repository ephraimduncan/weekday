import "@weekday/env";

/** @type {import("next").NextConfig} */
const config = {
  reactCompiler: true,
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
