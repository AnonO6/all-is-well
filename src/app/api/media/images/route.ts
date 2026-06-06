import { auth } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/api-response'
import { fetchWellnessImage } from '@/lib/unsplash'
import { rateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

const QuerySchema = z.object({
  moodScore: z.coerce.number().int().min(1).max(10).optional(),
})

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return apiError('Unauthorized', 401)
  }

  const limited = rateLimit(`media-image:${session.user.id}`, 60, 60 * 60 * 1000)
  if (limited) return limited

  const { searchParams } = new URL(request.url)
  const result = QuerySchema.safeParse({
    moodScore: searchParams.get('moodScore') ?? undefined,
  })

  if (!result.success) {
    return apiError('Validation failed', 400, result.error.flatten())
  }

  const image = await fetchWellnessImage(result.data.moodScore)
  return apiSuccess(image)
}
