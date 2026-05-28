/**
 * 一次性脚本：把 Article 表里所有非 ASCII 的 slug 重新生成（中文走拼音）
 * 运行：npx tsx prisma/backfill-slugs.ts
 */
import { PrismaClient } from '@prisma/client';
import { makeSlug } from '../src/lib/utils';

const prisma = new PrismaClient();

async function main() {
  const articles = await prisma.article.findMany({ select: { id: true, slug: true, title: true } });
  let updated = 0;

  for (const a of articles) {
    // 只处理含非 ASCII 字符的 slug
    if (/^[\x00-\x7F]+$/.test(a.slug)) continue;

    let candidate = makeSlug(a.title);
    // 防重：如果已存在同 slug（且不是自己），后缀 -2/-3
    let suffix = 1;
    let final = candidate;
    while (true) {
      const existed = await prisma.article.findUnique({ where: { slug: final } });
      if (!existed || existed.id === a.id) break;
      suffix += 1;
      final = `${candidate}-${suffix}`;
    }
    await prisma.article.update({ where: { id: a.id }, data: { slug: final } });
    console.log(`✓ ${a.id}: "${a.slug}" → "${final}"`);
    updated += 1;
  }

  console.log(`\n完成。共更新 ${updated} 条。`);
}

main().finally(() => prisma.$disconnect());
