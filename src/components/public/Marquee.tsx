import { TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function Marquee({ items }: { items: { title: string; slug: string }[] }) {
  if (!items.length) return null;
  const list = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-black/30 backdrop-blur">
      <div className="absolute left-0 top-0 bottom-0 z-10 px-4 flex items-center gap-2 bg-gradient-to-r from-slate-950 via-slate-950 to-transparent pr-8 text-sm font-semibold">
        <TrendingUp className="w-4 h-4 text-neon-cyan" /> 实时热点
      </div>
      <div className="flex animate-marquee whitespace-nowrap py-3 pl-40">
        {list.map((it, i) => (
          <Link key={i} href={`/article/${it.slug}`} className="mx-6 text-sm text-slate-300 hover:text-white">
            <span className="text-neon-pink mr-2">●</span>{it.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
