import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import ArticleContent from '@/components/public/ArticleContent';
import ArticleActions from '@/components/public/ArticleActions';
import CommentBox from '@/components/public/CommentBox';
import AdSlot from '@/components/public/AdSlot';
import ArticleCard from '@/components/public/ArticleCard';
import { site } from '@/lib/site';
import { formatDate, readingTime } from '@/lib/utils';

export const revalidate = 30;

async function getArticle(slug: string) {
  return prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      author: true,
      tags: { include: { tag: true } },
    },
  });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const a = await getArticle(params.slug);
  if (!a) return {};
  const title = a.seoTitle || a.title;
  const description = a.seoDesc || a.summary || '';
  return {
    title,
    description,
    keywords: a.seoKeywords || undefined,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${site.url}/article/${a.slug}`,
      images: a.cover ? [{ url: a.cover }] : [],
      publishedTime: a.publishedAt?.toISOString(),
      authors: a.author?.name ? [a.author.name] : [],
    },
    twitter: { card: 'summary_large_image', title, description, images: a.cover ? [a.cover] : [] },
    alternates: { canonical: `/article/${a.slug}` },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const a = await getArticle(params.slug);
  if (!a || a.status !== 'PUBLISHED') notFound();

  const [prev, next, related] = await Promise.all([
    a.publishedAt
      ? prisma.article.findFirst({
          where: { status: 'PUBLISHED', publishedAt: { lt: a.publishedAt } },
          orderBy: { publishedAt: 'desc' },
          select: { slug: true, title: true },
        })
      : null,
    a.publishedAt
      ? prisma.article.findFirst({
          where: { status: 'PUBLISHED', publishedAt: { gt: a.publishedAt } },
          orderBy: { publishedAt: 'asc' },
          select: { slug: true, title: true },
        })
      : null,
    a.categoryId
      ? prisma.article.findMany({
          where: { status: 'PUBLISHED', categoryId: a.categoryId, NOT: { id: a.id } },
          orderBy: { publishedAt: 'desc' },
          take: 4,
          include: { category: true, author: true },
        })
      : [],
  ]);

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: a.title,
    description: a.seoDesc || a.summary || '',
    image: a.cover ? [a.cover] : [],
    datePublished: a.publishedAt?.toISOString(),
    dateModified: a.updatedAt.toISOString(),
    author: { '@type': 'Person', name: a.author?.name || '编辑部' },
    publisher: { '@type': 'Organization', name: site.name },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.url}/article/${a.slug}` },
  };

  const url = `${site.url}/article/${a.slug}`;
  const minutes = readingTime(a.content);

  return (
    <article className="pt-24 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 头图 */}
      {a.cover && (
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl">
            <Image src={a.cover} alt={a.title} fill priority className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 mt-8">
        {/* 面包屑 */}
        <nav className="text-xs text-slate-500 mb-4">
          <Link href="/" className="hover:text-white">首页</Link>
          {a.category && (
            <>
              {' / '}
              <Link href={`/category/${a.category.slug}`} className="hover:text-white">{a.category.name}</Link>
            </>
          )}
          {' / '}<span>{a.title}</span>
        </nav>
        {a.isPromotion && (
          <span className="inline-block mb-4 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs">
            🏷 此文为推广内容
          </span>
        )}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6"><span className="text-gradient">{a.title}</span></h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mb-8">
          {a.author?.name && <span>作者：{a.author.name}</span>}
          {a.publishedAt && <span>·</span>}
          {a.publishedAt && <span>{formatDate(a.publishedAt)}</span>}
          {a.tags.map((t) => (
            <Link key={t.tagId} href={`/tag/${t.tag.slug}`} className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-xs">
              #{t.tag.name}
            </Link>
          ))}
        </div>

        <ArticleContent contentType={a.contentType} content={a.content} />

        {/* 文章中段广告 */}
        <AdSlot code="in-article" />

        <ArticleActions
          articleId={a.id}
          initialLikes={a.likes}
          views={a.views}
          readingMinutes={minutes}
          url={url}
          title={a.title}
        />

        {/* 上一篇 / 下一篇 */}
        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          {prev && (
            <Link href={`/article/${prev.slug}`} className="glass p-4 lift">
              <div className="text-xs text-slate-500 mb-1">← 上一篇</div>
              <div className="font-medium line-clamp-2">{prev.title}</div>
            </Link>
          )}
          {next && (
            <Link href={`/article/${next.slug}`} className="glass p-4 lift sm:text-right">
              <div className="text-xs text-slate-500 mb-1">下一篇 →</div>
              <div className="font-medium line-clamp-2">{next.title}</div>
            </Link>
          )}
        </div>

        {/* 文末广告 */}
        <AdSlot code="footer" />

        <CommentBox articleId={a.id} />
      </div>

      {/* 相关文章 */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-20">
          <h3 className="text-2xl font-bold mb-6"><span className="text-gradient">相关推荐</span></h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((r) => <ArticleCard key={r.id} article={r as any} />)}
          </div>
        </section>
      )}
    </article>
  );
}
