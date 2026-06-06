import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { computeInternalStressLevel } from './mood-metrics'

describe('computeInternalStressLevel', () => {
  it('returns lower internal stress for high mood and energy', () => {
    assert.ok(computeInternalStressLevel(9, 8) < computeInternalStressLevel(3, 3))
  })

  it('clamps values between 1 and 10', () => {
    const value = computeInternalStressLevel(10, 10)
    assert.ok(value >= 1 && value <= 10)
  })
})
