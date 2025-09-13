import type { SpriteConfig } from '../constants'
import { DEFAULT_SPRITE_CONFIG } from '../constants'

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
 * Currently only supports the default character, but designed
 * to be extended for multiple character types in the future
 */
export function getSpriteConfig(characterType: 'default' = 'default'): SpriteConfig {
  switch (characterType) {
    case 'default':
      return DEFAULT_SPRITE_CONFIG
    default:
      return DEFAULT_SPRITE_CONFIG
  }
}