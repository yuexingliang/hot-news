'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminAdsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);

  const load = () => fetch('/api/ads').then((r) => r.json()).then((d) => setItems(d.items || []));
  useEffect(() => { load(); }, []);

  const save = async () => {
    const res = await fetch('/api/ads', {
      method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(editing),
    });
    if (res.ok) { toast.success('已保存'); setEditing(null); load(); }
    else toast.error('保存失败');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold"><span className="text-gradient">广告位管理</span></h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((a) => (
          <div key={a.id} className="glass p-5 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{a.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded ${a.enabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-500/20'}`}>
                {a.enabled ? '启用' : '禁用'}
              </span>
            </div>
            <code className="text-xs text-slate-400">{a.code}</code>
            <p className="text-sm text-slate-400">{a.description}</p>
            <div className="text-xs text-slate-500">曝光 {a.impressions} · 点击 {a.clicks}</div>
            <button onClick={() => setEditing(a)} className="btn-ghost w-full !py-1.5 text-sm">编辑</button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="glass-strong w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-3">
            <h3 className="text-xl font-bold">编辑广告位 - {editing.name}</h3>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={editing.enabled} onChange={(e) => setEditing({ ...editing, enabled: e.target.checked })} />
              启用
            </label>
            <div>
              <label className="text-sm text-slate-400">图片 URL</label>
              <input value={editing.imageUrl || ''} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} className="w-full bg-white/5 rounded px-3 py-2 border border-white/10 outline-none" />
            </div>
            <div>
              <label className="text-sm text-slate-400">点击链接</label>
              <input value={editing.linkUrl || ''} onChange={(e) => setEditing({ ...editing, linkUrl: e.target.value })} className="w-full bg-white/5 rounded px-3 py-2 border border-white/10 outline-none" />
            </div>
            <div>
              <label className="text-sm text-slate-400">HTML 代码（百度联盟 / Google AdSense / 自定义）</label>
              <textarea
                value={editing.html || ''}
                onChange={(e) => setEditing({ ...editing, html: e.target.value })}
                rows={8}
                className="w-full bg-slate-950/50 font-mono text-sm rounded px-3 py-2 border border-white/10 outline-none resize-none"
              />
              <p className="text-xs text-amber-300/80 mt-1">⚠ HTML 会被 DOMPurify 过滤，AdSense 等需要 script 的代码请添加到 layout 里</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm text-slate-400">开始时间</label>
                <input type="datetime-local" value={editing.startAt ? String(editing.startAt).slice(0, 16) : ''} onChange={(e) => setEditing({ ...editing, startAt: e.target.value })} className="w-full bg-white/5 rounded px-3 py-2 border border-white/10 outline-none" />
              </div>
              <div>
                <label className="text-sm text-slate-400">结束时间</label>
                <input type="datetime-local" value={editing.endAt ? String(editing.endAt).slice(0, 16) : ''} onChange={(e) => setEditing({ ...editing, endAt: e.target.value })} className="w-full bg-white/5 rounded px-3 py-2 border border-white/10 outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditing(null)} className="btn-ghost">取消</button>
              <button onClick={save} className="btn-neon">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
