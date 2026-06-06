import { describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'
import { apiClient } from './api-client'

describe('apiClient', () => {
  it('returns parsed API payloads', async () => {
    const originalFetch = globalThis.fetch
    globalThis.fetch = mock.fn(async () => ({
      json: async () => ({ success: true, data: { ok: true } }),
    })) as unknown as typeof fetch

    const result = await apiClient<{ ok: boolean }>('/api/check-ins')
    assert.deepEqual(result, { success: true, data: { ok: true } })

    globalThis.fetch = originalFetch
  })

  it('handles network failures gracefully', async () => {
    const originalFetch = globalThis.fetch
    globalThis.fetch = mock.fn(async () => {
      throw new Error('offline')
    }) as unknown as typeof fetch

    const result = await apiClient('/api/check-ins')
    assert.equal(result.success, false)

    globalThis.fetch = originalFetch
  })
})
