import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { CreateMoodEntrySchema } from './mood.schema'

describe('CreateMoodEntrySchema', () => {
  it('accepts positive-only check-in payloads', () => {
    const result = CreateMoodEntrySchema.safeParse({
      moodScore: 7,
      energyLevel: 6,
      positiveHighlights: ['study_win', 'good_sleep'],
      note: 'Feeling okay',
    })

    assert.equal(result.success, true)
    if (result.success) {
      assert.deepEqual(result.data.positiveHighlights, ['study_win', 'good_sleep'])
    }
  })

  it('rejects legacy stress and trigger fields', () => {
    const result = CreateMoodEntrySchema.safeParse({
      moodScore: 7,
      energyLevel: 6,
      stressLevel: 4,
      triggers: ['exam_pressure'],
    })

    assert.equal(result.success, false)
  })

  it('defaults positiveHighlights to an empty array', () => {
    const result = CreateMoodEntrySchema.safeParse({
      moodScore: 5,
      energyLevel: 5,
    })

    assert.equal(result.success, true)
    if (result.success) {
      assert.deepEqual(result.data.positiveHighlights, [])
    }
  })

  it('rejects invalid mood scores', () => {
    const result = CreateMoodEntrySchema.safeParse({
      moodScore: 11,
      energyLevel: 5,
    })

    assert.equal(result.success, false)
  })
})
