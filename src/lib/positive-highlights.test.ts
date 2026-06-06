import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { parsePositiveHighlights } from './positive-highlights'

describe('parsePositiveHighlights', () => {
  it('parses stored JSON arrays', () => {
    assert.deepEqual(
      parsePositiveHighlights('["study_win","good_sleep"]'),
      ['study_win', 'good_sleep'],
    )
  })

  it('returns an empty array for invalid values', () => {
    assert.deepEqual(parsePositiveHighlights(null), [])
    assert.deepEqual(parsePositiveHighlights('not-json'), [])
    assert.deepEqual(parsePositiveHighlights('{"bad":"shape"}'), [])
  })
})
