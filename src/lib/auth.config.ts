import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import { authEnv } from '@/lib/env.auth'
import { resolveAuthRouting } from '@/lib/auth-routing'

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
      const decision = resolveAuthRouting(request.nextUrl.pathname, Boolean(auth))

      if (decision.type === 'api-unauthorized') {
        return Response.json(
          { success: false, message: 'Unauthorized' },
          { status: 401 },
        )
      }

      if (decision.type === 'login-required') return false

      if (decision.type === 'redirect') {
        return Response.redirect(
          new URL(decision.destination, request.nextUrl.origin),
        )
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
