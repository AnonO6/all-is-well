type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; message?: string }

export async function apiClient<T>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(input, init)
    const payload = (await response.json()) as ApiResult<T>
    return payload
  } catch {
    return { success: false, message: 'Network error' }
  }
}
