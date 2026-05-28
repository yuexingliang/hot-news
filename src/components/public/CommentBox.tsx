'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

export default function CommentBox({ articleId }: { articleId: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch(`/api/comments?articleId=${articleId}`).then((r) => r.json());
    setItems(res.items || []);
  };
  useEffect(() => {
    load();
  }, [articleId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ articleId, content, guestName: name || '匿名' }),
    });
    setLoading(false);
    if (res.ok) {
      toast.success('评论已提交，待审核后展示');
      setContent('');
    } else {
      toast.error('评论失败');
    }
  };

  return (
    <section className="mt-12">
      <h3 className="text-2xl font-bold mb-6">💬 评论 <span className="text-slate-500 text-base">({items.length})</span></h3>
      <form onSubmit={submit} className="glass p-4 mb-8 space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="昵称（可选）"
          className="w-full bg-white/5 rounded-lg px-3 py-2 outline-none border border-transparent focus:border-brand-400"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="留下你的看法...（HTML 标签会被自动剔除）"
          className="w-full bg-white/5 rounded-lg px-3 py-2 outline-none border border-transparent focus:border-brand-400 resize-none"
        />
        <div className="flex justify-end">
          <button disabled={loading} className="btn-neon disabled:opacity-50">{loading ? '提交中...' : '提交评论'}</button>
        </div>
      </form>
      <div className="space-y-4">
        {items.length === 0 && <p className="text-center text-slate-500 py-8">还没有评论，快来抢沙发！</p>}
        {items.map((c) => (
          <div key={c.id} className="glass p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-xs font-bold">
                {(c.user?.name || c.guestName || 'U')[0]}
              </div>
              <span className="font-medium">{c.user?.name || c.guestName || '匿名用户'}</span>
              <span className="text-xs text-slate-500 ml-auto">{formatDate(c.createdAt)}</span>
            </div>
            <p className="text-slate-300 whitespace-pre-wrap">{c.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
