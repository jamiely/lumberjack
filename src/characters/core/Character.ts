import type { CharacterConfig, CharacterType } from '../types'

export type { CharacterConfig }

export interface Character {
  type: CharacterType
  config: CharacterConfig
}
