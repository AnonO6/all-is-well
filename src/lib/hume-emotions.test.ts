import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { computeStressSignal, extractProsodyScores } from './hume-emotions'

describe('computeStressSignal', () => {
  it('returns higher stress when negative emotions dominate', () => {
    const stress = computeStressSignal({
      Anxiety: 0.9,
      Stress: 0.8,
      Joy: 0.1,
    })
    assert.ok(stress >= 7)
  })

  it('returns lower stress when positive emotions dominate', () => {
    const stress = computeStressSignal({
      Joy: 0.9,
      Calmness: 0.8,
      Anxiety: 0.05,
    })
    assert.ok(stress <= 4)
  })

  it('always returns a value between 1 and 10', () => {
    const stress = computeStressSignal({})
    assert.ok(stress >= 1 && stress <= 10)
  })
})

describe('extractProsodyScores', () => {
  it('extracts numeric prosody scores from Hume messages', () => {
    const scores = extractProsodyScores({
      type: 'user_message',
      models: {
        prosody: {
          scores: { Joy: 0.7, Sadness: 0.2, Surprise: 'invalid' },
        },
      },
    })

    assert.deepEqual(scores, { Joy: 0.7, Sadness: 0.2 })
  })

  it('returns null when prosody is missing', () => {
    assert.equal(extractProsodyScores({ type: 'user_message' }), null)
    assert.equal(extractProsodyScores(null), null)
  })
})
