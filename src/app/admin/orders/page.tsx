import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const colors: Record<string, string> = {
  NEW: 'bg-amber-500/20 text-amber-300',
  PROCESSING: 'bg-blue-500/20 text-blue-300',
  PUBLISHED: 'bg-emerald-500/20 text-emerald-300',
  REJECTED: 'bg-rose-500/20 text-rose-300',
  REFUNDED: 'bg-slate-500/20 text-slate-300',
};

export default async function OrdersPage() {
  const orders = await prisma.promotionOrder.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold"><span className="text-gradient">软文订单</span></h1>
      <div className="grid gap-3">
        {orders.length === 0 && <div className="glass p-8 text-center text-slate-400">暂无订单</div>}
        {orders.map((o) => (
          <div key={o.id} className="glass p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-semibold">{o.title}</span>
              <span className={`text-xs px-2 py-0.5 rounded ${colors[o.status]}`}>{o.status}</span>
              <span className="text-xs text-slate-500 ml-auto">{formatDate(o.createdAt)}</span>
            </div>
            <div className="text-sm text-slate-400 mb-2">联系人：{o.contactName} · {o.contactInfo} {o.budget && <>· 预算 ¥{(o.budget / 100).toFixed(2)}</>}</div>
            <p className="text-slate-300 whitespace-pre-wrap text-sm">{o.content}</p>
            {o.remark && <p className="text-xs text-slate-500 mt-2">备注：{o.remark}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
