import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { UserRepository } from '@/repositories/user.repository'
import { RegisterSchema } from '@/schemas/auth.schema'
import { apiError, apiSuccess } from '@/lib/api-response'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import { parseJsonBody } from '@/lib/request'

export async function POST(request: Request) {
  const limited = rateLimit(`register:${getClientIp(request)}`, 5, 60 * 60 * 1000)
  if (limited) return limited

  const body = await parseJsonBody(request)
  if (body instanceof Response) return body

  const result = RegisterSchema.safeParse(body)
  if (!result.success) {
    return apiError('Validation failed', 400, result.error.flatten())
  }

  const existing = await UserRepository.findByEmail(result.data.email)
  if (existing) {
    return apiSuccess({ registered: true }, 201)
  }

  const passwordHash = await bcrypt.hash(result.data.password, 12)
  const user = await UserRepository.insert({
    id: uuidv4(),
    name: result.data.name,
    email: result.data.email,
    password_hash: passwordHash,
    exam_type: result.data.examType,
    image: null,
    created_at: new Date(),
    updated_at: new Date(),
  })

  return apiSuccess({ id: user?.id, registered: true }, 201)
}
