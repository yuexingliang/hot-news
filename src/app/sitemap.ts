import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { site } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, cats, tags] = await Promise.all([
    prisma.article.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }).catch(() => []),
    prisma.category.findMany({ select: { slug: true } }).catch(() => []),
    prisma.tag.findMany({ select: { slug: true } }).catch(() => []),
  ]);
  const base = site.url;
  return [
    { url: base, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/latest`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/promotion-apply`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.4 },
    ...cats.map((c) => ({ url: `${base}/category/${c.slug}`, changeFrequency: 'daily' as const, priority: 0.8 })),
    ...tags.map((t) => ({ url: `${base}/tag/${t.slug}`, changeFrequency: 'weekly' as const, priority: 0.5 })),
    ...articles.map((a) => ({ url: `${base}/article/${a.slug}`, lastModified: a.updatedAt, changeFrequency: 'weekly' as const, priority: 0.7 })),
  ];
}
