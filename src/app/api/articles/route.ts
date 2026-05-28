import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { sanitizeUserHtml } from '@/lib/sanitize';
import { makeSlug } from '@/lib/utils';
import { z } from 'zod';

const articleSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().optional(),
  summary: z.string().optional(),
  cover: z.string().optional(),
  contentType: z.enum(['MARKDOWN', 'HTML', 'RICH']),
  content: z.string().min(1),
  status: z.enum(['DRAFT', 'PENDING', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  isPromotion: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isTop: z.boolean().optional(),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  seoKeywords: z.string().optional(),
  publishedAt: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const page = Math.max(1, parseInt(sp.get('page') || '1'));
  const pageSize = Math.min(50, parseInt(sp.get('pageSize') || '12'));
  const category = sp.get('category') || undefined;
  const tag = sp.get('tag') || undefined;
  const q = sp.get('q') || undefined;
  const promotion = sp.get('promotion');

  const where: any = { status: 'PUBLISHED' };
  if (category) where.category = { slug: category };
  if (tag) where.tags = { some: { tag: { slug: tag } } };
  if (q) where.OR = [{ title: { contains: q, mode: 'insensitive' } }, { summary: { contains: q, mode: 'insensitive' } }];
  if (promotion === '1') where.isPromotion = true;
  if (promotion === '0') where.isPromotion = false;

  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: [{ isTop: 'desc' }, { publishedAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true, slug: true, title: true, summary: true, cover: true,
        publishedAt: true, views: true, likes: true, isPromotion: true, isFeatured: true,
        category: { select: { name: true, slug: true } },
        author: { select: { name: true, avatar: true } },
      },
    }),
    prisma.article.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const data = articleSchema.parse(body);

    // slug 必须是 ASCII URL 安全字符；用户输入含中文/其他时走 makeSlug 重新生成
    const rawSlug = data.slug?.trim();
    const slug = rawSlug && /^[a-z0-9-]+$/i.test(rawSlug) ? rawSlug : makeSlug(rawSlug || data.title);

    let content = data.content;
    let rawHtml: string | undefined;
    if (data.contentType === 'HTML' || data.contentType === 'RICH') {
      rawHtml = data.content;
      content = sanitizeUserHtml(data.content);
    }

    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug,
        summary: data.summary,
        cover: data.cover,
        contentType: data.contentType,
        content,
        rawHtml,
        status: data.status,
        isPromotion: data.isPromotion ?? false,
        isFeatured: data.isFeatured ?? false,
        isTop: data.isTop ?? false,
        categoryId: data.categoryId || null,
        seoTitle: data.seoTitle,
        seoDesc: data.seoDesc,
        seoKeywords: data.seoKeywords,
        publishedAt: data.status === 'PUBLISHED' ? (data.publishedAt ? new Date(data.publishedAt) : new Date()) : data.publishedAt ? new Date(data.publishedAt) : null,
        authorId: admin.id,
        tags: data.tagIds?.length
          ? { create: data.tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })) }
          : undefined,
      },
    });

    return NextResponse.json(article);
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: '未授权' }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
