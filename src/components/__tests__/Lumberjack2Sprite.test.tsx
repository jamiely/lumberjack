import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Lumberjack2Sprite from '../Lumberjack2Sprite'
import { lumberjack2Config } from '../../characters'

describe('Lumberjack2Sprite', () => {
  const lumberjack2SpriteConfig = {
    sheetPath: lumberjack2Config.spriteConfig.sheetPath,
    sheetWidth: 768,
    sheetHeight: 768,
    individualSize: 256,
    displaySize: 220,
    scaleFactor: lumberjack2Config.spriteConfig.scaleFactor,
    scaledSheetWidth: Math.floor(768 * lumberjack2Config.spriteConfig.scaleFactor),
    scaledSheetHeight: Math.floor(768 * lumberjack2Config.spriteConfig.scaleFactor),
    coordinates: {
      idleFrame1: lumberjack2Config.spriteConfig.coordinates.idleFrame1,
      idleFrame2: lumberjack2Config.spriteConfig.coordinates.idleFrame2,
      chopAnticipation: lumberjack2Config.spriteConfig.coordinates.chopAnticipation,
      chopImpact: lumberjack2Config.spriteConfig.coordinates.chopImpact,
      chopFollowThrough: lumberjack2Config.spriteConfig.coordinates.chopFollowThrough,
      chopRecovery: lumberjack2Config.spriteConfig.coordinates.chopRecovery,
      hitStunned: lumberjack2Config.spriteConfig.coordinates.hitStunned,
      knockedDown: lumberjack2Config.spriteConfig.coordinates.knockedDown
    }
  }

  const defaultProps = {
    state: 'idleFrame1' as const,
    width: 220,
    height: 173,
    spriteConfig: lumberjack2SpriteConfig
  }

  it('should render with correct background image', () => {
    const { container } = render(<Lumberjack2Sprite {...defaultProps} />)
    const sprite = container.firstChild as HTMLElement
    
    expect(sprite.style.backgroundImage).toBe('url("/images/lumberjack2.png")')
  })

  it('should render with correct dimensions', () => {
    const { container } = render(<Lumberjack2Sprite {...defaultProps} />)
    const sprite = container.firstChild as HTMLElement
    
    expect(sprite.style.width).toBe('220px')
    expect(sprite.style.height).toBe('173px')
  })

  it('should render with correct background position for idleFrame1', () => {
    const { container } = render(<Lumberjack2Sprite {...defaultProps} state="idleFrame1" />)
    const sprite = container.firstChild as HTMLElement
    
    expect(sprite.style.backgroundPosition).toBe('0px 0px')
  })

  it('should render with correct background position for chopImpact', () => {
    const { container } = render(<Lumberjack2Sprite {...defaultProps} state="chopImpact" />)
    const sprite = container.firstChild as HTMLElement
    
    // chopImpact is at coordinates [0, 256, 256, 512]
    // backgroundPosition should be -0px -220px (256 * scale factor)
    const expectedY = Math.round(256 * lumberjack2SpriteConfig.scaleFactor)
    expect(sprite.style.backgroundPosition).toBe(`0px -${expectedY}px`)
  })

  it('should render with correct background position for knockedDown', () => {
    const { container } = render(<Lumberjack2Sprite {...defaultProps} state="knockedDown" />)
    const sprite = container.firstChild as HTMLElement
    
    // knockedDown is at coordinates [256, 512, 512, 768]
    // backgroundPosition should be -220px -440px (scale factors applied)
    const expectedX = Math.round(256 * lumberjack2SpriteConfig.scaleFactor)
    const expectedY = Math.round(512 * lumberjack2SpriteConfig.scaleFactor)
    expect(sprite.style.backgroundPosition).toBe(`-${expectedX}px -${expectedY}px`)
  })

  it('should apply custom className', () => {
    const { container } = render(<Lumberjack2Sprite {...defaultProps} className="custom-class" />)
    const sprite = container.firstChild as HTMLElement
    
    expect(sprite.className).toBe('custom-class')
  })

  it('should handle all pose states', () => {
    const states = [
      'idleFrame1',
      'idleFrame2', 
      'chopAnticipation',
      'chopImpact',
      'chopFollowThrough',
      'chopRecovery',
      'hitStunned',
      'knockedDown'
    ] as const

    states.forEach(state => {
      const { container } = render(<Lumberjack2Sprite {...defaultProps} state={state} />)
      const sprite = container.firstChild as HTMLElement
      
      expect(sprite).toBeDefined()
      expect(sprite.style.backgroundImage).toBe('url("/images/lumberjack2.png")')
    })
  })
})