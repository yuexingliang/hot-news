/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
    // isomorphic-dompurify 的 jsdom 依赖里 html-encoding-sniffer 是 ESM，
    // 让 Next 不打包它、改成运行时 require()，避免 ERR_REQUIRE_ESM
    serverComponentsExternalPackages: ['isomorphic-dompurify'],
  },
};

export default nextConfig;
