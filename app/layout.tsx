// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'
import { SessionProviderWrapper } from './providers/SessionProviderWrapper'

export const metadata = {
  title: 'BTAML Universe',
  description: "Africa's Legal, Business, and Investment Portal",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
