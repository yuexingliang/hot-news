'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

export default function AdminTagsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const load = () => fetch('/api/tags').then((r) => r.json()).then((d) => setItems(d.items || []));
  useEffect(() => { load(); }, []);
  const add = async () => {
    if (!name) return;
    const res = await fetch('/api/tags', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name }),
    });
    if (res.ok) { toast.success('已添加'); setName(''); load(); }
  };
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold"><span className="text-gradient">标签管理</span></h1>
      <div className="glass p-4 flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="标签名" className="flex-1 bg-white/5 rounded px-3 py-2 border border-white/10 outline-none" />
        <button onClick={add} className="btn-neon"><Plus className="w-4 h-4" /> 添加</button>
      </div>
      <div className="glass p-4 flex flex-wrap gap-2">
        {items.map((t) => <span key={t.id} className="px-3 py-1 rounded-full bg-white/5">#{t.name}</span>)}
      </div>
    </div>
  );
}
