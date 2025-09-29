import type { CharacterConfig, CharacterType } from './types'
import { characterDescriptors } from './descriptors'
import { characterConfigs, characterEntries } from './registry'

export const registry: Record<CharacterType, CharacterConfig> = characterConfigs

export function getCharacterConfig(characterType: CharacterType): CharacterConfig {
  const config = registry[characterType]
  if (!config) {
    throw new Error(`Unknown character type: ${characterType}`)
  }
  return config
}

export function getAllCharacters(): CharacterConfig[] {
  return characterEntries.map(([, config]) => config)
}

export function getCharacterTypes(): CharacterType[] {
  return characterDescriptors.map(descriptor => descriptor.id as CharacterType)
}

export function isValidCharacterType(type: string): type is CharacterType {
  return type in registry
}

// Re-export types and configs for convenience
export type { CharacterType, CharacterConfig, GameState } from './types'
export {
  characterDescriptors,
  characterEntries,
  characterConfigs
}
