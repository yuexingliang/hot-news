import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const a = await prisma.article.update({
    where: { id: params.id },
    data: { likes: { increment: 1 } },
    select: { likes: true },
  });
  return NextResponse.json(a);
}
