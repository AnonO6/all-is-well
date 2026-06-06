import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { UserRepository } from '@/repositories/user.repository'
import { RegisterSchema } from '@/schemas/auth.schema'
import { apiError, apiSuccess } from '@/lib/api-response'

export async function POST(request: Request) {
  const body: unknown = await request.json()
  const result = RegisterSchema.safeParse(body)

  if (!result.success) {
    return apiError('Validation failed', 400, result.error.flatten())
  }

  const existing = await UserRepository.findByEmail(result.data.email)
  if (existing) {
    return apiError('Email already registered', 409)
  }

  const passwordHash = await bcrypt.hash(result.data.password, 10)
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

  return apiSuccess({ id: user?.id, email: user?.email }, 201)
}
