import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { safeCallbackUrl } from './safe-url'

describe('safeCallbackUrl', () => {
  it('returns default for missing values', () => {
    assert.equal(safeCallbackUrl(null), '/dashboard')
    assert.equal(safeCallbackUrl(undefined), '/dashboard')
  })

  it('allows same-origin relative paths', () => {
    assert.equal(safeCallbackUrl('/check-in'), '/check-in')
    assert.equal(safeCallbackUrl('/dashboard'), '/dashboard')
  })

  it('blocks open redirects', () => {
    assert.equal(safeCallbackUrl('https://evil.com'), '/dashboard')
    assert.equal(safeCallbackUrl('//evil.com'), '/dashboard')
    assert.equal(safeCallbackUrl('/\\evil.com'), '/dashboard')
    assert.equal(safeCallbackUrl('http://evil.com/phish'), '/dashboard')
  })
})
