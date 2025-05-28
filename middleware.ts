// middleware.ts
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl

  // only protect /admin and deeper
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })
    if (!token) {
      // redirect straight to your sign-in page, outside of /admin
      const url = new URL('/signin', origin)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
