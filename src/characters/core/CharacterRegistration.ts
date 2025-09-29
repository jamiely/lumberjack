import { CharacterFactory } from './CharacterFactory'
import { characterEntries } from '../registry'

export function initializeCharacters() {
  characterEntries.forEach(([type, config]) => {
    CharacterFactory.registerCharacter(type, config)
  })
}
