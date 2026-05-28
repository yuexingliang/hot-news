import { prisma } from '@/lib/prisma';
import CommentRow from '@/components/admin/CommentRow';

export const dynamic = 'force-dynamic';

export default async function AdminCommentsPage() {
  const items = await prisma.comment.findMany({
    orderBy: { createdAt: 'desc' },
    include: { article: { select: { title: true, slug: true } }, user: { select: { name: true } } },
    take: 100,
  });
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold"><span className="text-gradient">评论审核</span></h1>
      <div className="grid gap-3">
        {items.map((c) => <CommentRow key={c.id} comment={c as any} />)}
      </div>
    </div>
  );
}
