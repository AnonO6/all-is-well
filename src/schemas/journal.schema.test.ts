import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { CreateJournalEntrySchema, GeneratePromptSchema } from './journal.schema'

describe('CreateJournalEntrySchema', () => {
  it('accepts valid journal entries', () => {
    const result = CreateJournalEntrySchema.safeParse({
      prompt: 'How are you?',
      response: 'Doing okay today.',
      moodBefore: 5,
      moodAfter: 7,
    })
    assert.equal(result.success, true)
  })

  it('rejects empty responses', () => {
    const result = CreateJournalEntrySchema.safeParse({
      prompt: 'How are you?',
      response: '',
    })
    assert.equal(result.success, false)
  })
})

describe('GeneratePromptSchema', () => {
  it('accepts optional mood and exam type', () => {
    const result = GeneratePromptSchema.safeParse({ moodScore: 6, examType: 'JEE' })
    assert.equal(result.success, true)
  })
})
