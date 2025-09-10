import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScoreDisplay from '../ScoreDisplay'

describe('ScoreDisplay', () => {
  it('displays the current score', () => {
    render(<ScoreDisplay score={42} gameOver={false} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('displays zero score', () => {
    render(<ScoreDisplay score={0} gameOver={false} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('displays high scores', () => {
    render(<ScoreDisplay score={12345} gameOver={false} />)
    expect(screen.getByText('12345')).toBeInTheDocument()
  })

  it('score has correct styling', () => {
    render(<ScoreDisplay score={8} gameOver={false} />)
    const scoreElement = screen.getByText('8')
    expect(scoreElement).toHaveStyle({
      fontSize: '48px'
    })
  })

  it('gameOver prop does not affect rendering', () => {
    render(<ScoreDisplay score={100} gameOver={true} />)
    expect(screen.getByText('100')).toBeInTheDocument()
  })
})