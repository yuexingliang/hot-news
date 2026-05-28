# 🔥 HotNews 热点速递

**🌐 语言切换：** [English](./README.md) · **简体中文**（当前）

一个炫酷的「资讯 + 软文」混合站。基于 **Next.js 14 + Prisma + MySQL + Tailwind + Framer Motion** 构建。

## ✨ 特性

### 内容展示
- 首页（Hero 粒子背景、动态滚动、编辑精选、最新、热度榜、推广专区）
- 文章列表 / 分类 / 标签 / 搜索
- 文章详情（封面、面包屑、相关推荐、上一篇/下一篇、评论）
- 完整 SEO：sitemap.xml、robots.txt、JSON-LD 结构化数据、Open Graph、移动端响应式
- RSS 订阅

### 内容创作
- **三种内容形式可选**：Markdown / 原生 HTML / 富文本 HTML
- **用户写 HTML 也安全**：DOMPurify 白名单过滤（保留排版/样式/iframe，剔除 script + 危险事件）
- 实时预览
- 图片上传（自动按月分目录）
- 草稿 / 待审 / 发布 / 归档 / 定时发布

### 变现广告
- 5 个内置广告位：top-banner / sidebar / in-article / footer / feed
- 后台自助上下广告，支持自定义 HTML（百度联盟、Google AdSense 等）
- 曝光 + 点击数据统计
- 软文标识（「广告」角标 + 推广分类）
- 软文订单收集表单

### 用户互动
- 评论（支持游客 + 后台审核）
- 点赞 / 分享 / 举报

### 后台管理
- 文章 / 分类 / 标签 / 评论 / 广告位 / 友链 / 设置 / 软文订单 / 举报
- 概览仪表盘（多维数据）
- 管理员账号登录（NextAuth）

### 炫酷动效
- Hero 粒子背景（Canvas）
- Framer Motion 滚动入场
- 渐变文字、玻璃拟态卡片、霓虹按钮、Marquee 跑马灯
- 卡片悬浮上升、闪光扫过

---

## 🚀 快速开始

### 1. 安装依赖

```bash
cd hot-news
npm install
# 或 pnpm install / yarn
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`：

```env
DATABASE_URL="mysql://user:password@localhost:3306/hotnews"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"   # 必须填一个随机字符串
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123456"
```

> 💡 没装 MySQL？最快办法：
> - macOS：`brew install mysql && brew services start mysql && mysql -uroot -e "CREATE DATABASE hotnews CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"`
> - Docker：`docker run --name mysql -e MYSQL_ROOT_PASSWORD=pass -e MYSQL_DATABASE=hotnews -p 3306:3306 -d mysql:8`，然后把 `DATABASE_URL` 改成 `mysql://root:pass@localhost:3306/hotnews`
>
> ℹ️ 推荐 MySQL **8.0+**（默认 `utf8mb4_0900_ai_ci`，完整支持 emoji，搜索默认不区分大小写）。

### 3. 初始化数据库

```bash
npm run db:push       # 推送 Prisma schema 到数据库
npm run db:seed       # 创建管理员、分类、示例文章、广告位
```

### 4. 启动

```bash
npm run dev
```

访问：

- 前台：http://localhost:3000
- 后台：http://localhost:3000/admin
  - 账号：`admin@example.com`
  - 密码：`admin123456`（与 `.env` 中 `ADMIN_PASSWORD` 一致）

---

## 📁 目录结构

```
hot-news/
├── prisma/
│   ├── schema.prisma          # 数据模型
│   └── seed.ts                # 种子数据
├── public/uploads/            # 图片上传存放
└── src/
    ├── app/
    │   ├── (public)/          # 前台页面（首页/文章/分类/搜索/推广申请等）
    │   ├── admin/             # 后台管理
    │   ├── api/               # 全部 API 路由
    │   ├── sitemap.ts / robots.ts / rss.xml
    │   └── layout.tsx
    ├── components/
    │   ├── public/            # 前台组件（Header/Footer/Hero/ArticleCard/AdSlot/CommentBox...）
    │   ├── admin/             # 后台组件（Sidebar/ArticleEditor...）
    │   └── animations/        # 动效组件（粒子、Reveal）
    ├── lib/
    │   ├── prisma.ts          # Prisma 单例
    │   ├── auth.ts            # NextAuth 配置 + requireAdmin
    │   ├── sanitize.ts        # DOMPurify 白名单过滤
    │   ├── site.ts / utils.ts
    └── middleware.ts          # /admin 路由保护
```

---

## 🛠 常用命令

```bash
npm run dev          # 开发
npm run build        # 生产构建
npm run start        # 启动生产服务
npm run db:push      # 同步 schema（开发期推荐）
npm run db:migrate   # 创建迁移（生产推荐）
npm run db:studio    # Prisma 可视化工具
npm run db:seed      # 重新初始化种子数据
```

---

## 🎯 关键玩法

### 用户/作者发布带样式的 HTML 文章

后台「写文章」→ 选择内容形式为 **「原生 HTML」** → 直接贴 HTML（含内联 style、动画类、iframe 等）。系统会通过 DOMPurify 过滤 `<script>`、`onerror`、`javascript:` 等危险内容，但保留绝大多数排版与样式标签。

### 接入百度联盟 / Google AdSense

1. 在 `.env` 填 `NEXT_PUBLIC_ADSENSE_CLIENT="ca-pub-xxx"`，全站会自动加载 AdSense 脚本
2. 在「广告位管理」对应位置粘贴 `<ins class="adsbygoogle">…</ins>` 等代码（或图片 + 链接），启用即生效

### 接入百度统计 / Google Analytics

填 `.env` 中 `NEXT_PUBLIC_BAIDU_ANALYTICS`、`NEXT_PUBLIC_GOOGLE_ANALYTICS` 即可。

### 提交 sitemap 到搜索引擎

部署后访问 `https://你的域名/sitemap.xml` 验证 → 提交到百度站长平台 / Google Search Console。

---

## 🚢 部署建议

- **Vercel**：免费、最简单，需要外接数据库（PlanetScale、Aiven、Railway，或阿里云/腾讯云 RDS for MySQL）
- **自建 VPS**：`pm2 start "npm run start"`；Nginx 做反代 + HTTPS；数据库装本机 MySQL
- **Docker**：自行编写 Dockerfile（Next standalone 模式 + Prisma binary）

⚠️ 上线前请：
1. 修改 `ADMIN_PASSWORD` 默认密码
2. 重新生成 `NEXTAUTH_SECRET`
3. 完成 ICP 备案 + 公安备案（中国大陆部署）并填到「站点设置」
4. 检查广告位 / 推广文章合规（《互联网广告管理办法》）

---

## 📜 License

MIT
