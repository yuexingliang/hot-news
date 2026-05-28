import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ArticleCard from '@/components/public/ArticleCard';
import AdSlot from '@/components/public/AdSlot';
import { StaggerList, StaggerItem } from '@/components/animations/Reveal';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const c = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!c) return {};
  return { title: c.name, description: c.description || `${c.name}相关文章` };
}

export default async function CategoryPage({ params, searchParams }: { params: { slug: string }; searchParams: { page?: string } }) {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!category) notFound();
  const page = Math.max(1, parseInt(searchParams.page || '1'));
  const pageSize = 12;
  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: { status: 'PUBLISHED', categoryId: category.id },
      orderBy: [{ isTop: 'desc' }, { publishedAt: 'desc' }],
      include: { category: true, author: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.article.count({ where: { status: 'PUBLISHED', categoryId: category.id } }),
  ]);
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4">
      <header className="mb-10">
        <nav className="text-sm text-slate-500 mb-3">
          <a href="/" className="hover:text-white">首页</a> / <span>{category.name}</span>
        </nav>
        <h1 className="text-4xl font-bold mb-2"><span className="text-gradient">{category.name}</span></h1>
        {category.description && <p className="text-slate-400">{category.description}</p>}
      </header>

      {/* @ts-expect-error Async Server Component */}
      <AdSlot code="top-banner" />

      <StaggerList className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => (
          <StaggerItem key={a.id}>
            <ArticleCard article={a as any} />
          </StaggerItem>
        ))}
      </StaggerList>

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/category/${params.slug}?page=${p}`}
              className={`px-4 py-2 rounded-full ${p === page ? 'bg-gradient-to-r from-neon-purple to-neon-cyan' : 'bg-white/5 hover:bg-white/10'}`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
