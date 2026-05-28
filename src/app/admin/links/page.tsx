'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';

export default function LinksPage() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', url: '', logo: '' });
  const load = () => fetch('/api/admin/links').then((r) => r.json()).then((d) => setItems(d.items || []));
  useEffect(() => { load(); }, []);
  const add = async () => {
    if (!form.name || !form.url) return;
    const res = await fetch('/api/admin/links', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(form),
    });
    if (res.ok) { setForm({ name: '', url: '', logo: '' }); load(); toast.success('已添加'); }
  };
  const remove = async (id: string) => {
    if (!confirm('删除？')) return;
    const res = await fetch(`/api/admin/links/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('已删除'); load(); }
  };
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold"><span className="text-gradient">友情链接</span></h1>
      <div className="glass p-4 grid sm:grid-cols-4 gap-2">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="名称" className="bg-white/5 rounded px-3 py-2 border border-white/10 outline-none" />
        <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="URL" className="bg-white/5 rounded px-3 py-2 border border-white/10 outline-none" />
        <input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} placeholder="Logo URL（可选）" className="bg-white/5 rounded px-3 py-2 border border-white/10 outline-none" />
        <button onClick={add} className="btn-neon"><Plus className="w-4 h-4" /> 添加</button>
      </div>
      <div className="glass overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left"><tr><th className="p-3">名称</th><th className="p-3">URL</th><th className="p-3 text-right">操作</th></tr></thead>
          <tbody>
            {items.map((l) => (
              <tr key={l.id} className="border-t border-white/5">
                <td className="p-3">{l.name}</td>
                <td className="p-3 text-slate-400">{l.url}</td>
                <td className="p-3 text-right"><button onClick={() => remove(l.id)} className="p-2 rounded hover:bg-white/10 text-rose-400"><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
