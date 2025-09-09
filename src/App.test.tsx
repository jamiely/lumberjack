import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('should render the main heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Vite + TypeScript + React')
  })

  it('should render Vite and TypeScript logos', () => {
    render(<App />)
    expect(screen.getByAltText('Vite logo')).toBeInTheDocument()
    expect(screen.getByAltText('TypeScript logo')).toBeInTheDocument()
  })

  it('should render the counter component', () => {
    render(<App />)
    expect(screen.getByRole('button')).toHaveTextContent('count is 0')
  })

  it('should render the read-the-docs text', () => {
    render(<App />)
    expect(screen.getByText('Click on the Vite and TypeScript logos to learn more')).toBeInTheDocument()
  })
})