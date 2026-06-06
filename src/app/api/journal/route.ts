import { auth } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/api-response'
import { CreateJournalEntrySchema } from '@/schemas/journal.schema'
import { JournalService } from '@/services/journal/journal.service'
import { JournalEntryRepository } from '@/repositories/journal-entry.repository'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return apiError('Unauthorized', 401)
  }

  const body: unknown = await request.json()
  const result = CreateJournalEntrySchema.safeParse(body)

  if (!result.success) {
    return apiError('Validation failed', 400, result.error.flatten())
  }

  const entry = await JournalService.createEntry(session.user.id, result.data)
  return apiSuccess(entry.data, 201)
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return apiError('Unauthorized', 401)
  }

  const entries = await JournalEntryRepository.listByUser(session.user.id)
  return apiSuccess(entries)
}
