import type { CharacterType, CharacterConfig } from './types'
import { lumberjack1Config } from './lumberjack1/config'
import { lumberjack2Config } from './lumberjack2/config'

// Character Registry
const characterRegistry: Record<CharacterType, CharacterConfig> = {
  lumberjack1: lumberjack1Config,
  lumberjack2: lumberjack2Config
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
export { lumberjack1Config, lumberjack2Config }