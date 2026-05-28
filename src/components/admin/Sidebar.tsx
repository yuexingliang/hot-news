'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, FileText, FolderTree, Tags, MessageSquare,
  Megaphone, Link as LinkIcon, Settings, ShoppingCart, Flag, LogOut, Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin', label: '概览', icon: LayoutDashboard },
  { href: '/admin/articles', label: '文章管理', icon: FileText },
  { href: '/admin/categories', label: '分类', icon: FolderTree },
  { href: '/admin/tags', label: '标签', icon: Tags },
  { href: '/admin/comments', label: '评论审核', icon: MessageSquare },
  { href: '/admin/ads', label: '广告位', icon: Megaphone },
  { href: '/admin/orders', label: '软文订单', icon: ShoppingCart },
  { href: '/admin/links', label: '友情链接', icon: LinkIcon },
  { href: '/admin/reports', label: '举报', icon: Flag },
  { href: '/admin/settings', label: '站点设置', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 shrink-0 border-r border-white/10 bg-slate-950/60 backdrop-blur min-h-screen p-4 flex flex-col">
      <Link href="/admin" className="text-xl font-bold mb-8 px-2 text-gradient">HotNews CMS</Link>
      <nav className="space-y-1 flex-1">
        {NAV.map((it) => {
          const Icon = it.icon;
          const active = pathname === it.href || (it.href !== '/admin' && pathname.startsWith(it.href));
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition',
                active ? 'bg-gradient-to-r from-neon-purple/30 to-neon-cyan/20 text-white' : 'text-slate-300 hover:bg-white/5'
              )}
            >
              <Icon className="w-4 h-4" /> {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 pt-4 border-t border-white/10">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/5">
          <Home className="w-4 h-4" /> 返回前台
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/5"
        >
          <LogOut className="w-4 h-4" /> 退出
        </button>
      </div>
    </aside>
  );
}
