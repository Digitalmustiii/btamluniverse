// app/providers/SessionProviderWrapper.tsx
'use client'

import { ReactNode } from 'react'

// ✅ Active: Supabase setup — no need for NextAuth's SessionProvider
export function SessionProviderWrapper({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/* 
// 💤 Alternative: Uncomment this if using NextAuth instead of Supabase
import { SessionProvider } from 'next-auth/react'

export function SessionProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
}
*/
