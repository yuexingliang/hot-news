import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { sanitizeUserHtml } from '@/lib/sanitize';

export async function GET() {
  const items = await prisma.adSlot.findMany({ orderBy: { code: 'asc' } });
  return NextResponse.json({ items });
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const data: any = { ...body };
    if (data.html) data.html = sanitizeUserHtml(data.html);
    const a = await prisma.adSlot.update({ where: { code: data.code }, data });
    return NextResponse.json(a);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
