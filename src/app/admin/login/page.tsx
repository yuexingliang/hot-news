'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogIn, Flame } from 'lucide-react';
import toast from 'react-hot-toast';

function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const callbackUrl = sp.get('callbackUrl') || '/admin';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.ok) {
      toast.success('登录成功');
      router.push(callbackUrl);
    } else {
      toast.error('账号或密码错误');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={submit} className="glass-strong w-full max-w-md p-8 space-y-5 animate-glow">
        <div className="text-center mb-2">
          <div className="inline-flex w-14 h-14 mb-3 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-purple to-neon-cyan">
            <Flame className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold"><span className="text-gradient">HotNews 管理后台</span></h1>
          <p className="text-slate-400 text-sm mt-1">请使用管理员账号登录</p>
        </div>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="邮箱"
          className="w-full bg-white/5 rounded-lg px-4 py-3 border border-white/10 outline-none focus:border-brand-400"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="密码"
          className="w-full bg-white/5 rounded-lg px-4 py-3 border border-white/10 outline-none focus:border-brand-400"
        />
        <button disabled={loading} className="btn-neon w-full disabled:opacity-50">
          {loading ? '登录中...' : <>登录 <LogIn className="w-4 h-4" /></>}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
