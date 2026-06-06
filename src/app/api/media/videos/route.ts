import { auth } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/api-response'
import { searchWellnessVideos } from '@/lib/youtube'
import { rateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

const QuerySchema = z.object({
  category: z.enum(['meditation', 'music']).default('meditation'),
})

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return apiError('Unauthorized', 401)
  }

  const limited = rateLimit(`media-video:${session.user.id}`, 60, 60 * 60 * 1000)
  if (limited) return limited

  const { searchParams } = new URL(request.url)
  const result = QuerySchema.safeParse({
    category: searchParams.get('category') ?? 'meditation',
  })

  if (!result.success) {
    return apiError('Validation failed', 400, result.error.flatten())
  }

  const videos = await searchWellnessVideos(result.data.category)
  return apiSuccess(videos)
}
