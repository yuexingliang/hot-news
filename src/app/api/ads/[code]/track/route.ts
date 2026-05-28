import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { code: string } }) {
  const { type } = await req.json().catch(() => ({ type: 'impression' }));
  const field = type === 'click' ? 'clicks' : 'impressions';
  await prisma.adSlot.update({ where: { code: params.code }, data: { [field]: { increment: 1 } } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
