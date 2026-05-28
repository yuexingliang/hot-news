import { PrismaClient, Role, ArticleStatus, ContentType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

  const hashed = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashed,
      name: '站长',
      role: Role.ADMIN,
      bio: '本站管理员',
    },
  });
  console.log('✅ 管理员账号:', adminEmail, '/ 密码:', adminPassword);

  // 分类
  const categories = [
    { slug: 'tech', name: '科技', description: '前沿科技与互联网热点', order: 1 },
    { slug: 'finance', name: '财经', description: '财经市场与商业洞察', order: 2 },
    { slug: 'entertainment', name: '娱乐', description: '娱乐圈热点八卦', order: 3 },
    { slug: 'lifestyle', name: '生活', description: '生活方式与潮流', order: 4 },
    { slug: 'promotion', name: '推广', description: '精选推广与软文', order: 99 },
  ];
  for (const c of categories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  // 标签
  const tags = ['AI', '热点', '科技', '区块链', '新品发布', '行业观察', '推荐'];
  for (const t of tags) {
    await prisma.tag.upsert({
      where: { slug: t.toLowerCase() },
      update: {},
      create: { slug: t.toLowerCase(), name: t },
    });
  }

  const techCat = await prisma.category.findUnique({ where: { slug: 'tech' } });
  const promoCat = await prisma.category.findUnique({ where: { slug: 'promotion' } });

  // 示例文章
  await prisma.article.upsert({
    where: { slug: 'welcome-to-hotnews' },
    update: {},
    create: {
      slug: 'welcome-to-hotnews',
      title: '欢迎来到 HotNews 热点速递',
      summary: '一个炫酷的资讯+软文混合站，使用 Next.js 14 + Prisma + Tailwind 打造。',
      cover: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200',
      contentType: ContentType.MARKDOWN,
      content: `# 欢迎来到 HotNews\n\n这是一个**全功能**的热点资讯与软文发布平台。\n\n## 主要特性\n\n- 🚀 Next.js 14 App Router + SSR\n- 🎨 Framer Motion 炫酷动画\n- 📝 支持 Markdown / 富文本 / 原生 HTML\n- 🛡️ DOMPurify 白名单过滤\n- 💰 多广告位 + AdSense 集成\n- 🔍 完整 SEO（sitemap、JSON-LD、OG）\n\n> 立即在后台发布你的第一篇文章吧！\n\n\`\`\`js\nconsole.log("Hello, HotNews!");\n\`\`\`\n`,
      status: ArticleStatus.PUBLISHED,
      isFeatured: true,
      isTop: true,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: techCat?.id,
      seoTitle: '欢迎来到 HotNews - 热点资讯与精选推广',
      seoDesc: 'HotNews 是一个聚合热点资讯并提供精选推广位的现代化内容平台。',
      seoKeywords: '热点,资讯,软文,推广',
    },
  });

  await prisma.article.upsert({
    where: { slug: 'demo-html-promotion' },
    update: {},
    create: {
      slug: 'demo-html-promotion',
      title: '【推广】用户自定义 HTML 文章演示',
      summary: '展示如何使用原生 HTML 制作一个炫酷的推广页面。',
      cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200',
      contentType: ContentType.HTML,
      content: `<div style="background:linear-gradient(135deg,#7c3aed,#22d3ee);padding:48px;border-radius:24px;color:white;text-align:center"><h2 style="font-size:32px;margin:0 0 12px">🚀 这是一个推广演示</h2><p style="font-size:18px;opacity:.9">用户可以使用 HTML 自由设计样式</p><a href="#" style="display:inline-block;margin-top:20px;background:white;color:#7c3aed;padding:12px 32px;border-radius:999px;text-decoration:none;font-weight:600">立即查看</a></div><p style="margin-top:24px">支持 <strong>加粗</strong>、<em>斜体</em>、<a href="#" style="color:#0ea5e9">链接</a>、图片、列表等。脚本与危险事件会被自动过滤。</p>`,
      status: ArticleStatus.PUBLISHED,
      isPromotion: true,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: promoCat?.id,
    },
  });

  // 默认广告位
  const slots = [
    { code: 'top-banner', name: '顶部横幅', description: '首屏顶部，最贵广告位' },
    { code: 'sidebar', name: '侧边栏', description: 'PC 列表页右侧' },
    { code: 'in-article', name: '文章内', description: '正文中段插入' },
    { code: 'footer', name: '文末推荐', description: '正文底部推荐位' },
    { code: 'feed', name: '信息流', description: '列表页混入' },
  ];
  for (const s of slots) {
    await prisma.adSlot.upsert({
      where: { code: s.code },
      update: {},
      create: { ...s, enabled: false },
    });
  }

  // 设置
  const settings = [
    ['site_name', 'HotNews 热点速递'],
    ['site_desc', '聚合热点 · 精选推广 · 一站式资讯'],
    ['site_keywords', '热点,资讯,软文,推广,科技,财经'],
    ['site_logo', ''],
    ['icp', ''],
    ['gongan', ''],
    ['copyright', `© ${new Date().getFullYear()} HotNews`],
  ];
  for (const [k, v] of settings) {
    await prisma.setting.upsert({ where: { key: k }, update: {}, create: { key: k, value: v } });
  }

  // 友情链接
  await prisma.friendLink.create({
    data: { name: 'Next.js', url: 'https://nextjs.org', order: 1 },
  }).catch(() => {});

  console.log('🎉 种子数据初始化完成');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
