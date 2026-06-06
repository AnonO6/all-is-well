import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { RegisterSchema } from './auth.schema'

describe('RegisterSchema', () => {
  it('accepts valid registration payloads', () => {
    const result = RegisterSchema.safeParse({
      name: 'Aviral',
      email: 'test@example.com',
      password: 'securepass1',
      examType: 'JEE',
    })
    assert.equal(result.success, true)
  })

  it('rejects weak passwords', () => {
    const short = RegisterSchema.safeParse({
      name: 'Aviral',
      email: 'test@example.com',
      password: 'abc',
    })
    const noNumber = RegisterSchema.safeParse({
      name: 'Aviral',
      email: 'test@example.com',
      password: 'passwordonly',
    })
    assert.equal(short.success, false)
    assert.equal(noNumber.success, false)
  })
})
