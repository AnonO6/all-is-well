import OpenAI from 'openai'
import { env } from '@/lib/env'

export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY_ONE,
})

export const OPENAI_MODEL = env.OPENAI_MODEL
