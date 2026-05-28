import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  await prisma.article.update({ where: { id: params.id }, data: { views: { increment: 1 } } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
