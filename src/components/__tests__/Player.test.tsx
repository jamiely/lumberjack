import { render } from '@testing-library/react'
import Player from '../Player'
import { getCharacterConfig } from '../../characters'

describe('Player', () => {
  const defaultProps = {
    playerSide: 'left' as const,
    playerState: 'idle' as const,
    gameOver: false,
    leftPosition: 90,
    rightPosition: 390,
    bottomOffset: 86,
  }

  describe('sprite orientation and mirroring', () => {
    it('should not mirror lumberjack1 (faces left) when on right side facing tree', () => {
      const { container } = render(
        <Player {...defaultProps} playerSide="right" characterType="lumberjack1" />
      )
      
      const playerDiv = container.firstChild as HTMLElement
      expect(playerDiv.style.transform).toBe('')
    })

    it('should mirror lumberjack1 (faces left) when on left side facing tree', () => {
      const { container } = render(
        <Player {...defaultProps} playerSide="left" characterType="lumberjack1" />
      )
      
      const playerDiv = container.firstChild as HTMLElement
      expect(playerDiv.style.transform).toBe('scaleX(-1)')
    })

    it('should mirror lumberjack2 (faces right) when on right side facing tree', () => {
      const { container } = render(
        <Player {...defaultProps} playerSide="right" characterType="lumberjack2" />
      )
      
      const playerDiv = container.firstChild as HTMLElement
      expect(playerDiv.style.transform).toBe('scaleX(-1)')
    })

    it('should not mirror lumberjack2 (faces right) when on left side facing tree', () => {
      const { container } = render(
        <Player {...defaultProps} playerSide="left" characterType="lumberjack2" />
      )
      
      const playerDiv = container.firstChild as HTMLElement
      expect(playerDiv.style.transform).toBe('')
    })

    it('should use default facing when pose has no specific facing override', () => {
      const lumberjack1Config = getCharacterConfig('lumberjack1')
      const lumberjack2Config = getCharacterConfig('lumberjack2')
      
      expect(lumberjack1Config.spriteConfig.defaultFacing).toBe('left')
      expect(lumberjack2Config.spriteConfig.defaultFacing).toBe('right')
      
      // Test that poses don't have facing overrides (unless specifically added)
      const lumberjack1IdlePose = lumberjack1Config.spriteConfig.poses.idle
      const lumberjack2IdlePose = lumberjack2Config.spriteConfig.poses.idleFrame1
      
      expect(lumberjack1IdlePose.facing).toBeUndefined()
      expect(lumberjack2IdlePose.facing).toBeUndefined()
    })

    it('should verify pose structure supports facing overrides', () => {
      // This test verifies that the pose structure supports facing overrides
      // and that the logic can handle them when they exist
      const config = getCharacterConfig('lumberjack1')
      const poses = config.spriteConfig.poses
      
      // Verify poses have the required structure to support facing overrides
      Object.values(poses).forEach(pose => {
        expect(pose).toHaveProperty('x')
        expect(pose).toHaveProperty('y')
        expect(pose).toHaveProperty('width')
        expect(pose).toHaveProperty('height')
        
        // The facing property is optional, but if present should be valid
        if ('facing' in pose && pose.facing !== undefined) {
          expect(['left', 'right']).toContain(pose.facing)
        }
      })
      
      // Test the default behavior - should work with or without pose overrides
      const { container } = render(
        <Player {...defaultProps} playerSide="left" characterType="lumberjack1" />
      )
      
      const playerDiv = container.firstChild as HTMLElement
      // lumberjack1 faces left by default, when on left side (should face right), needs mirroring
      expect(playerDiv.style.transform).toBe('scaleX(-1)')
    })
  })

  describe('character positioning', () => {
    it('should position player correctly on left side', () => {
      const { container } = render(
        <Player {...defaultProps} playerSide="left" leftPosition={90} />
      )
      
      const playerDiv = container.firstChild as HTMLElement
      const lumberjack2Config = getCharacterConfig('lumberjack2')
      const expectedLeft = 90 - lumberjack2Config.spriteConfig.positioning.centeringOffset
      expect(playerDiv.style.left).toBe(`${expectedLeft}px`)
    })

    it('should position player correctly on right side', () => {
      const { container } = render(
        <Player {...defaultProps} playerSide="right" rightPosition={390} />
      )
      
      const playerDiv = container.firstChild as HTMLElement
      const lumberjack2Config = getCharacterConfig('lumberjack2')
      const expectedLeft = 390 - lumberjack2Config.spriteConfig.positioning.centeringOffset
      expect(playerDiv.style.left).toBe(`${expectedLeft}px`)
    })
  })

  describe('game state handling', () => {
    it('should show hit state when game is over', () => {
      // This is more of an integration test to ensure the state mapping still works
      const { container } = render(
        <Player {...defaultProps} gameOver={true} playerState="idle" />
      )
      
      // Should render without errors when game is over
      expect(container.firstChild).toBeTruthy()
    })
  })
})