'use client';

import Sidebar from '@/components/admin/Sidebar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/admin/login') return <>{children}</>;
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen p-8">{children}</div>
    </div>
  );
}
