import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { sanitizeUserHtml } from '@/lib/sanitize';
import { makeSlug } from '@/lib/utils';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const a = await prisma.article.findUnique({
    where: { id: params.id },
    include: { tags: { include: { tag: true } }, category: true, author: true },
  });
  if (!a) return NextResponse.json({ error: '未找到' }, { status: 404 });
  return NextResponse.json(a);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const body = await req.json();
    const data: any = { ...body };
    // slug 规范化：必须 ASCII；含中文/非法字符就走拼音重生成
    if (typeof data.slug === 'string') {
      const raw = data.slug.trim();
      data.slug = raw && /^[a-z0-9-]+$/i.test(raw) ? raw : makeSlug(raw || data.title || '');
    }
    if (data.contentType === 'HTML' || data.contentType === 'RICH') {
      data.rawHtml = data.content;
      data.content = sanitizeUserHtml(data.content);
    }
    if (data.tagIds) {
      await prisma.articleOnTag.deleteMany({ where: { articleId: params.id } });
      data.tags = { create: data.tagIds.map((tagId: string) => ({ tag: { connect: { id: tagId } } })) };
      delete data.tagIds;
    }
    if (data.publishedAt) data.publishedAt = new Date(data.publishedAt);
    if (data.status === 'PUBLISHED' && !data.publishedAt) data.publishedAt = new Date();

    const updated = await prisma.article.update({ where: { id: params.id }, data });
    return NextResponse.json(updated);
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: '未授权' }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await prisma.article.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: '未授权' }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
