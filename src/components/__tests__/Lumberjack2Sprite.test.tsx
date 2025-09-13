import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import UniversalSprite from '../UniversalSprite'
import { lumberjack2Config } from '../../characters'

describe('UniversalSprite with Lumberjack2', () => {

  const defaultProps = {
    characterConfig: lumberjack2Config,
    spriteState: 'idleFrame1',
    width: 220,
    height: 173
  }

  it('should render with correct container dimensions', () => {
    const { container } = render(<UniversalSprite {...defaultProps} />)
    const sprite = container.firstChild as HTMLElement
    
    expect(sprite.style.width).toBe('220px')
    expect(sprite.style.height).toBe('173px')
    expect(sprite.style.position).toBe('relative')
  })

  it('should render inner sprite with background image', () => {
    const { container } = render(<UniversalSprite {...defaultProps} />)
    
    const innerSprite = container.querySelector('div > div') as HTMLElement
    expect(innerSprite).not.toBeNull()
    
    // Check that the HTML contains the background image (jsdom escapes quotes as &quot;)
    expect(container.innerHTML).toContain('background-image: url(&quot;./images/lumberjack2.png&quot;)')
  })

  it('should apply clip-path for pose bounds', () => {
    const { container } = render(<UniversalSprite {...defaultProps} spriteState="idleFrame1" />)
    
    // Check that the HTML contains clip-path polygon
    expect(container.innerHTML).toContain('clip-path: polygon(')
  })

  it('should handle different sprite states', () => {
    const { container, rerender } = render(<UniversalSprite {...defaultProps} spriteState="chopImpact" />)
    
    expect(container.innerHTML).toContain('background-image: url(&quot;./images/lumberjack2.png&quot;)')
    expect(container.innerHTML).toContain('clip-path: polygon(')
    
    // Try another state
    rerender(<UniversalSprite {...defaultProps} spriteState="hitStunned" />)
    expect(container.innerHTML).toContain('clip-path: polygon(')
  })

  it('should apply custom className to container', () => {
    const { container } = render(<UniversalSprite {...defaultProps} className="custom-class" />)
    const sprite = container.firstChild as HTMLElement
    
    expect(sprite.className).toBe('custom-class')
  })

  it('should handle all available sprite states', () => {
    const states = lumberjack2Config.availableStates

    states.forEach(state => {
      const { container } = render(<UniversalSprite {...defaultProps} spriteState={state} />)
      const sprite = container.firstChild as HTMLElement
      
      expect(sprite).toBeDefined()
      expect(container.innerHTML).toContain('background-image: url(&quot;./images/lumberjack2.png&quot;)')
      expect(container.innerHTML).toContain('clip-path: polygon(')
    })
  })
})