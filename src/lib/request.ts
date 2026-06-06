import { apiError } from '@/lib/api-response'

const MAX_BODY_BYTES = 100_000

export async function parseJsonBody(request: Request): Promise<unknown | Response> {
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_BYTES) {
    return apiError('Request body too large', 413)
  }

  try {
    const text = await request.text()
    if (text.length > MAX_BODY_BYTES) {
      return apiError('Request body too large', 413)
    }
    if (!text) return {}
    return JSON.parse(text) as unknown
  } catch {
    return apiError('Invalid JSON body', 400)
  }
}
