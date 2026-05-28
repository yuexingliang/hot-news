'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ReportPage() {
  const [form, setForm] = useState({ targetId: '', reason: '', contact: '' });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'article', ...form }),
    });
    if (res.ok) toast.success('举报已收到');
  };
  return (
    <div className="pt-24 pb-20 max-w-xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6"><span className="text-gradient">投诉举报</span></h1>
      <form onSubmit={submit} className="glass p-5 space-y-3">
        <input value={form.targetId} onChange={(e) => setForm({ ...form, targetId: e.target.value })} placeholder="举报内容ID或URL" required className="w-full bg-white/5 rounded-lg px-3 py-2 border border-white/10 outline-none" />
        <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} rows={4} placeholder="举报理由" required className="w-full bg-white/5 rounded-lg px-3 py-2 border border-white/10 outline-none" />
        <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="联系方式（可选）" className="w-full bg-white/5 rounded-lg px-3 py-2 border border-white/10 outline-none" />
        <button className="btn-neon">提交举报</button>
      </form>
    </div>
  );
}
