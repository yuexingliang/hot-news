import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Plus, Edit, Trash2 } from 'lucide-react';
import DeleteButton from '@/components/admin/DeleteButton';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const statusColor: Record<string, string> = {
  PUBLISHED: 'bg-emerald-500/20 text-emerald-300',
  DRAFT: 'bg-slate-500/20 text-slate-300',
  PENDING: 'bg-amber-500/20 text-amber-300',
  ARCHIVED: 'bg-rose-500/20 text-rose-300',
};

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true, author: true },
    take: 50,
  });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold"><span className="text-gradient">文章管理</span></h1>
        <Link href="/admin/articles/new" className="btn-neon"><Plus className="w-4 h-4" /> 写文章</Link>
      </div>
      <div className="glass overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left">
            <tr>
              <th className="p-3">标题</th>
              <th className="p-3">分类</th>
              <th className="p-3">状态</th>
              <th className="p-3">阅读</th>
              <th className="p-3">日期</th>
              <th className="p-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="p-3">
                  <div className="font-medium">{a.title}</div>
                  <div className="flex gap-1 mt-1">
                    {a.isPromotion && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">推广</span>}
                    {a.isFeatured && <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">推荐</span>}
                    {a.isTop && <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">置顶</span>}
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5">{a.contentType}</span>
                  </div>
                </td>
                <td className="p-3 text-slate-400">{a.category?.name || '-'}</td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded ${statusColor[a.status]}`}>{a.status}</span></td>
                <td className="p-3">{a.views}</td>
                <td className="p-3 text-slate-400">{formatDate(a.createdAt)}</td>
                <td className="p-3 text-right">
                  <div className="inline-flex gap-2">
                    <Link href={`/admin/articles/${a.id}`} className="p-2 rounded hover:bg-white/10"><Edit className="w-4 h-4" /></Link>
                    <DeleteButton url={`/api/articles/${a.id}`} confirmText="确定删除该文章？" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
