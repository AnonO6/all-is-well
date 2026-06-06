import { fetchAccessToken } from 'hume'
import { auth } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/api-response'
import { env } from '@/lib/env'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return apiError('Unauthorized', 401)
  }

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
