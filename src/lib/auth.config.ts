import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import { env } from '@/lib/env'

export const authConfig = {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl
      const publicPaths = ['/login', '/register', '/api/auth', '/offline']
      const isPublic = publicPaths.some((path) => pathname.startsWith(path))

      if (!auth && !isPublic) return false
      if (auth && (pathname === '/login' || pathname === '/register')) {
        return Response.redirect(new URL('/', request.nextUrl.origin))
      }
      return true
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string
        session.user.examType = token.examType as typeof session.user.examType
      }
      return session
    },
  },
  trustHost: true,
} satisfies NextAuthConfig
