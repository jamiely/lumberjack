import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import GameOverScreen from '../GameOverScreen'

describe('GameOverScreen', () => {
  const defaultProps = {
    finalScore: 100,
    highScore: 200,
    isNewHighScore: false,
    finalGameState: null,
    characterType: null,
    onRestart: vi.fn(),
    onReturnToAttract: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls onRestart when a key is pressed', () => {
    render(<GameOverScreen {...defaultProps} />)
    
    fireEvent.keyDown(window, { key: 'Enter' })
    
    expect(defaultProps.onRestart).toHaveBeenCalledTimes(1)
  })

  it('calls onRestart when clicked anywhere', () => {
    render(<GameOverScreen {...defaultProps} />)
    
    fireEvent.click(window)
    
    expect(defaultProps.onRestart).toHaveBeenCalledTimes(1)
  })

  it('calls onRestart for both keyboard and mouse events', () => {
    render(<GameOverScreen {...defaultProps} />)
    
    fireEvent.keyDown(window, { key: 'Space' })
    fireEvent.click(window)
    
    expect(defaultProps.onRestart).toHaveBeenCalledTimes(2)
  })

  it('displays the correct final score', () => {
    const { getByText } = render(<GameOverScreen {...defaultProps} />)
    
    expect(getByText('YOUR SCORE: 100')).toBeInTheDocument()
  })

  it('displays the correct high score', () => {
    const { getByText } = render(<GameOverScreen {...defaultProps} />)
    
    expect(getByText('HIGH SCORE: 200')).toBeInTheDocument()
  })

  it('displays new high score message when isNewHighScore is true', () => {
    const { getByText } = render(
      <GameOverScreen {...defaultProps} isNewHighScore={true} />
    )
    
    expect(getByText('★ NEW HIGH SCORE! ★')).toBeInTheDocument()
  })

  it('does not display new high score message when isNewHighScore is false', () => {
    const { queryByText } = render(<GameOverScreen {...defaultProps} />)
    
    expect(queryByText('★ NEW HIGH SCORE! ★')).not.toBeInTheDocument()
  })
})