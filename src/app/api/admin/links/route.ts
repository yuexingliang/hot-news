import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const items = await prisma.friendLink.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json({ items });
}
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const l = await prisma.friendLink.create({ data: body });
    return NextResponse.json(l);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
