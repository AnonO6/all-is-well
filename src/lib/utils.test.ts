import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { formatDate, getMoodEmoji, getMoodLabel } from './utils'

describe('mood helpers', () => {
  it('maps mood scores to labels', () => {
    assert.equal(getMoodLabel(2), 'Struggling')
    assert.equal(getMoodLabel(5), 'Okay')
    assert.equal(getMoodLabel(9), 'Great')
  })

  it('maps mood scores to emojis', () => {
    assert.equal(getMoodEmoji(1), '😔')
    assert.equal(getMoodEmoji(10), '😊')
  })
})

describe('formatDate', () => {
  it('formats dates for Indian locale', () => {
    const formatted = formatDate('2026-06-06')
    assert.match(formatted, /6/)
    assert.match(formatted, /2026/)
  })
})
