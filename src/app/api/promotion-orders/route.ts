import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  contactName: z.string().min(1).max(40),
  contactInfo: z.string().min(1).max(200),
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(20000),
  budget: z.number().optional(),
  remark: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json());
    const order = await prisma.promotionOrder.create({ data });
    return NextResponse.json({ ok: true, id: order.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
