'use client';

import { useEffect, useRef } from 'react';

export default function AdSlotClient({
  code,
  html,
  imageUrl,
  linkUrl,
  className = '',
}: {
  code: string;
  html: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reported = useRef(false);

  useEffect(() => {
    if (!ref.current || reported.current) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !reported.current) {
          reported.current = true;
          fetch(`/api/ads/${code}/track`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ type: 'impression' }),
            keepalive: true,
          }).catch(() => null);
          io.disconnect();
        }
      }
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [code]);

  const onClick = () => {
    fetch(`/api/ads/${code}/track`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'click' }),
      keepalive: true,
    }).catch(() => null);
  };

  return (
    <div ref={ref} className={`relative my-6 ${className}`}>
      <span className="absolute -top-2 right-2 z-10 text-[10px] px-2 py-0.5 rounded bg-amber-500/90 text-slate-900 font-semibold">广告</span>
      {html ? (
        <div className="user-html glass p-4 overflow-hidden" onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />
      ) : imageUrl ? (
        <a href={linkUrl || '#'} target="_blank" rel="nofollow sponsored noopener" onClick={onClick} className="block overflow-hidden rounded-2xl shine relative">
          <img src={imageUrl} alt="广告" className="w-full h-auto" />
        </a>
      ) : null}
    </div>
  );
}
