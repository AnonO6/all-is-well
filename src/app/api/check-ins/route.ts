import { auth } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/api-response'
import { CreateMoodEntrySchema } from '@/schemas/mood.schema'
import { MoodService } from '@/services/mood/mood.service'
import { MoodEntryRepository } from '@/repositories/mood-entry.repository'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return apiError('Unauthorized', 401)
  }

  const body: unknown = await request.json()
  const result = CreateMoodEntrySchema.safeParse(body)

  if (!result.success) {
    return apiError('Validation failed', 400, result.error.flatten())
  }

  const entry = await MoodService.createEntry(session.user.id, result.data)
  return apiSuccess(entry.data, 201)
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return apiError('Unauthorized', 401)
  }

  const stats = await MoodService.getDashboardStats(session.user.id)
  const recent = await MoodEntryRepository.listByUser(session.user.id, 10)

  return apiSuccess({ ...stats, recent })
}
