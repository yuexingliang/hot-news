'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Send, Sparkles } from 'lucide-react';

export default function PromotionApplyPage() {
  const [form, setForm] = useState({ contactName: '', contactInfo: '', title: '', content: '', budget: '', remark: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/promotion-orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...form, budget: form.budget ? Number(form.budget) : undefined }),
    });
    setLoading(false);
    if (res.ok) {
      setDone(true);
      toast.success('已提交，工作人员会尽快联系你');
    } else {
      toast.error('提交失败，请检查表单');
    }
  };

  if (done) {
    return (
      <div className="pt-32 pb-20 max-w-xl mx-auto px-4 text-center">
        <Sparkles className="w-16 h-16 mx-auto text-neon-cyan animate-glow mb-6" />
        <h1 className="text-3xl font-bold mb-3"><span className="text-gradient">提交成功！</span></h1>
        <p className="text-slate-400">我们将在 24 小时内通过你提供的联系方式与你沟通投放细节。</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 max-w-2xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-3"><span className="text-gradient">投放推广合作</span></h1>
      <p className="text-slate-400 mb-10">填写下面的表单，告诉我们你的需求。</p>
      <form onSubmit={submit} className="glass p-6 space-y-4">
        {[
          { k: 'contactName', l: '您的称呼', t: 'text', required: true },
          { k: 'contactInfo', l: '联系方式（邮箱/微信/电话）', t: 'text', required: true },
          { k: 'title', l: '推广主题 / 产品名', t: 'text', required: true },
          { k: 'budget', l: '预算（元，可选）', t: 'number', required: false },
        ].map((f) => (
          <label key={f.k} className="block">
            <span className="text-sm text-slate-400">{f.l}</span>
            <input
              type={f.t}
              required={f.required}
              value={(form as any)[f.k]}
              onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
              className="mt-1 w-full bg-white/5 rounded-lg px-3 py-2 border border-white/10 outline-none focus:border-brand-400"
            />
          </label>
        ))}
        <label className="block">
          <span className="text-sm text-slate-400">推广文案 / 投放需求</span>
          <textarea
            required
            rows={6}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="mt-1 w-full bg-white/5 rounded-lg px-3 py-2 border border-white/10 outline-none focus:border-brand-400 resize-none"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-400">备注</span>
          <input
            value={form.remark}
            onChange={(e) => setForm({ ...form, remark: e.target.value })}
            className="mt-1 w-full bg-white/5 rounded-lg px-3 py-2 border border-white/10 outline-none focus:border-brand-400"
          />
        </label>
        <button disabled={loading} className="btn-neon w-full disabled:opacity-50">
          {loading ? '提交中...' : <>提交申请 <Send className="w-4 h-4" /></>}
        </button>
      </form>
    </div>
  );
}
