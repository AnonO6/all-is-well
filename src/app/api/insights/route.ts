import { auth } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/api-response'
import { AiInsightsService } from '@/services/ai-insights/ai-insights.service'
import { z } from 'zod'

const QuerySchema = z.object({
  days: z.coerce.number().pipe(z.union([z.literal(7), z.literal(30)])).default(7),
})

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return apiError('Unauthorized', 401)
  }

  const { searchParams } = new URL(request.url)
  const result = QuerySchema.safeParse({ days: searchParams.get('days') ?? 7 })

  if (!result.success) {
    return apiError('Validation failed', 400, result.error.flatten())
  }

  try {
    const insights = await AiInsightsService.getInsights(
      session.user.id,
      result.data.days,
    )
    return apiSuccess(insights)
  } catch {
    return apiError('Failed to load insights', 500)
  }
}
