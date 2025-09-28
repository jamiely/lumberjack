import type { Character } from './Character'
import type { CharacterConfig, CharacterType } from '../types'

export class CharacterFactory {
  private static characterConfigs: Partial<Record<CharacterType, CharacterConfig>> = {}

  static registerCharacter(type: CharacterType, config: CharacterConfig): void {
    this.characterConfigs[type] = config
  }

  static create(type: CharacterType): Character {
    const config = this.characterConfigs[type]
    if (!config) {
      throw new Error(`Character type '${type}' is not registered`)
    }

    return {
      type,
      config
    }
  }

  static getAvailable(): CharacterType[] {
    return Object.keys(this.characterConfigs) as CharacterType[]
  }

  static isRegistered(type: CharacterType): boolean {
    return type in this.characterConfigs
  }
}
