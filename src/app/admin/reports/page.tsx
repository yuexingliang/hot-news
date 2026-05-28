import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const items = await prisma.report.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold"><span className="text-gradient">举报记录</span></h1>
      <div className="grid gap-3">
        {items.length === 0 && <div className="glass p-8 text-center text-slate-400">暂无举报</div>}
        {items.map((r) => (
          <div key={r.id} className="glass p-4">
            <div className="text-xs text-slate-500 mb-1">{formatDate(r.createdAt)} · 类型：{r.type} · 目标：<code>{r.targetId}</code></div>
            <p className="text-slate-300">{r.reason}</p>
            {r.contact && <p className="text-xs text-slate-500 mt-1">联系：{r.contact}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
