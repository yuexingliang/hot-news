import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import path from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: '未选择文件' }, { status: 400 });
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: '文件超过 10MB' }, { status: 400 });

    const ext = path.extname(file.name) || '.bin';
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.mp4', '.webm'];
    if (!allowed.includes(ext.toLowerCase())) return NextResponse.json({ error: '不支持的文件类型' }, { status: 400 });

    const dir = path.join(process.cwd(), 'public', 'uploads', new Date().toISOString().slice(0, 7));
    await mkdir(dir, { recursive: true });
    const name = `${Date.now()}-${randomBytes(4).toString('hex')}${ext.toLowerCase()}`;
    const filepath = path.join(dir, name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    const url = `/uploads/${path.basename(dir)}/${name}`;
    return NextResponse.json({ url });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: '未授权' }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
