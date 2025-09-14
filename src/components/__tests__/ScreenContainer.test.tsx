import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScreenContainer } from '../ScreenContainer'

// Mock window dimensions for consistent test results
const mockWindowDimensions = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
}

describe('ScreenContainer', () => {
  beforeEach(() => {
    // Reset to default viewport size for tests
    mockWindowDimensions(1920, 1080)
  })

  it('renders with correct scaled game content dimensions', () => {
    render(
      <ScreenContainer>
        <div>Test content</div>
      </ScreenContainer>
    )
    
    const gameContent = screen.getByTestId('scaled-game-content')
    expect(gameContent).toHaveStyle({
      width: '540px',
      height: '960px'
    })
  })

  it('renders children content', () => {
    render(
      <ScreenContainer>
        <div>Child content here</div>
      </ScreenContainer>
    )
    
    expect(screen.getByText('Child content here')).toBeInTheDocument()
  })

  it('applies custom background color to game content', () => {
    render(
      <ScreenContainer backgroundColor="#2c5234">
        <div>Test content</div>
      </ScreenContainer>
    )
    
    const gameContent = screen.getByTestId('scaled-game-content')
    expect(gameContent).toHaveStyle({
      backgroundColor: '#2c5234'
    })
  })

  it('applies custom className to screen container', () => {
    render(
      <ScreenContainer className="custom-class">
        <div>Test content</div>
      </ScreenContainer>
    )
    
    const screenContainer = screen.getByTestId('scaled-game-content').parentElement
    expect(screenContainer).toHaveClass('screen-container', 'custom-class')
  })

  it('has full viewport styling properties', () => {
    render(
      <ScreenContainer>
        <div>Test content</div>
      </ScreenContainer>
    )
    
    const screenContainer = screen.getByTestId('scaled-game-content').parentElement
    expect(screenContainer).toHaveStyle({
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden'
    })
  })

  it('applies scaling transform to game content', () => {
    render(
      <ScreenContainer>
        <div>Test content</div>
      </ScreenContainer>
    )
    
    const gameContent = screen.getByTestId('scaled-game-content')
    const transformStyle = gameContent.style.transform
    expect(transformStyle).toMatch(/scale\(\d+\.?\d*\)/)
  })

  it('includes scaling data attributes', () => {
    render(
      <ScreenContainer>
        <div>Test content</div>
      </ScreenContainer>
    )
    
    const screenContainer = screen.getByTestId('scaled-game-content').parentElement
    expect(screenContainer).toHaveAttribute('data-scale')
    expect(screenContainer).toHaveAttribute('data-offset-x')
    expect(screenContainer).toHaveAttribute('data-offset-y')
  })

  it('accepts custom scaling options', () => {
    render(
      <ScreenContainer scalingOptions={{ strategy: 'fit-to-width', minScale: 1, maxScale: 3 }}>
        <div>Test content</div>
      </ScreenContainer>
    )
    
    const gameContent = screen.getByTestId('scaled-game-content')
    expect(gameContent).toBeInTheDocument()
  })
})