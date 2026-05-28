'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Check, X, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CommentRow({ comment }: { comment: any }) {
  const router = useRouter();
  const [status, setStatus] = useState(comment.status);
  const update = async (s: string) => {
    const res = await fetch(`/api/admin/comments/${comment.id}`, {
      method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status: s }),
    });
    if (res.ok) { setStatus(s); toast.success('已更新'); router.refresh(); }
  };
  const remove = async () => {
    if (!confirm('删除该评论？')) return;
    const res = await fetch(`/api/admin/comments/${comment.id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('已删除'); router.refresh(); }
  };
  return (
    <div className="glass p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-medium">{comment.user?.name || comment.guestName || '匿名'}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded ${status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300' : status === 'REJECTED' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'}`}>{status}</span>
        <span className="text-xs text-slate-500 ml-auto">→ {comment.article?.title}</span>
      </div>
      <p className="text-slate-300 mb-3">{comment.content}</p>
      <div className="flex gap-2">
        <button onClick={() => update('APPROVED')} className="btn-ghost !px-3 !py-1 text-sm text-emerald-300"><Check className="w-4 h-4" /> 通过</button>
        <button onClick={() => update('REJECTED')} className="btn-ghost !px-3 !py-1 text-sm text-rose-300"><X className="w-4 h-4" /> 拒绝</button>
        <button onClick={remove} className="btn-ghost !px-3 !py-1 text-sm text-rose-400 ml-auto"><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
}
