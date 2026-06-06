import { auth } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/api-response'
import { GeneratePromptSchema } from '@/schemas/journal.schema'
import { JournalService } from '@/services/journal/journal.service'
import type { ExamType } from '@/types/database'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return apiError('Unauthorized', 401)
  }

  const body: unknown = await request.json().catch(() => ({}))
  const result = GeneratePromptSchema.safeParse(body)

  if (!result.success) {
    return apiError('Validation failed', 400, result.error.flatten())
  }

  const promptResult = await JournalService.generatePrompt({
    moodScore: result.data.moodScore,
    examType: (result.data.examType ?? session.user.examType) as ExamType,
  })

  if (!promptResult.success) {
    return apiError(promptResult.error, 500)
  }

  return apiSuccess(promptResult.data)
}
