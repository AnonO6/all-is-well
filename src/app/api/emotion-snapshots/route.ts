import { v4 as uuidv4 } from 'uuid'
import { auth } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/api-response'
import { CreateEmotionSnapshotSchema } from '@/schemas/emotion.schema'
import { computeStressSignal } from '@/lib/hume-emotions'
import { EmotionSnapshotRepository } from '@/repositories/emotion-snapshot.repository'
import { rateLimit } from '@/lib/rate-limit'
import { parseJsonBody } from '@/lib/request'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return apiError('Unauthorized', 401)
  }

  const limited = rateLimit(`emotion:${session.user.id}`, 60, 60 * 60 * 1000)
  if (limited) return limited

  const body = await parseJsonBody(request)
  if (body instanceof Response) return body

  const result = CreateEmotionSnapshotSchema.safeParse(body)
  if (!result.success) {
    return apiError('Validation failed', 400, result.error.flatten())
  }

  const stressSignal = computeStressSignal(result.data.emotions)

  await EmotionSnapshotRepository.create({
    id: uuidv4(),
    userId: session.user.id,
    source: result.data.source,
    emotions: result.data.emotions,
    stressSignal,
  })

  return apiSuccess({ stored: true }, 201)
}
