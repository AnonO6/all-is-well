import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { rateLimit, resetRateLimits } from './rate-limit'

describe('rateLimit', () => {
  it('allows requests under the limit', () => {
    resetRateLimits()
    assert.equal(rateLimit('test-ip', 3, 60_000), null)
    assert.equal(rateLimit('test-ip', 3, 60_000), null)
  })

  it('blocks requests over the limit', () => {
    resetRateLimits()
    rateLimit('blocked-ip', 2, 60_000)
    rateLimit('blocked-ip', 2, 60_000)
    const blocked = rateLimit('blocked-ip', 2, 60_000)
    assert.notEqual(blocked, null)
    assert.equal(blocked?.status, 429)
  })
})
