import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { makeSlug } from '@/lib/utils';

export async function GET() {
  const items = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { articles: true } } },
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const slug = body.slug?.trim() || makeSlug(body.name);
    const c = await prisma.category.create({
      data: { name: body.name, slug, description: body.description, order: body.order ?? 0, cover: body.cover },
    });
    return NextResponse.json(c);
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: '未授权' }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
