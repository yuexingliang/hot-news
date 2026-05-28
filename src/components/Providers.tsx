'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: 'rgba(15,23,42,.95)', color: '#fff', border: '1px solid rgba(255,255,255,.1)' },
        }}
      />
    </SessionProvider>
  );
}
