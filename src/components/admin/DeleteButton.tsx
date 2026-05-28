'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function DeleteButton({ url, confirmText = '确认删除？' }: { url: string; confirmText?: string }) {
  const router = useRouter();
  const onClick = async () => {
    if (!confirm(confirmText)) return;
    const res = await fetch(url, { method: 'DELETE' });
    if (res.ok) {
      toast.success('已删除');
      router.refresh();
    } else {
      toast.error('删除失败');
    }
  };
  return (
    <button onClick={onClick} className="p-2 rounded hover:bg-white/10 text-rose-400">
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
