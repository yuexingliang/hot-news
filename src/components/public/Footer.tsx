import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { site } from '@/lib/site';

export default async function Footer() {
  const [links, settings, cats] = await Promise.all([
    prisma.friendLink.findMany({ where: { enabled: true }, orderBy: { order: 'asc' } }).catch(() => []),
    prisma.setting.findMany().catch(() => []),
    prisma.category.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
  ]);
  const settingMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  return (
    <footer className="mt-20 border-t border-white/10 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-gradient font-bold text-lg mb-3">{settingMap.site_name || site.name}</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{settingMap.site_desc || site.description}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">分类导航</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            {cats.map((c) => (
              <li key={c.id}>
                <Link href={`/category/${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">合作 & 帮助</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link href="/promotion-apply" className="hover:text-white">投放推广</Link></li>
            <li><Link href="/about" className="hover:text-white">关于我们</Link></li>
            <li><Link href="/contact" className="hover:text-white">联系我们</Link></li>
            <li><Link href="/report" className="hover:text-white">投诉举报</Link></li>
            <li><Link href="/rss.xml" className="hover:text-white">RSS 订阅</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">友情链接</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            {links.map((l) => (
              <li key={l.id}>
                <a href={l.url} target="_blank" rel="nofollow noopener" className="hover:text-white">
                  {l.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-slate-500">
        {settingMap.copyright || `© ${new Date().getFullYear()} ${site.name}`}
        {settingMap.icp && (
          <a href="https://beian.miit.gov.cn/" target="_blank" className="ml-3 hover:text-slate-300" rel="nofollow noopener">
            {settingMap.icp}
          </a>
        )}
      </div>
    </footer>
  );
}
