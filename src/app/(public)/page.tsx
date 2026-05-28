import { prisma } from '@/lib/prisma';
import Hero from '@/components/public/Hero';
import Marquee from '@/components/public/Marquee';
import ArticleCard from '@/components/public/ArticleCard';
import AdSlot from '@/components/public/AdSlot';
import { Reveal, StaggerList, StaggerItem } from '@/components/animations/Reveal';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const [featured, latest, hot, promotions, cats] = await Promise.all([
    prisma.article.findMany({
      where: { status: 'PUBLISHED', isFeatured: true },
      orderBy: { publishedAt: 'desc' },
      take: 5,
      include: { category: true, author: true },
    }),
    prisma.article.findMany({
      where: { status: 'PUBLISHED', isPromotion: false },
      orderBy: { publishedAt: 'desc' },
      take: 8,
      include: { category: true, author: true },
    }),
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { views: 'desc' },
      take: 6,
      include: { category: true, author: true },
    }),
    prisma.article.findMany({
      where: { status: 'PUBLISHED', isPromotion: true },
      orderBy: { publishedAt: 'desc' },
      take: 4,
      include: { category: true, author: true },
    }),
    prisma.category.findMany({ orderBy: { order: 'asc' } }),
  ]);

  return (
    <>
      <Hero />
      <Marquee items={hot.map((a) => ({ title: a.title, slug: a.slug }))} />

      {/* 顶部广告 */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* @ts-expect-error Async Server Component */}
        <AdSlot code="top-banner" />
      </div>

      {/* 推荐位 */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <Reveal>
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-3xl font-bold">
                <span className="text-gradient">编辑精选</span>
              </h2>
              <Link href="/latest" className="text-sm text-slate-400 hover:text-white inline-flex items-center gap-1">
                全部 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
          <StaggerList className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((a, i) => (
              <StaggerItem key={a.id} className={i === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}>
                <ArticleCard article={a as any} featured={i === 0} />
              </StaggerItem>
            ))}
          </StaggerList>
        </section>
      )}

      {/* 分类入口 */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <StaggerList className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {cats.map((c) => (
            <StaggerItem key={c.id}>
              <Link
                href={`/category/${c.slug}`}
                className="block glass p-5 text-center lift hover:bg-white/10 transition group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition">📰</div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs text-slate-500 mt-1">{c.description}</div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerList>
      </section>

      {/* 信息流广告 */}
      <div className="max-w-7xl mx-auto px-4">
        {/* @ts-expect-error Async Server Component */}
        <AdSlot code="feed" />
      </div>

      {/* 最新 + 热门 双栏 */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Reveal>
            <h2 className="text-3xl font-bold mb-2"><span className="text-gradient">最新资讯</span></h2>
          </Reveal>
          <StaggerList className="grid sm:grid-cols-2 gap-6">
            {latest.map((a) => (
              <StaggerItem key={a.id}>
                <ArticleCard article={a as any} />
              </StaggerItem>
            ))}
          </StaggerList>
        </div>
        <aside className="space-y-6">
          <Reveal>
            <h2 className="text-2xl font-bold mb-4"><span className="text-gradient">热度榜</span></h2>
          </Reveal>
          <div className="glass p-4 space-y-3">
            {hot.map((a, i) => (
              <Link key={a.id} href={`/article/${a.slug}`} className="flex items-start gap-3 group">
                <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm
                  ${i < 3 ? 'bg-gradient-to-br from-neon-pink to-neon-purple text-white' : 'bg-white/5 text-slate-400'}`}>
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="text-sm group-hover:text-gradient leading-snug">{a.title}</div>
                  <div className="text-xs text-slate-500 mt-1">{a.views} 阅读</div>
                </div>
              </Link>
            ))}
          </div>
          {/* 侧边栏广告 */}
          {/* @ts-expect-error Async Server Component */}
          <AdSlot code="sidebar" />
        </aside>
      </section>

      {/* 推广专区 */}
      {promotions.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <Reveal>
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs mb-2">SPONSORED</span>
                <h2 className="text-3xl font-bold"><span className="text-gradient">精选推广</span></h2>
              </div>
              <Link href="/category/promotion" className="text-sm text-slate-400 hover:text-white inline-flex items-center gap-1">
                投放推广 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
          <StaggerList className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {promotions.map((a) => (
              <StaggerItem key={a.id}>
                <ArticleCard article={a as any} />
              </StaggerItem>
            ))}
          </StaggerList>
        </section>
      )}
    </>
  );
}
