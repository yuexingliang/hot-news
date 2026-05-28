'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const load = () => fetch('/api/categories').then((r) => r.json()).then((d) => setItems(d.items || []));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!name) return;
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, description: desc }),
    });
    if (res.ok) { toast.success('已添加'); setName(''); setDesc(''); load(); } else toast.error('添加失败');
  };

  const remove = async (id: string) => {
    if (!confirm('删除该分类？')) return;
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('已删除'); load(); }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold"><span className="text-gradient">分类管理</span></h1>
      <div className="glass p-4 grid sm:grid-cols-3 gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="分类名称" className="bg-white/5 rounded px-3 py-2 border border-white/10 outline-none" />
        <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="描述" className="bg-white/5 rounded px-3 py-2 border border-white/10 outline-none" />
        <button onClick={add} className="btn-neon"><Plus className="w-4 h-4" /> 添加</button>
      </div>
      <div className="glass overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left"><tr><th className="p-3">名称</th><th className="p-3">slug</th><th className="p-3">文章数</th><th className="p-3 text-right">操作</th></tr></thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t border-white/5">
                <td className="p-3">{c.name}</td>
                <td className="p-3 text-slate-400">{c.slug}</td>
                <td className="p-3">{c._count?.articles || 0}</td>
                <td className="p-3 text-right">
                  <button onClick={() => remove(c.id)} className="p-2 rounded hover:bg-white/10 text-rose-400"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
