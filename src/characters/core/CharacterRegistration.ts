import { CharacterFactory } from './CharacterFactory'
import type { CharacterConfig, CharacterType } from '../types'
import { lumberjack1Config } from '../lumberjack1/config'
import { lumberjack2Config } from '../lumberjack2/config'
import { lumberjack3Config } from '../lumberjack3/config'
import { lumberjack4Config } from '../lumberjack4/config'
import { lumberjack5Config } from '../lumberjack5/config'

const characterEntries: Array<[CharacterType, CharacterConfig]> = [
  ['lumberjack1', lumberjack1Config],
  ['lumberjack2', lumberjack2Config],
  ['lumberjack3', lumberjack3Config],
  ['lumberjack4', lumberjack4Config],
  ['lumberjack5', lumberjack5Config]
]

// Initialize character factory with consolidated configs
export function initializeCharacters() {
  characterEntries.forEach(([type, config]) => {
    CharacterFactory.registerCharacter(type, config)
  })
}
