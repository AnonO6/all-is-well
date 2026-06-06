import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { pickApiKey } from './youtube-keys'

describe('pickApiKey', () => {
  it('returns null when no keys exist', () => {
    assert.equal(pickApiKey([], 'seed'), null)
  })

  it('returns a stable key for the same seed', () => {
    const keys = ['one', 'two', 'three']
    assert.equal(pickApiKey(keys, 'meditation:2026-06-06'), pickApiKey(keys, 'meditation:2026-06-06'))
  })
})
