import { characterDescriptors } from './descriptors'
import { buildCharacterEntries, buildCharacterRegistry } from './descriptorBuilder'
import type { CharacterConfig, CharacterType } from './types'

export const characterEntries = buildCharacterEntries(characterDescriptors) as ReadonlyArray<[
  CharacterType,
  CharacterConfig
]>

export const characterConfigs = buildCharacterRegistry(characterDescriptors)
