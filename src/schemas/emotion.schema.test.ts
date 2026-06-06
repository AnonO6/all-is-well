import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { CreateEmotionSnapshotSchema } from './emotion.schema'

describe('CreateEmotionSnapshotSchema', () => {
  it('accepts Hume emotion score maps', () => {
    const result = CreateEmotionSnapshotSchema.safeParse({
      source: 'rancho',
      emotions: { Joy: 0.6, Anxiety: 0.2 },
    })

    assert.equal(result.success, true)
  })

  it('rejects out-of-range emotion values', () => {
    const result = CreateEmotionSnapshotSchema.safeParse({
      emotions: { Joy: 1.5 },
    })

    assert.equal(result.success, false)
  })

  it('defaults source to rancho', () => {
    const result = CreateEmotionSnapshotSchema.safeParse({
      emotions: { Calmness: 0.4 },
    })

    assert.equal(result.success, true)
    if (result.success) {
      assert.equal(result.data.source, 'rancho')
    }
  })
})
