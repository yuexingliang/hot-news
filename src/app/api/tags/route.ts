import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { makeSlug } from '@/lib/utils';

export async function GET() {
  const items = await prisma.tag.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const t = await prisma.tag.create({ data: { name: body.name, slug: makeSlug(body.name) } });
    return NextResponse.json(t);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
