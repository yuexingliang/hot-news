# 🔥 HotNews

**🌐 Language:** **English** (current) · [简体中文](./README.zh-CN.md)

A cool, modern hybrid site for **hot news + sponsored content**. Built with **Next.js 14 + Prisma + PostgreSQL + Tailwind + Framer Motion**.

## ✨ Features

### Content
- Homepage with particle Hero, scrolling marquee, editor's picks, latest feed, hot ranking, and a sponsored zone
- Article list / category / tag / search
- Article detail (cover, breadcrumbs, related posts, prev/next, comments)
- Full SEO: `sitemap.xml`, `robots.txt`, JSON-LD, Open Graph, mobile responsive
- RSS feed

### Authoring
- **Three content formats**: Markdown / raw HTML / rich-text HTML
- **Safe user HTML**: DOMPurify whitelist filtering (keeps layout/styles/iframe; strips `<script>` and dangerous handlers)
- Live preview
- Image upload (auto sharded by month)
- Draft / Pending / Published / Archived / scheduled publishing

### Monetization
- 5 built-in ad slots: `top-banner` / `sidebar` / `in-article` / `footer` / `feed`
- Self-serve ad management with custom HTML (Baidu Union, Google AdSense, etc.)
- Impression + click analytics
- Sponsored content badge ("Ad" tag + dedicated category)
- Promotion order intake form

### Engagement
- Comments (guest + moderation)
- Like / share / report

### Admin
- Articles / Categories / Tags / Comments / Ads / Friend Links / Settings / Promotion Orders / Reports
- Dashboard with multi-metric overview
- NextAuth credential login

### Eye candy
- Canvas particle background on Hero
- Framer Motion scroll-in animations
- Gradient text, glassmorphism cards, neon buttons, marquee ticker
- Card lift on hover, shine sweep effect

---

## 🚀 Quick start

### 1. Install dependencies

```bash
cd hot-news
npm install
# or pnpm install / yarn
```

### 2. Configure env

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/hotnews?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"   # generate a random string
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123456"
```

> 💡 Don't have PostgreSQL? Quickest options:
> - macOS: `brew install postgresql@16 && brew services start postgresql@16 && createdb hotnews`
> - Docker: `docker run --name postgres -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=hotnews -p 5432:5432 -d postgres:16`, then set `DATABASE_URL` to `postgresql://postgres:pass@localhost:5432/hotnews?schema=public`
> - Free cloud: [Neon](https://neon.tech) (free 0.5GB) / [Supabase](https://supabase.com) / [Railway](https://railway.com) / [Vercel Postgres](https://vercel.com/storage/postgres)
>
> ℹ️ PostgreSQL **14+** recommended. Search uses Prisma's `mode: 'insensitive'` (translates to `ILIKE`) for case-insensitive matching.

### 3. Init database

```bash
npm run db:push       # push Prisma schema to DB
npm run db:seed       # create admin, categories, sample articles, ad slots
```

### 4. Run

```bash
npm run dev
```

Visit:

- Frontend: http://localhost:3000
- Admin: http://localhost:3000/admin
  - Email: `admin@example.com`
  - Password: `admin123456` (matches `ADMIN_PASSWORD` in `.env`)

---

## 📁 Project structure

```
hot-news/
├── prisma/
│   ├── schema.prisma          # data models
│   └── seed.ts                # seed data
├── public/uploads/            # uploaded images
└── src/
    ├── app/
    │   ├── (public)/          # public pages (home/article/category/search/promotion-apply...)
    │   ├── admin/             # admin dashboard
    │   ├── api/               # API routes
    │   ├── sitemap.ts / robots.ts / rss.xml
    │   └── layout.tsx
    ├── components/
    │   ├── public/            # public components (Header/Footer/Hero/ArticleCard/AdSlot/CommentBox...)
    │   ├── admin/             # admin components (Sidebar/ArticleEditor...)
    │   └── animations/        # animation components (particles, Reveal)
    ├── lib/
    │   ├── prisma.ts          # Prisma singleton
    │   ├── auth.ts            # NextAuth config + requireAdmin
    │   ├── sanitize.ts        # DOMPurify whitelist
    │   ├── site.ts / utils.ts
    └── middleware.ts          # /admin route guard
```

---

## 🛠 Common scripts

```bash
npm run dev          # dev server
npm run build        # production build
npm run start        # start production server
npm run db:push      # sync schema (recommended for dev)
npm run db:migrate   # create migration (recommended for prod)
npm run db:studio    # Prisma visual studio
npm run db:seed      # re-seed
```

---

## 🎯 Highlights

### Let users publish styled HTML

Admin → "New article" → set content type to **"Raw HTML"** → paste HTML (inline `style`, animation classes, `iframe`, etc.). DOMPurify removes `<script>`, `onerror`, `javascript:` and other dangerous bits while keeping nearly all layout/style tags.

### Hook up Baidu Union / Google AdSense

1. Set `NEXT_PUBLIC_ADSENSE_CLIENT="ca-pub-xxx"` in `.env` — the AdSense script is loaded site-wide automatically.
2. In **Ad slots**, paste the `<ins class="adsbygoogle">…</ins>` snippet (or image + link) and enable.

### Hook up Baidu Tongji / Google Analytics

Set `NEXT_PUBLIC_BAIDU_ANALYTICS` / `NEXT_PUBLIC_GOOGLE_ANALYTICS` in `.env`.

### Submit sitemap

After deploy, visit `https://your-domain/sitemap.xml` and submit it to Baidu Search Console / Google Search Console.

---

## 🚢 Deploy

- **Vercel**: easiest, free tier; recommended databases: [Neon](https://neon.tech) / [Supabase](https://supabase.com) / [Vercel Postgres](https://vercel.com/storage/postgres) (Alibaba/Tencent Cloud RDS for PostgreSQL also works)
- **Self-hosted VPS**: `pm2 start "npm run start"`; Nginx reverse proxy + HTTPS; PostgreSQL on the same box
- **Docker**: write a Dockerfile (Next standalone + Prisma binary)

⚠️ Before going live:
1. Change the default `ADMIN_PASSWORD`
2. Regenerate `NEXTAUTH_SECRET`
3. (China hosting) Complete ICP + public-security filing and put it in **Settings**
4. Review ad slots / sponsored articles for legal compliance

---

## 📜 License

MIT
