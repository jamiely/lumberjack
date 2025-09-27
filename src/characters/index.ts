import type { CharacterType, CharacterConfig } from './types'
import { lumberjack1Config } from './lumberjack1/config'
import { lumberjack2Config } from './lumberjack2/config'
import { lumberjack3Config } from './lumberjack3/config'
import { lumberjack4Config } from './lumberjack4/config'
import { lumberjack5Config } from './lumberjack5/config'

// Character Registry
const characterRegistry: Record<CharacterType, CharacterConfig> = {
  lumberjack1: lumberjack1Config,
  lumberjack2: lumberjack2Config,
  lumberjack3: lumberjack3Config,
  lumberjack4: lumberjack4Config,
  lumberjack5: lumberjack5Config
}

// Character Selection Functions
export function getCharacterConfig(characterType: CharacterType): CharacterConfig {
  const config = characterRegistry[characterType]
  if (!config) {
    throw new Error(`Unknown character type: ${characterType}`)
  }
  return config
}

export function getAllCharacters(): CharacterConfig[] {
  return Object.values(characterRegistry)
}

export function getCharacterTypes(): CharacterType[] {
  return Object.keys(characterRegistry) as CharacterType[]
}

export function isValidCharacterType(type: string): type is CharacterType {
  return type in characterRegistry
}

// Re-export types and configs for convenience
export type { CharacterType, CharacterConfig, GameState } from './types'
export { lumberjack1Config, lumberjack2Config, lumberjack3Config, lumberjack4Config, lumberjack5Config }