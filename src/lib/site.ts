export const site = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'HotNews 热点速递',
  description:
    process.env.NEXT_PUBLIC_SITE_DESC || '聚合热点 · 精选推广 · 一站式资讯',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  locale: 'zh_CN',
};
