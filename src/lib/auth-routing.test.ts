import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { isPublicPath, resolveAuthRouting } from './auth-routing'

describe('isPublicPath', () => {
  it('treats landing and auth pages as public', () => {
    assert.equal(isPublicPath('/'), true)
    assert.equal(isPublicPath('/login'), true)
    assert.equal(isPublicPath('/register'), true)
  })

  it('treats protected app routes as private', () => {
    assert.equal(isPublicPath('/dashboard'), false)
    assert.equal(isPublicPath('/check-in'), false)
  })
})

describe('resolveAuthRouting', () => {
  it('requires login for protected pages', () => {
    assert.deepEqual(resolveAuthRouting('/dashboard', false), {
      type: 'login-required',
    })
  })

  it('returns api unauthorized for protected APIs', () => {
    assert.deepEqual(resolveAuthRouting('/api/check-ins', false), {
      type: 'api-unauthorized',
    })
  })

  it('redirects authenticated users away from login', () => {
    assert.deepEqual(resolveAuthRouting('/login', true), {
      type: 'redirect',
      destination: '/dashboard',
    })
  })

  it('allows authenticated app access', () => {
    assert.deepEqual(resolveAuthRouting('/journal', true), { type: 'allow' })
  })
})
