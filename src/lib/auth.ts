import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { authConfig } from '@/lib/auth.config'
import { UserRepository } from '@/repositories/user.repository'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await UserRepository.findByEmail(credentials.email as string)
        if (!user?.password_hash) return null

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password_hash,
        )
        if (!valid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        await UserRepository.upsertFromOAuth({
          id: user.id ?? uuidv4(),
          name: user.name ?? 'Student',
          email: user.email,
          image: user.image,
        })
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user?.email) {
        const dbUser = await UserRepository.findByEmail(user.email)
        if (dbUser) {
          token.userId = dbUser.id
          token.examType = dbUser.exam_type
        } else if (account?.provider === 'google') {
          const newUser = await UserRepository.upsertFromOAuth({
            id: uuidv4(),
            name: user.name ?? 'Student',
            email: user.email,
            image: user.image,
          })
          if (newUser) {
            token.userId = newUser.id
            token.examType = newUser.exam_type
          }
        }
      }
      return token
    },
  },
})
