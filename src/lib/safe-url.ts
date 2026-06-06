const DEFAULT_CALLBACK = '/dashboard'

export function safeCallbackUrl(raw: string | null | undefined): string {
  if (!raw) return DEFAULT_CALLBACK
  if (!raw.startsWith('/') || raw.startsWith('//')) return DEFAULT_CALLBACK
  if (raw.includes('://') || raw.includes('\\')) return DEFAULT_CALLBACK
  return raw
}
