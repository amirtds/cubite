// next-intl configs
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./app/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tailwindui.com",
      },
    ],
  },
  reactStrictMode: false,
};

export default withNextIntl(nextConfig);
