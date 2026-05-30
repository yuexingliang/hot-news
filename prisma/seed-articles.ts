/**
 * 批量种子文章数据
 * 用法：npm run db:seed:articles
 *
 * 行为：
 *  - 确保管理员、5 个分类、若干标签存在（不存在才创建）
 *  - 为 tech / finance / entertainment / lifestyle 各生成 20 篇文章
 *  - 为 promotion 分类生成 5 篇软文
 *  - 基于 slug upsert，可重复执行不会产生重复
 */
import {
  PrismaClient,
  Role,
  ArticleStatus,
  ContentType,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ---------- 数据池 ----------

// 每个分类的标题模板（用 {n} 占位序号）
const TITLE_POOL: Record<string, string[]> = {
  tech: [
    'AI 重塑工作流：{n} 个你必须知道的真实案例',
    '从 GPT-4 到 GPT-5，大模型这一年到底进化了什么',
    '量子计算商业化倒计时：{n} 大行业即将被改写',
    '开源 LLM 的崛起：为什么巨头们都开始"焦虑"',
    '苹果 Vision Pro 二代曝光：空间计算的下一站',
    'Rust 取代 C++？操作系统内核的新一轮革命',
    '边缘计算十年回顾：从概念到 5G 落地',
    '机器人外卖员真的来了：{n} 个城市率先试点',
    '云原生架构 2026：Kubernetes 之外的新选择',
    '端到端自动驾驶：特斯拉 FSD V13 实测分析',
    '芯片战争最新战况：3nm 到 2nm 的真实差距',
    '星链 vs 国产卫星互联网：{n} 个关键指标对比',
    'Web3 还有未来吗？{n} 个真实落地的应用',
    '人形机器人量产元年：哪些公司已经领跑',
    '生成式 AI 的版权困局：法律到底怎么判',
    '从 Copilot 到 Agent：编程方式的范式迁移',
    '低代码 / 无代码：是机会还是泡沫',
    '隐私计算落地难题：{n} 个企业级真实案例',
    '元宇宙凉了？看看真实在赚钱的{n}家公司',
    '中国 AI 芯片突围战：国产替代的真实进度',
  ],
  finance: [
    '2026 年 A 股策略：{n} 大主线值得长期布局',
    '美联储加息周期终结：全球资本将流向哪里',
    '比特币破 10 万美金后：散户该上车还是离场',
    '黄金牛市的底层逻辑：{n} 个不可忽视的信号',
    '新能源车价格战进入下半场：谁能笑到最后',
    '消费降级背后：{n} 个被忽视的投资机会',
    '人民币国际化加速：跨境支付迎来{n}年最大变局',
    'REITs 真的香吗？普通人配置指南',
    '银行理财净值化时代：你的钱还安全吗',
    '美元霸权松动：去美元化的真实进度',
    '港股通 vs A股：2026 估值差距还会扩大吗',
    '从巴菲特持仓看价值投资的进化',
    'AI 投顾大爆发：散户的福音还是新韭菜',
    '保险行业变天：{n} 个新品种值得关注',
    '可转债打新还能闭眼买吗：{n} 个数据告诉你答案',
    '基金经理跑路潮：明星基金的隐忧',
    '房产税真的要来了？专家最新解读',
    '黄金 vs 比特币：避险资产的世纪之争',
    'ESG 投资退潮：是回归理性还是周期到了',
    '小微企业贷款新政：能拿到钱的{n}个关键',
  ],
  entertainment: [
    '春节档票房突破{n}亿：哪些电影成最大赢家',
    '顶流明星集体翻车：娱乐圈进入"去中心化"时代',
    '微短剧逆袭长视频：一年{n}亿的疯狂赛道',
    '内娱选秀重启：观众还买账吗',
    '《黑神话：悟空》之后，国产 3A 还有谁',
    '虚拟偶像爆发：{n} 个百万粉丝团出圈',
    '综艺剧本化争议：观众想看什么',
    '王家卫新作定档：花样年华续集来了',
    '韩流回潮？{n} 部新剧引爆全网',
    '迪士尼裁员风暴：流媒体战争的新拐点',
    '小破站破圈记：B 站如何抓住 Z 世代',
    '抖音电影宇宙：短视频如何重塑观影方式',
    '脱口秀第二春：哪些新人值得关注',
    '老牌歌手集体复出：怀旧经济的{n}年红利',
    '游戏直播行业洗牌：头部主播都去哪了',
    'AI 换脸法律红线：{n} 起判例敲响警钟',
    '《繁花》之后：王家卫审美还能复制吗',
    '剧本杀凉了？线下娱乐行业自救实录',
    '短视频降级潮：观众开始"反算法"',
    '春晚的{n}个新变化：流量明星彻底退场',
  ],
  lifestyle: [
    '{n} 平米也能住出豪宅感：极简装修指南',
    '咖啡续命指南：{n} 杯/天到底伤不伤身',
    '城市青年的"反内卷"生活：搬到{n}线小城后',
    '冬日护肤翻车自救：{n} 个皮肤科医生说真话',
    '健身房 vs 居家健身：哪种更适合你',
    '断舍离的{n}个层次：你在哪一层',
    '宠物经济爆发：养一只猫一年要花{n}万',
    '年轻人的"晚婚晚育"：背后是{n}个真问题',
    '一人食爆发：单身经济的下一个十年',
    '露营、骑行、飞盘：户外热的真实驱动力',
    '反消费主义浪潮：{n} 个不再"买买买"的理由',
    '中年人的健身房：{n} 项运动最容易受伤',
    '县城贵妇 vs 北上广精致穷：你怎么选',
    '失眠经济崛起：助眠产品到底有没有用',
    '间歇性断食真的有效吗：{n} 项研究告诉你',
    '租房改造的{n}个不踩雷技巧',
    '辞职考公还是辞职做博主：{n} 个真实账本',
    '00 后的"早 C 晚 A"：{n} 种新型养生法',
    '中产返贫的{n}个信号：你中了几个',
    '陪伴经济的崛起：从陪诊到陪聊',
  ],
  promotion: [
    '【推荐】这款 AI 写作神器，让你的产出效率翻 3 倍',
    '【限时】程序员副业首选：开源建站工具一键部署',
    '【精选】跨境电商必备工具：30 天回本的真实案例',
    '【新品】国产降噪耳机黑马：{n} 项测评全胜苹果',
    '【探店】被吃货排队 3 小时的网红店：到底值不值',
  ],
};

// 摘要模板池
const SUMMARY_POOL = [
  '深度解读{topic}，从行业数据到底层逻辑，一篇看懂。',
  '过去一年，{topic}发生了什么？我们采访了 10 位一线从业者。',
  '不是标题党：{topic}的真实进展，可能和你想的不一样。',
  '{topic} 背后的{n}个机会与{m}个陷阱，提前看清。',
  '一篇长文，把{topic}彻底讲明白。建议收藏。',
];

// 标签池（按分类）
const TAG_POOL: Record<string, string[]> = {
  tech: ['AI', '人工智能', '大模型', '云计算', '芯片', '机器人', '自动驾驶', 'Web3', '科技', '新品发布'],
  finance: ['A股', '美股', '加密货币', '宏观经济', '基金', '银行理财', '黄金', '人民币', '投资', '财经'],
  entertainment: ['影视', '票房', '明星', '综艺', '游戏', '短视频', '虚拟偶像', '娱乐', '热点', '春晚'],
  lifestyle: ['生活方式', '极简', '健身', '美食', '宠物', '装修', '护肤', '理财', '养生', '潮流'],
  promotion: ['推荐', '推广', '新品发布', '行业观察'],
};

// 分类对应的封面关键词（用于 Unsplash featured 图）
const COVER_KEYWORDS: Record<string, string[]> = {
  tech: ['technology', 'ai-robot', 'data-center', 'circuit', 'computer', 'chip', 'hacker', 'space', 'futuristic', 'coding'],
  finance: ['finance', 'stock-market', 'chart', 'gold', 'bank', 'business', 'money', 'bitcoin', 'wallstreet', 'economy'],
  entertainment: ['cinema', 'concert', 'movie', 'stage', 'gaming', 'film', 'music', 'celebrity', 'theater', 'spotlight'],
  lifestyle: ['lifestyle', 'coffee', 'fitness', 'travel', 'food', 'home', 'minimal', 'pet', 'fashion', 'nature'],
  promotion: ['product', 'gadget', 'shopping', 'deal', 'launch'],
};

// ---------- 工具函数 ----------

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildContent(category: string, title: string, idx: number) {
  const sections = [
    `## 一、为什么大家突然都在聊这件事`,
    `近期，**${title.replace(/【.*?】/g, '')}** 的话题在多个平台同时引爆。从微博、抖音到知乎、即刻，相关讨论的总曝光量已经突破亿级。`,
    `背后的原因并不简单——既有**行业层面**的客观推动，也有**用户情绪**的集中释放。我们梳理了过去 30 天的关键数据，得到下面这张趋势图：`,
    `> 数据来源：第三方监测机构（${2025 + (idx % 2)} 年 Q${(idx % 4) + 1}）`,
    ``,
    `## 二、3 个核心要点`,
    `1. **趋势确定**：相关搜索量同比增长 ${randomInt(80, 350)}%；`,
    `2. **结构变化**：核心用户从 25-35 岁向 18-25 岁迁移；`,
    `3. **商业拐点**：头部玩家的 ARR（年度经常性收入）首次跨过亿元门槛。`,
    ``,
    `## 三、对普通人意味着什么`,
    `如果你处在以下任意一种角色，建议重点关注：`,
    `- 从业者：行业洗牌窗口期，是跳槽 / 创业的最佳时机；`,
    `- 投资者：相关上市公司估值正在重构；`,
    `- 普通用户：新一轮的产品红利期，先用先得。`,
    ``,
    `## 四、写在最后`,
    `这不是一次短期热点，而是一个**正在发生**的结构性变化。我们会持续跟踪，下一篇文章将聚焦：`,
    `- 头部公司的真实财报数据`,
    `- 一线从业者的口述记录`,
    `- 普通人最容易抓住的 3 个机会`,
    ``,
    `> 觉得有用？欢迎点赞 + 收藏 + 转发，让更多人看到。`,
  ];
  return sections.join('\n');
}

function buildPromotionHtml(title: string) {
  return `<div style="background:linear-gradient(135deg,#7c3aed,#22d3ee);padding:48px;border-radius:24px;color:white;text-align:center">
  <h2 style="font-size:32px;margin:0 0 12px">🚀 ${title}</h2>
  <p style="font-size:18px;opacity:.9">限时优惠，错过等明年</p>
  <a href="#" style="display:inline-block;margin-top:20px;background:white;color:#7c3aed;padding:12px 32px;border-radius:999px;text-decoration:none;font-weight:600">立即查看</a>
</div>
<p style="margin-top:24px">本文为<strong>推广内容</strong>，由商家提供并经平台审核后发布。如有疑问请通过页面底部反馈。</p>
<ul>
  <li>支持 7 天无理由退款</li>
  <li>全国包邮，48 小时发货</li>
  <li>专属客服 1 对 1 服务</li>
</ul>`;
}

function buildSlug(category: string, idx: number) {
  return `${category}-${String(idx).padStart(3, '0')}`;
}

function buildCover(category: string, idx: number) {
  // 使用 Unsplash 的 featured/keyword 接口，随机种子保证每篇不同但稳定
  const kw = randomPick(COVER_KEYWORDS[category] || ['abstract']);
  const seed = `${category}-${idx}`;
  return `https://source.unsplash.com/featured/1200x630/?${kw}&sig=${seed}`;
}

// ---------- 主流程 ----------

async function ensureBaseData() {
  // 管理员
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
  const allTags = Array.from(
    new Set(Object.values(TAG_POOL).flat()),
  );
  for (const t of allTags) {
    await prisma.tag.upsert({
      where: { slug: t.toLowerCase() },
      update: {},
      create: { slug: t.toLowerCase(), name: t },
    });
  }

  return { admin };
}

async function seedCategoryArticles(
  categorySlug: string,
  count: number,
  authorId: string,
) {
  const cat = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!cat) throw new Error(`分类不存在：${categorySlug}`);

  const titles = TITLE_POOL[categorySlug] || [];
  const tagNames = TAG_POOL[categorySlug] || [];

  for (let i = 1; i <= count; i++) {
    const titleTpl = titles[(i - 1) % titles.length];
    const title = titleTpl
      .replace('{n}', String(randomInt(3, 9)))
      .replace('{m}', String(randomInt(2, 5)));

    const slug = buildSlug(categorySlug, i);
    const cover = buildCover(categorySlug, i);

    const summaryTpl = randomPick(SUMMARY_POOL);
    const summary = summaryTpl
      .replace('{topic}', title.replace(/【.*?】|[:：].*$/g, '').slice(0, 16))
      .replace('{n}', String(randomInt(3, 7)))
      .replace('{m}', String(randomInt(2, 5)));

    const isPromotion = categorySlug === 'promotion';
    const content = isPromotion
      ? buildPromotionHtml(title)
      : buildContent(categorySlug, title, i);

    // 随机选 2-3 个该分类的标签
    const pickedTagNames = Array.from(
      new Set(
        Array.from({ length: randomInt(2, 3) }).map(() => randomPick(tagNames)),
      ),
    );
    const pickedTags = await prisma.tag.findMany({
      where: { slug: { in: pickedTagNames.map((t) => t.toLowerCase()) } },
    });

    // 发布时间：在过去 60 天内随机分布，让首页/列表页更真实
    const publishedAt = new Date(Date.now() - randomInt(0, 60) * 86400_000);

    // 每个分类前 2 篇标记为首页推荐
    const isFeatured = !isPromotion && i <= 2;
    // 每个分类第 1 篇标记置顶
    const isTop = !isPromotion && i === 1;

    const article = await prisma.article.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        title,
        summary,
        cover,
        contentType: isPromotion ? ContentType.HTML : ContentType.MARKDOWN,
        content,
        rawHtml: isPromotion ? content : null,
        status: ArticleStatus.PUBLISHED,
        isPromotion,
        isFeatured,
        isTop,
        views: randomInt(120, 99000),
        likes: randomInt(5, 1200),
        publishedAt,
        authorId,
        categoryId: cat.id,
        seoTitle: `${title} - HotNews`,
        seoDesc: summary,
        seoKeywords: pickedTagNames.join(','),
      },
    });

    // 关联标签（先清空再插入，避免重复 seed 累积）
    await prisma.articleOnTag.deleteMany({ where: { articleId: article.id } });
    if (pickedTags.length > 0) {
      await prisma.articleOnTag.createMany({
        data: pickedTags.map((t) => ({ articleId: article.id, tagId: t.id })),
        skipDuplicates: true,
      });
    }

    process.stdout.write(`  ✓ ${slug}  ${title.slice(0, 28)}\n`);
  }
}

async function main() {
  console.log('🌱 开始批量生成文章数据...\n');
  const { admin } = await ensureBaseData();

  console.log('📂 [科技] 生成 20 篇');
  await seedCategoryArticles('tech', 20, admin.id);

  console.log('\n📂 [财经] 生成 20 篇');
  await seedCategoryArticles('finance', 20, admin.id);

  console.log('\n📂 [娱乐] 生成 20 篇');
  await seedCategoryArticles('entertainment', 20, admin.id);

  console.log('\n📂 [生活] 生成 20 篇');
  await seedCategoryArticles('lifestyle', 20, admin.id);

  console.log('\n📂 [推广] 生成 5 篇软文');
  await seedCategoryArticles('promotion', 5, admin.id);

  const total = await prisma.article.count();
  console.log(`\n🎉 文章数据初始化完成，当前文章总数：${total}`);
}

main()
  .catch((e) => {
    console.error('❌ 失败：', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
