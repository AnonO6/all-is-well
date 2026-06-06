import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { computeCheckInStreak } from './streak'

describe('computeCheckInStreak', () => {
  it('returns zero when there are no entries', () => {
    assert.equal(computeCheckInStreak([]), 0)
  })

  it('counts consecutive days including today', () => {
    const today = new Date('2026-06-06T12:00:00Z')
    const streak = computeCheckInStreak(
      [
        new Date('2026-06-06T08:00:00Z'),
        new Date('2026-06-05T08:00:00Z'),
        new Date('2026-06-04T08:00:00Z'),
      ],
      today,
    )
    assert.equal(streak, 3)
  })

  it('allows streak to start yesterday if today is missing', () => {
    const today = new Date('2026-06-06T12:00:00Z')
    const streak = computeCheckInStreak(
      [new Date('2026-06-05T08:00:00Z'), new Date('2026-06-04T08:00:00Z')],
      today,
    )
    assert.equal(streak, 2)
  })
})
