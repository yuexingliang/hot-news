'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import ParticleBackground from '../animations/ParticleBackground';

export default function Hero() {
  return (
    <section className="relative pt-28 pb-20 overflow-hidden bg-grid">
      <div className="absolute inset-0">
        <ParticleBackground />
      </div>
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-neon-purple/30 rounded-full blur-[120px] animate-float" />
      <div className="absolute -top-24 -right-24 w-[400px] h-[400px] bg-neon-cyan/30 rounded-full blur-[120px] animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="relative max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6 text-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>实时推送 · 全网热点 · 精选推广</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="text-gradient">抢先一步</span>
          <br />
          <span className="text-white">发现热点的力量</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-lg text-slate-300 max-w-2xl mx-auto mb-10"
        >
          聚合全网最新资讯，提供精选品牌推广位。无论是阅读还是投放，HotNews 让信息更高效。
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <Link href="/category/tech" className="btn-neon">
            浏览热点 <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/promotion-apply" className="btn-ghost">
            投放推广合作
          </Link>
        </motion.div>

        {/* 数字滚动 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-16 grid grid-cols-3 max-w-2xl mx-auto gap-4"
        >
          {[
            { n: '10万+', l: '日活读者' },
            { n: '500+', l: '合作品牌' },
            { n: '24h', l: '热点更新' },
          ].map((s) => (
            <div key={s.l} className="glass py-5 text-center">
              <div className="text-2xl md:text-3xl font-bold text-gradient">{s.n}</div>
              <div className="text-xs text-slate-400 mt-1">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
