import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center">
      <div className="space-y-4">
        <div className="text-9xl font-black text-gradient">404</div>
        <h1 className="text-2xl font-bold">页面飞走啦</h1>
        <p className="text-slate-400">你访问的页面可能不存在或已被移除</p>
        <Link href="/" className="btn-neon">回到首页</Link>
      </div>
    </div>
  );
}
