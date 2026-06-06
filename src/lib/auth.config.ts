import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import { authEnv } from '@/lib/env.auth'

export const authConfig = {
  providers: [
    Google({
      clientId: authEnv.GOOGLE_CLIENT_ID,
      clientSecret: authEnv.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl
      const publicPaths = ['/', '/login', '/register', '/api/auth', '/offline']
      const isPublic =
        pathname === '/' ||
        publicPaths.some((path) => path !== '/' && pathname.startsWith(path))

      if (!auth && !isPublic) {
        if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth')) {
          return Response.json(
            { success: false, message: 'Unauthorized' },
            { status: 401 },
          )
        }
        return false
      }
      if (auth && pathname === '/') {
        return Response.redirect(new URL('/dashboard', request.nextUrl.origin))
      }
      if (auth && (pathname === '/login' || pathname === '/register')) {
        return Response.redirect(new URL('/dashboard', request.nextUrl.origin))
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
