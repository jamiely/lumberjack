import { getCharacterConfig } from '../index'

describe('Character Orientation Configuration', () => {
  describe('default facing directions', () => {
    it('should have lumberjack1 facing left by default', () => {
      const config = getCharacterConfig('lumberjack1')
      expect(config.spriteConfig.defaultFacing).toBe('left')
    })

    it('should have lumberjack2 facing right by default', () => {
      const config = getCharacterConfig('lumberjack2')
      expect(config.spriteConfig.defaultFacing).toBe('right')
    })

    it('should have lumberjack3 facing right by default', () => {
      const config = getCharacterConfig('lumberjack3')
      expect(config.spriteConfig.defaultFacing).toBe('right')
    })

    it('should have lumberjack4 facing right by default', () => {
      const config = getCharacterConfig('lumberjack4')
      expect(config.spriteConfig.defaultFacing).toBe('right')
    })
  })

  describe('pose bounds structure', () => {
    it('should support optional facing property in pose bounds', () => {
      const config = getCharacterConfig('lumberjack1')
      const poses = config.spriteConfig.poses
      
      // Verify the poses exist and have the required structure
      expect(poses).toBeDefined()
      expect(Object.keys(poses).length).toBeGreaterThan(0)
      
      // Check that each pose has the required properties
      Object.values(poses).forEach(pose => {
        expect(pose).toHaveProperty('x')
        expect(pose).toHaveProperty('y')
        expect(pose).toHaveProperty('width')
        expect(pose).toHaveProperty('height')
        expect(typeof pose.x).toBe('number')
        expect(typeof pose.y).toBe('number')
        expect(typeof pose.width).toBe('number')
        expect(typeof pose.height).toBe('number')
        
        // facing property should be optional
        if ('facing' in pose) {
          expect(pose.facing).toMatch(/^(left|right)$/)
        }
      })
    })
  })

  describe('configuration consistency', () => {
    it('should have all character configs with defaultFacing property', () => {
      const characterTypes = ['lumberjack1', 'lumberjack2', 'lumberjack3', 'lumberjack4'] as const
      
      characterTypes.forEach(characterType => {
        const config = getCharacterConfig(characterType)
        expect(config.spriteConfig).toHaveProperty('defaultFacing')
        expect(config.spriteConfig.defaultFacing).toMatch(/^(left|right)$/)
      })
    })

    it('should maintain existing character config structure', () => {
      const config = getCharacterConfig('lumberjack2')
      
      // Verify existing properties are still present
      expect(config).toHaveProperty('id')
      expect(config).toHaveProperty('name')
      expect(config).toHaveProperty('spriteConfig')
      expect(config).toHaveProperty('mapGameStateToSprite')
      expect(config).toHaveProperty('availableStates')
      
      // Verify sprite config structure
      const spriteConfig = config.spriteConfig
      expect(spriteConfig).toHaveProperty('sheetPath')
      expect(spriteConfig).toHaveProperty('sheetWidth')
      expect(spriteConfig).toHaveProperty('sheetHeight')
      expect(spriteConfig).toHaveProperty('dimensions')
      expect(spriteConfig).toHaveProperty('positioning')
      expect(spriteConfig).toHaveProperty('poses')
      expect(spriteConfig).toHaveProperty('defaultFacing')
    })
  })
})