import { prisma } from '@/lib/prisma';
import ArticleCard from '@/components/public/ArticleCard';

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q || '').trim();
  const items = q
    ? await prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: q } },
            { summary: { contains: q } },
            { content: { contains: q } },
          ],
        },
        orderBy: { publishedAt: 'desc' },
        include: { category: true, author: true },
        take: 30,
      })
    : [];

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4">
      <form className="mb-10">
        <input
          name="q"
          defaultValue={q}
          placeholder="输入关键词搜索..."
          className="w-full glass px-6 py-4 text-lg outline-none focus:border-brand-400"
          autoFocus
        />
      </form>
      <h2 className="text-xl mb-6">
        {q ? <>搜索"<span className="text-gradient">{q}</span>"找到 {items.length} 条结果</> : '请输入搜索关键词'}
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((a) => (
          <ArticleCard key={a.id} article={a as any} />
        ))}
      </div>
    </div>
  );
}
