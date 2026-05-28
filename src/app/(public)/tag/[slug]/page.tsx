import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ArticleCard from '@/components/public/ArticleCard';
import { StaggerList, StaggerItem } from '@/components/animations/Reveal';

export const revalidate = 60;

export default async function TagPage({ params }: { params: { slug: string } }) {
  const tag = await prisma.tag.findUnique({ where: { slug: params.slug } });
  if (!tag) notFound();
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED', tags: { some: { tagId: tag.id } } },
    orderBy: { publishedAt: 'desc' },
    include: { category: true, author: true },
    take: 30,
  });
  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">
        标签：<span className="text-gradient">#{tag.name}</span>
      </h1>
      <StaggerList className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => (
          <StaggerItem key={a.id}><ArticleCard article={a as any} /></StaggerItem>
        ))}
      </StaggerList>
    </div>
  );
}
