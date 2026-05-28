import { prisma } from '@/lib/prisma';
import { site } from '@/lib/site';

export const dynamic = 'force-dynamic';

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]!));
}

export async function GET() {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take: 50,
  });
  const items = articles
    .map(
      (a) => `<item>
  <title>${escapeXml(a.title)}</title>
  <link>${site.url}/article/${a.slug}</link>
  <guid>${site.url}/article/${a.slug}</guid>
  <pubDate>${(a.publishedAt || a.createdAt).toUTCString()}</pubDate>
  <description>${escapeXml(a.summary || '')}</description>
</item>`,
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${escapeXml(site.name)}</title>
<link>${site.url}</link>
<description>${escapeXml(site.description)}</description>
<language>zh-cn</language>
${items}
</channel>
</rss>`;
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}
