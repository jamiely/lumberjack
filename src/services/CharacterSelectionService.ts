import type { CharacterType } from '../characters'
import { getCharacterTypes } from '../characters'

export interface ICharacterSelectionService {
  selectCharacter(): CharacterType
  isCharacterForced(): boolean
  getRandomCharacter(): CharacterType
}

export class CharacterSelectionService implements ICharacterSelectionService {
  private readonly availableCharacters: CharacterType[]
  private forcedCharacter: CharacterType | null = null

  constructor(forcedCharacter?: CharacterType, availableCharacters: CharacterType[] = getCharacterTypes()) {
    this.availableCharacters = [...availableCharacters]
    this.forcedCharacter = forcedCharacter ?? null
  }

  selectCharacter(): CharacterType {
    if (this.forcedCharacter) {
      return this.forcedCharacter
    }
    return this.getRandomCharacter()
  }

  isCharacterForced(): boolean {
    return this.forcedCharacter !== null
  }

  getRandomCharacter(): CharacterType {
    const randomIndex = Math.floor(Math.random() * this.availableCharacters.length)
    return this.availableCharacters[randomIndex]
  }

  setForcedCharacter(character: CharacterType | null): void {
    this.forcedCharacter = character
  }
}
