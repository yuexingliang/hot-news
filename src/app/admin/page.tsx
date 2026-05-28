import { prisma } from '@/lib/prisma';
import { FileText, MessageSquare, Eye, ShoppingCart, TrendingUp, Megaphone } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [articleCount, pubCount, draftCount, commentPending, totalViews, ordersNew, adClicks, latestArticles, latestComments] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: 'PUBLISHED' } }),
    prisma.article.count({ where: { status: 'DRAFT' } }),
    prisma.comment.count({ where: { status: 'PENDING' } }),
    prisma.article.aggregate({ _sum: { views: true } }),
    prisma.promotionOrder.count({ where: { status: 'NEW' } }),
    prisma.adSlot.aggregate({ _sum: { clicks: true } }),
    prisma.article.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, title: true, status: true, views: true, createdAt: true } }),
    prisma.comment.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { article: { select: { title: true } } } }),
  ]);

  const stats = [
    { label: '已发布文章', value: pubCount, icon: FileText, color: 'from-neon-purple to-neon-pink' },
    { label: '草稿', value: draftCount, icon: FileText, color: 'from-neon-cyan to-brand-500' },
    { label: '总阅读量', value: totalViews._sum.views || 0, icon: Eye, color: 'from-amber-500 to-rose-500' },
    { label: '待审评论', value: commentPending, icon: MessageSquare, color: 'from-emerald-500 to-cyan-500' },
    { label: '新软文订单', value: ordersNew, icon: ShoppingCart, color: 'from-violet-500 to-fuchsia-500' },
    { label: '广告点击', value: adClicks._sum.clicks || 0, icon: Megaphone, color: 'from-sky-500 to-indigo-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1"><span className="text-gradient">数据概览</span></h1>
        <p className="text-slate-400">站点运营数据一目了然</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass p-6 lift relative overflow-hidden">
              <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${s.color} opacity-20 blur-2xl`} />
              <div className="relative">
                <div className="text-slate-400 text-sm">{s.label}</div>
                <div className="text-4xl font-bold mt-2">{s.value}</div>
                <Icon className="w-6 h-6 mt-3 text-slate-300" />
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass p-5">
          <h3 className="font-semibold mb-3 inline-flex items-center gap-2"><TrendingUp className="w-4 h-4" /> 最新文章</h3>
          <div className="space-y-2">
            {latestArticles.map((a) => (
              <div key={a.id} className="flex items-center justify-between text-sm">
                <span className="truncate flex-1">{a.title}</span>
                <span className="text-xs text-slate-500 ml-2">{a.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass p-5">
          <h3 className="font-semibold mb-3">最新评论</h3>
          <div className="space-y-2 text-sm">
            {latestComments.map((c) => (
              <div key={c.id}>
                <div className="text-slate-300 truncate">{c.content}</div>
                <div className="text-xs text-slate-500">→ {c.article?.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
