import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Counter } from './Counter'

describe('Counter', () => {
  it('should initialize with default count of 0', () => {
    render(<Counter />)
    expect(screen.getByRole('button')).toHaveTextContent('count is 0')
  })

  it('should initialize with provided initial count', () => {
    render(<Counter initialCount={5} />)
    expect(screen.getByRole('button')).toHaveTextContent('count is 5')
  })

  it('should increment count when clicked', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('count is 0')
    
    await user.click(button)
    expect(button).toHaveTextContent('count is 1')
    
    await user.click(button)
    expect(button).toHaveTextContent('count is 2')
  })

  it('should handle multiple clicks correctly', async () => {
    const user = userEvent.setup()
    render(<Counter initialCount={10} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('count is 10')
    
    for (let i = 11; i <= 15; i++) {
      await user.click(button)
      expect(button).toHaveTextContent(`count is ${i}`)
    }
  })
})