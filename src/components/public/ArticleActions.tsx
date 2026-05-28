'use client';

import { useEffect, useState } from 'react';
import { Heart, Share2, Flag, Eye, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ArticleActions({
  articleId,
  initialLikes,
  views,
  readingMinutes,
  url,
  title,
}: {
  articleId: string;
  initialLikes: number;
  views: number;
  readingMinutes: number;
  url: string;
  title: string;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // 阅读量 +1
    fetch(`/api/articles/${articleId}/view`, { method: 'POST', keepalive: true }).catch(() => null);
    setLiked(localStorage.getItem(`liked:${articleId}`) === '1');
  }, [articleId]);

  const handleLike = async () => {
    if (liked) return toast('已点过赞啦', { icon: '💜' });
    setLiked(true);
    setLikes((x) => x + 1);
    localStorage.setItem(`liked:${articleId}`, '1');
    fetch(`/api/articles/${articleId}/like`, { method: 'POST' }).catch(() => null);
    toast.success('感谢点赞！');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
    } else {
      navigator.clipboard.writeText(url);
      toast.success('链接已复制');
    }
  };

  const handleReport = async () => {
    const reason = prompt('举报理由（必填）');
    if (!reason) return;
    await fetch('/api/reports', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'article', targetId: articleId, reason }),
    });
    toast.success('举报已提交');
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-white/10 text-sm text-slate-400">
      <span className="inline-flex items-center gap-1"><Eye className="w-4 h-4" /> {views} 阅读</span>
      <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4" /> {readingMinutes} 分钟</span>
      <button
        onClick={handleLike}
        className={`ml-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-full border transition ${
          liked ? 'border-neon-pink text-neon-pink bg-neon-pink/10' : 'border-white/15 hover:bg-white/5'
        }`}
      >
        <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} /> {likes}
      </button>
      <button onClick={handleShare} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/15 hover:bg-white/5">
        <Share2 className="w-4 h-4" /> 分享
      </button>
      <button onClick={handleReport} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/15 hover:bg-white/5">
        <Flag className="w-4 h-4" /> 举报
      </button>
    </div>
  );
}
