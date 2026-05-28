import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const all = await prisma.setting.findMany();
  const values = Object.fromEntries(all.map((s) => [s.key, s.value]));
  return NextResponse.json({ values });
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const { values } = await req.json();
    await Promise.all(
      Object.entries(values || {}).map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          create: { key, value: String(value) },
          update: { value: String(value) },
        }),
      ),
    );
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
