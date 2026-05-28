import { prisma } from '@/lib/prisma';
import ArticleCard from '@/components/public/ArticleCard';

export const revalidate = 60;
export const metadata = { title: '最新文章' };

export default async function LatestPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Math.max(1, parseInt(searchParams.page || '1'));
  const pageSize = 18;
  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [{ isTop: 'desc' }, { publishedAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { category: true, author: true },
    }),
    prisma.article.count({ where: { status: 'PUBLISHED' } }),
  ]);
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8"><span className="text-gradient">最新文章</span></h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((a) => <ArticleCard key={a.id} article={a as any} />)}
      </div>
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <a key={p} href={`/latest?page=${p}`} className={`px-4 py-2 rounded-full ${p === page ? 'bg-gradient-to-r from-neon-purple to-neon-cyan' : 'bg-white/5 hover:bg-white/10'}`}>{p}</a>
          ))}
        </div>
      )}
    </div>
  );
}
