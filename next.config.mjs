/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
};

const withPWA = withPWAInit({
  dest: "public",
});

export default withPWA({
  ...nextConfig,
});
