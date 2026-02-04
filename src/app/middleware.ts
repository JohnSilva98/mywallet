import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /login (página de login)
     * - /register (página de registro)
     * - /api/auth (rotas do NextAuth)
     * - /_next (arquivos do Next.js)
     * - /favicon.ico, etc.
     */
    '/((?!login|register|api/auth|_next/static|_next/image|favicon.ico).*)',
  ]
}