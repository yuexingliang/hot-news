import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({
  articleId: z.string(),
  content: z.string().min(1).max(2000),
  parentId: z.string().optional(),
  guestName: z.string().max(40).optional(),
  guestEmail: z.string().email().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json());
    const user = await getSessionUser();
    const comment = await prisma.comment.create({
      data: {
        articleId: data.articleId,
        content: data.content.replace(/<[^>]*>/g, ''),
        parentId: data.parentId,
        userId: user?.id,
        guestName: user ? null : data.guestName,
        guestEmail: user ? null : data.guestEmail,
        status: 'PENDING',
      },
    });
    return NextResponse.json(comment);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const articleId = req.nextUrl.searchParams.get('articleId');
  if (!articleId) return NextResponse.json({ items: [] });
  const items = await prisma.comment.findMany({
    where: { articleId, status: 'APPROVED' },
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, avatar: true } }, replies: { include: { user: { select: { name: true, avatar: true } } } } },
  });
  return NextResponse.json({ items });
}
