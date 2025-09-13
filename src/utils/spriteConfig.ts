// Legacy sprite configuration utilities
// DEPRECATED: Use import { getCharacterConfig } from '../characters' instead

import { lumberjack1Config, lumberjack2Config } from '../characters'

/**
 * @deprecated Use getCharacterConfig('lumberjack1') from '../characters' instead
 */
export function getDefaultSpriteConfig() {
  return lumberjack1Config.spriteConfig
}

/**
 * @deprecated Use getCharacterConfig(characterType) from '../characters' instead
 */
export function getSpriteConfig(characterType: 'default' | 'lumberjack2' = 'default') {
  switch (characterType) {
    case 'default':
      return lumberjack1Config.spriteConfig
    case 'lumberjack2':
      return lumberjack2Config.spriteConfig
    default:
      return lumberjack1Config.spriteConfig
  }
}

/**
 * @deprecated Use getCharacterConfig('lumberjack2') from '../characters' instead
 */
export function getLumberjack2SpriteConfig() {
  return lumberjack2Config.spriteConfig
}

/**
 * @deprecated Use getCharacterConfig('lumberjack2').mapGameStateToSprite() instead
 */
export function mapGameStateToLumberjack2Pose(gameState: 'idle' | 'chopping' | 'hit') {
  return lumberjack2Config.mapGameStateToSprite(gameState)
}