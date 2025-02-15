/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "w1980.blob.core.windows.net",
      },
      { protocol: "https", hostname: "placehold.jp" },
      { protocol: "https", hostname: "images.microcms-assets.io" },
      {
        protocol: "https",
        hostname: "**.supabase.io",
        pathname: "/storage/v1/object/public/**",
      },
      { protocol: "https", hostname: "trwvdksdhncbcnfokexl.supabase.co" },
    ],
  },
};

export default nextConfig;
