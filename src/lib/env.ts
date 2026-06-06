import { z } from 'zod'

const EnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  OPENAI_API_KEY_ONE: z.string().min(1),
  OPENAI_MODEL: z.string().min(1).default('gpt-5-mini'),
  UNSPLASH_API_KEY: z.string().min(1),
  YOUTUBE_API_KEY_ONE: z.string().min(1),
  YOUTUBE_API_KEY_TWO: z.string().optional(),
  YOUTUBE_API_KEY_THREE: z.string().optional(),
  HUME_API_KEY: z.string().optional(),
  HUME_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_HUME_CONFIG_ID: z.string().optional(),
})

export const env = EnvSchema.parse(process.env)
