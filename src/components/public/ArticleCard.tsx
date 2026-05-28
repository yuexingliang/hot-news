'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, Clock, Sparkles } from 'lucide-react';
import { formatDate } from '@/lib/utils';

type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  cover: string | null;
  publishedAt: Date | string | null;
  views: number;
  isPromotion: boolean;
  isFeatured?: boolean;
  category?: { name: string; slug: string } | null;
  author?: { name: string | null; avatar: string | null } | null;
};

export default function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className={`group relative glass overflow-hidden lift ${featured ? 'md:col-span-2 md:row-span-2' : ''}`}
    >
      <Link href={`/article/${article.slug}`} className="block h-full">
        <div className={`relative ${featured ? 'aspect-[16/9]' : 'aspect-[16/10]'} overflow-hidden`}>
          {article.cover ? (
            <Image
              src={article.cover}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neon-purple/40 to-neon-cyan/40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          {article.isPromotion && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/90 text-slate-900 text-xs font-semibold">
              <Sparkles className="w-3 h-3" /> 推广
            </span>
          )}
          {article.category && (
            <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/40 backdrop-blur text-xs text-white border border-white/10">
              {article.category.name}
            </span>
          )}
        </div>
        <div className="p-5 space-y-3">
          <h3 className={`font-bold leading-snug group-hover:text-gradient transition-colors ${featured ? 'text-2xl' : 'text-lg'}`}>
            {article.title}
          </h3>
          {article.summary && <p className="text-sm text-slate-400 line-clamp-2">{article.summary}</p>}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.publishedAt ? formatDate(article.publishedAt) : '草稿'}</span>
            <span className="inline-flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {article.views}</span>
            {article.author?.name && <span className="ml-auto text-slate-400">{article.author.name}</span>}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
