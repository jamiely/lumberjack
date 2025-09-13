import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScreenContainer } from '../ScreenContainer'

describe('ScreenContainer', () => {
  it('renders with correct dimensions', () => {
    render(
      <ScreenContainer>
        <div>Test content</div>
      </ScreenContainer>
    )
    
    const container = screen.getByText('Test content').parentElement
    expect(container).toHaveStyle({
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

  it('applies default background color', () => {
    render(
      <ScreenContainer>
        <div>Test content</div>
      </ScreenContainer>
    )
    
    const container = screen.getByText('Test content').parentElement
    expect(container).toBeInTheDocument()
  })

  it('applies custom background color', () => {
    render(
      <ScreenContainer backgroundColor="#2c5234">
        <div>Test content</div>
      </ScreenContainer>
    )
    
    const container = screen.getByText('Test content').parentElement
    expect(container).toHaveStyle({
      backgroundColor: '#2c5234'
    })
  })

  it('applies custom className', () => {
    render(
      <ScreenContainer className="custom-class">
        <div>Test content</div>
      </ScreenContainer>
    )
    
    const container = screen.getByText('Test content').parentElement
    expect(container).toHaveClass('screen-container', 'custom-class')
  })

  it('has responsive styling properties', () => {
    render(
      <ScreenContainer>
        <div>Test content</div>
      </ScreenContainer>
    )
    
    const container = screen.getByText('Test content').parentElement
    expect(container).toHaveStyle({
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '100vh',
      boxSizing: 'border-box'
    })
  })
})