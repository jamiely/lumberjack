import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('should render the main heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Timberman Game')
  })

  it('should render the initial score', () => {
    render(<App />)
    expect(screen.getByText('Score: 0')).toBeInTheDocument()
  })

  it('should render instructions', () => {
    render(<App />)
    expect(screen.getByText(/Use left\/right arrows to chop and switch sides/)).toBeInTheDocument()
  })

  it('should render the game board', () => {
    render(<App />)
    // Check for game board container by style attributes
    const gameBoard = document.querySelector('[style*="width: 400px"]')
    expect(gameBoard).toBeInTheDocument()
  })
})