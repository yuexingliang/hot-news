'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const FIELDS = [
  { key: 'site_name', label: '站点名称' },
  { key: 'site_desc', label: '站点描述' },
  { key: 'site_keywords', label: 'SEO 关键词' },
  { key: 'site_logo', label: 'Logo URL' },
  { key: 'icp', label: 'ICP 备案号' },
  { key: 'gongan', label: '公安备案' },
  { key: 'copyright', label: '版权文字' },
];

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    fetch('/api/admin/settings').then((r) => r.json()).then((d) => setValues(d.values || {}));
  }, []);
  const save = async () => {
    setSaving(true);
    const res = await fetch('/api/admin/settings', {
      method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ values }),
    });
    setSaving(false);
    if (res.ok) toast.success('已保存'); else toast.error('保存失败');
  };
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold"><span className="text-gradient">站点设置</span></h1>
      <div className="glass p-5 space-y-3">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="text-sm text-slate-400">{f.label}</label>
            <input
              value={values[f.key] || ''}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              className="w-full bg-white/5 rounded px-3 py-2 border border-white/10 outline-none focus:border-brand-400"
            />
          </div>
        ))}
        <button disabled={saving} onClick={save} className="btn-neon">{saving ? '保存中...' : '保存设置'}</button>
      </div>
    </div>
  );
}
