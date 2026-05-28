import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ArticleEditor from '@/components/admin/ArticleEditor';

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const a = await prisma.article.findUnique({
    where: { id: params.id },
    include: { tags: true },
  });
  if (!a) notFound();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold"><span className="text-gradient">编辑文章</span></h1>
      <ArticleEditor id={a.id} initial={a} />
    </div>
  );
}
