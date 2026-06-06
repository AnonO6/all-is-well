import { fetchAccessToken } from 'hume'
import { auth } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/api-response'
import { env } from '@/lib/env'
import { rateLimit } from '@/lib/rate-limit'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return apiError('Unauthorized', 401)
  }

  const limited = rateLimit(`hume-token:${session.user.id}`, 10, 60 * 60 * 1000)
  if (limited) return limited

  if (!env.HUME_API_KEY || !env.HUME_SECRET_KEY) {
    return apiError(
      'Voice mentor is not configured yet. Add HUME_API_KEY and HUME_SECRET_KEY to .env',
      503,
    )
  }

  const accessToken = await fetchAccessToken({
    apiKey: env.HUME_API_KEY,
    secretKey: env.HUME_SECRET_KEY,
  })

  return apiSuccess({ accessToken })
}
