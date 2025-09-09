import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScoreDisplay from '../ScoreDisplay'

describe('ScoreDisplay', () => {
  it('displays the current score', () => {
    render(<ScoreDisplay score={42} gameOver={false} />)
    expect(screen.getByText('Score: 42')).toBeInTheDocument()
  })

  it('displays game instructions', () => {
    render(<ScoreDisplay score={0} gameOver={false} />)
    expect(screen.getByText(/Use left\/right arrows to chop and switch sides/)).toBeInTheDocument()
    expect(screen.getByText(/Press '\?' to toggle debug info/)).toBeInTheDocument()
  })

  it('does not show game over message when game is not over', () => {
    render(<ScoreDisplay score={10} gameOver={false} />)
    expect(screen.queryByText(/GAME OVER/)).not.toBeInTheDocument()
  })

  it('shows game over message when game is over', () => {
    render(<ScoreDisplay score={15} gameOver={true} />)
    expect(screen.getByText(/GAME OVER! Hit a branch. Press 'R' to restart./)).toBeInTheDocument()
  })

  it('game over message has correct styling', () => {
    render(<ScoreDisplay score={5} gameOver={true} />)
    const gameOverElement = screen.getByText(/GAME OVER/)
    expect(gameOverElement).toHaveStyle({
      fontSize: '16px',
      color: 'rgb(255, 0, 0)'
    })
  })

  it('score has correct styling', () => {
    render(<ScoreDisplay score={8} gameOver={false} />)
    const scoreElement = screen.getByText('Score: 8')
    expect(scoreElement).toHaveStyle({
      fontSize: '18px'
    })
  })

  it('instructions have correct styling', () => {
    render(<ScoreDisplay score={0} gameOver={false} />)
    const instructionsElement = screen.getByText(/Use left\/right arrows/)
    expect(instructionsElement).toHaveStyle({
      fontSize: '14px',
      color: 'rgb(102, 102, 102)'
    })
  })
})