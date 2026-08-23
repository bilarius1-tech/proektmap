import { describe, it, expect } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'

describe('Smoke tests', () => {
  it('vitest works', () => {
    expect(1 + 1).toBe(2)
  })

  it('jsdom works', () => {
    expect(typeof window).toBe('object')
    expect(typeof document).toBe('object')
  })

  it('React rendering works', () => {
    const el = React.createElement('div', { 'data-testid': 'hello' }, 'Hello ProektMap')
    const { container } = render(el)
    expect(screen.getByTestId('hello')).toBeTruthy()
    expect(container.textContent).toBe('Hello ProektMap')
  })
})
