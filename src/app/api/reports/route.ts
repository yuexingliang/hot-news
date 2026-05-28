import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  type: z.enum(['article', 'comment']),
  targetId: z.string(),
  reason: z.string().min(1).max(500),
  contact: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json());
    await prisma.report.create({ data });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
