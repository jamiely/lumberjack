import type { SpriteConfig, Lumberjack2SpriteConfig } from '../constants'
import { DEFAULT_SPRITE_CONFIG, LUMBERJACK2_SPRITE_CONFIG } from '../constants'

/**
 * Get the default sprite configuration for the lumberjack character
 * This utility provides a centralized way to get sprite configurations
 * and will be the foundation for future character selection
 */
export function getDefaultSpriteConfig(): SpriteConfig {
  return DEFAULT_SPRITE_CONFIG
}

/**
 * Get sprite configuration for a specific character type
 * Currently supports 'default' (original lumberjack) and 'lumberjack2'
 */
export function getSpriteConfig(characterType: 'default' | 'lumberjack2' = 'default'): SpriteConfig | Lumberjack2SpriteConfig {
  switch (characterType) {
    case 'default':
      return DEFAULT_SPRITE_CONFIG
    case 'lumberjack2':
      return LUMBERJACK2_SPRITE_CONFIG
    default:
      return DEFAULT_SPRITE_CONFIG
  }
}

/**
 * Get the lumberjack2 sprite configuration with extended poses
 */
export function getLumberjack2SpriteConfig(): Lumberjack2SpriteConfig {
  return LUMBERJACK2_SPRITE_CONFIG
}

/**
 * Map original game states to lumberjack2 poses
 * This provides backward compatibility while using the enhanced sprite sheet
 */
export function mapGameStateToLumberjack2Pose(gameState: 'idle' | 'chopping' | 'hit'): keyof Lumberjack2SpriteConfig['coordinates'] {
  switch (gameState) {
    case 'idle':
      return 'idleFrame1'
    case 'chopping':
      return 'chopImpact' // Use the main impact frame for chopping
    case 'hit':
      return 'hitStunned'
    default:
      return 'idleFrame1'
  }
}