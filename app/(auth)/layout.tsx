// app/(auth)/layout.tsx
import { ReactNode } from 'react'
import '../globals.css'

export const metadata = {
  title: 'BTAML Universe - Authentication',
  description: 'Login or Sign up to BTAML Universe - Africa\'s Premier Business Portal',
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-layout antialiased">
      {children}
    </div>
  )
}
