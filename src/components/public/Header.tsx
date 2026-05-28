'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Search, Menu, X, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', label: '首页' },
  { href: '/category/tech', label: '科技' },
  { href: '/category/finance', label: '财经' },
  { href: '/category/entertainment', label: '娱乐' },
  { href: '/category/lifestyle', label: '生活' },
  { href: '/category/promotion', label: '推广合作' },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
          <span className="relative inline-flex w-9 h-9 items-center justify-center rounded-xl bg-gradient-to-br from-neon-purple to-neon-cyan animate-glow">
            <Flame className="w-5 h-5" />
          </span>
          <span className="text-gradient">HotNews</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative px-3 py-2 rounded-full text-sm transition',
                  active ? 'text-white' : 'text-slate-300 hover:text-white'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-white/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <form
          action="/search"
          className="hidden md:flex items-center gap-2 ml-auto bg-white/5 border border-white/10 rounded-full px-4 h-10 w-72 focus-within:border-brand-400 transition"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <input
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索热点 / 推广..."
            className="bg-transparent flex-1 text-sm outline-none placeholder:text-slate-500"
          />
        </form>
        <Link href="/promotion-apply" className="hidden md:inline-flex btn-neon !px-4 !py-2 text-sm">
          投放推广
        </Link>
        <button onClick={() => setOpen(!open)} className="lg:hidden ml-auto p-2 rounded-full bg-white/5">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-slate-950/95 backdrop-blur border-t border-white/10"
          >
            <div className="p-4 grid gap-2">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
                >
                  {item.label}
                </Link>
              ))}
              <form action="/search" className="flex items-center gap-2 bg-white/5 rounded-xl px-3 h-12">
                <Search className="w-4 h-4 text-slate-400" />
                <input name="q" placeholder="搜索..." className="flex-1 bg-transparent outline-none" />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
