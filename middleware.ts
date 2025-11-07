// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies: reqCookies } = req

  // Only redirect ?code=... if we're NOT already on /auth/callback
  const code = nextUrl.searchParams.get('code')
  if (code && nextUrl.pathname !== '/auth/callback') {
    const next = nextUrl.searchParams.get('next') ?? '/dashboard'
    const url = new URL(
      `/auth/callback?code=${encodeURIComponent(code)}&next=${encodeURIComponent(next)}`,
      nextUrl.origin
    )
    return NextResponse.redirect(url)
  }

  // Touch the session so sb-* cookies can refresh
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => reqCookies.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          res.cookies.set(name, value, options)
        },
        remove: (name: string, options: any) => {
          res.cookies.set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  )

  try {
    await supabase.auth.getUser()
  } catch {
    // ignore
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|service-worker\\.js).*)'],
}
