import { describe, it, expect } from 'vitest'

describe('API smoke tests', () => {
  const BASE = 'http://localhost:3030'

  it('GET / returns 200', async () => {
    const res = await fetch(BASE + '/')
    expect(res.status).toBe(200)
  })

  it('GET /blueprints returns 200', async () => {
    const res = await fetch(BASE + '/blueprints')
    expect(res.status).toBe(200)
  })

  it('GET /auth returns login page', async () => {
    const res = await fetch(BASE + '/auth')
    expect(res.status).toBe(200)
  })

  it('GET /blog returns 200', async () => {
    const res = await fetch(BASE + '/blog')
    expect(res.status).toBe(200)
  })

  it('GET /glossary returns 200', async () => {
    const res = await fetch(BASE + '/glossary')
    expect(res.status).toBe(200)
  })
})
