'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Save, Eye, Image as ImageIcon } from 'lucide-react';

type Cat = { id: string; name: string };
type Tag = { id: string; name: string };

export default function ArticleEditor({ initial, id }: { initial?: any; id?: string }) {
  const router = useRouter();
  const [cats, setCats] = useState<Cat[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [form, setForm] = useState({
    title: initial?.title || '',
    slug: initial?.slug || '',
    summary: initial?.summary || '',
    cover: initial?.cover || '',
    contentType: initial?.contentType || 'MARKDOWN',
    content: initial?.rawHtml || initial?.content || '',
    status: initial?.status || 'DRAFT',
    isPromotion: initial?.isPromotion || false,
    isFeatured: initial?.isFeatured || false,
    isTop: initial?.isTop || false,
    categoryId: initial?.categoryId || '',
    tagIds: initial?.tags?.map((t: any) => t.tagId) || [],
    seoTitle: initial?.seoTitle || '',
    seoDesc: initial?.seoDesc || '',
    seoKeywords: initial?.seoKeywords || '',
    publishedAt: initial?.publishedAt ? String(initial.publishedAt).slice(0, 16) : '',
  });
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then((d) => setCats(d.items || []));
    fetch('/api/tags').then((r) => r.json()).then((d) => setTags(d.items || []));
  }, []);

  const upload = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (res.ok) return data.url as string;
    toast.error(data.error || '上传失败');
    return null;
  };

  const onCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = await upload(f);
    if (url) setForm((p) => ({ ...p, cover: url }));
  };

  const onInsertImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const f = input.files?.[0];
      if (!f) return;
      const url = await upload(f);
      if (url) {
        const insert = form.contentType === 'MARKDOWN' ? `\n![](${url})\n` : `\n<img src="${url}" alt="" />\n`;
        setForm((p) => ({ ...p, content: p.content + insert }));
        toast.success('已插入图片');
      }
    };
    input.click();
  };

  const submit = async (overrideStatus?: string) => {
    setSaving(true);
    const payload = { ...form, status: overrideStatus || form.status };
    const url = id ? `/api/articles/${id}` : '/api/articles';
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) {
      toast.success('保存成功');
      router.push('/admin/articles');
      router.refresh();
    } else {
      const e = await res.json();
      toast.error(e.error || '保存失败');
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="文章标题..."
          className="w-full bg-transparent text-3xl font-bold outline-none placeholder:text-slate-600"
        />
        <input
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          placeholder="URL slug（留空自动生成）"
          className="w-full bg-white/5 rounded-lg px-3 py-2 border border-white/10 outline-none focus:border-brand-400 text-sm"
        />
        <textarea
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          rows={2}
          placeholder="摘要（列表页展示）"
          className="w-full bg-white/5 rounded-lg px-3 py-2 border border-white/10 outline-none focus:border-brand-400 resize-none"
        />

        <div className="glass p-4 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={form.contentType}
              onChange={(e) => setForm({ ...form, contentType: e.target.value as any })}
              className="bg-white/5 rounded px-2 py-1 border border-white/10 text-sm"
            >
              <option value="MARKDOWN">Markdown</option>
              <option value="HTML">原生 HTML</option>
              <option value="RICH">富文本 HTML</option>
            </select>
            <button type="button" onClick={onInsertImage} className="btn-ghost !px-3 !py-1 text-sm">
              <ImageIcon className="w-4 h-4" /> 插入图片
            </button>
            <button type="button" onClick={() => setPreview(!preview)} className="btn-ghost !px-3 !py-1 text-sm ml-auto">
              <Eye className="w-4 h-4" /> {preview ? '编辑' : '预览'}
            </button>
          </div>
          {form.contentType !== 'MARKDOWN' && (
            <p className="text-xs text-amber-300/80">
              ⚠ HTML 内容将经过 DOMPurify 白名单过滤：保留排版/样式/iframe，移除 script 与危险事件。
            </p>
          )}
          {preview ? (
            <div
              className="user-html prose-article min-h-[400px] p-3 bg-white/5 rounded-lg"
              dangerouslySetInnerHTML={{ __html: form.contentType === 'MARKDOWN' ? renderMd(form.content) : form.content }}
            />
          ) : (
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={20}
              placeholder={form.contentType === 'MARKDOWN' ? '# 用 Markdown 写文章...' : '<div>用 HTML 写炫酷的内容...</div>'}
              className="w-full bg-slate-950/50 font-mono text-sm rounded-lg px-3 py-2 border border-white/10 outline-none focus:border-brand-400 resize-none"
            />
          )}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="glass p-4 space-y-3">
          <h3 className="font-semibold">发布</h3>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full bg-white/5 rounded px-2 py-2 border border-white/10 text-sm">
            <option value="DRAFT">草稿</option>
            <option value="PENDING">待审核</option>
            <option value="PUBLISHED">已发布</option>
            <option value="ARCHIVED">已归档</option>
          </select>
          <input
            type="datetime-local"
            value={form.publishedAt}
            onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
            className="w-full bg-white/5 rounded px-2 py-2 border border-white/10 text-sm"
          />
          <p className="text-xs text-slate-500">设置未来时间可定时发布</p>
          <div className="space-y-2 text-sm">
            {([
              ['isPromotion', '标记为推广 / 软文'],
              ['isFeatured', '加入编辑精选'],
              ['isTop', '置顶'],
            ] as const).map(([k, l]) => (
              <label key={k} className="flex items-center gap-2">
                <input type="checkbox" checked={(form as any)[k]} onChange={(e) => setForm({ ...form, [k]: e.target.checked })} />
                {l}
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => submit('DRAFT')} disabled={saving} className="btn-ghost flex-1 disabled:opacity-50">
              <Save className="w-4 h-4" /> 草稿
            </button>
            <button onClick={() => submit('PUBLISHED')} disabled={saving} className="btn-neon flex-1 disabled:opacity-50">
              {saving ? '保存中...' : '发布'}
            </button>
          </div>
        </div>

        <div className="glass p-4 space-y-3">
          <h3 className="font-semibold">分类与标签</h3>
          <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full bg-white/5 rounded px-2 py-2 border border-white/10 text-sm">
            <option value="">未分类</option>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="flex flex-wrap gap-1">
            {tags.map((t) => {
              const checked = form.tagIds.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setForm({ ...form, tagIds: checked ? form.tagIds.filter((x: string) => x !== t.id) : [...form.tagIds, t.id] })}
                  className={`text-xs px-2 py-1 rounded-full ${checked ? 'bg-gradient-to-r from-neon-purple to-neon-cyan' : 'bg-white/5'}`}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass p-4 space-y-3">
          <h3 className="font-semibold">封面图</h3>
          {form.cover && <img src={form.cover} alt="" className="rounded-lg" />}
          <input type="file" accept="image/*" onChange={onCoverUpload} className="text-sm" />
          <input
            value={form.cover}
            onChange={(e) => setForm({ ...form, cover: e.target.value })}
            placeholder="或粘贴图片 URL"
            className="w-full bg-white/5 rounded px-2 py-1.5 border border-white/10 text-sm outline-none"
          />
        </div>

        <div className="glass p-4 space-y-2">
          <h3 className="font-semibold">SEO</h3>
          <input
            value={form.seoTitle}
            onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
            placeholder="SEO 标题"
            className="w-full bg-white/5 rounded px-2 py-1.5 border border-white/10 text-sm outline-none"
          />
          <textarea
            value={form.seoDesc}
            onChange={(e) => setForm({ ...form, seoDesc: e.target.value })}
            rows={2}
            placeholder="SEO 描述"
            className="w-full bg-white/5 rounded px-2 py-1.5 border border-white/10 text-sm outline-none resize-none"
          />
          <input
            value={form.seoKeywords}
            onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })}
            placeholder="SEO 关键词（逗号分隔）"
            className="w-full bg-white/5 rounded px-2 py-1.5 border border-white/10 text-sm outline-none"
          />
        </div>
      </aside>
    </div>
  );
}

// 极简 Markdown 预览
function renderMd(s: string) {
  return s
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" />')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}
