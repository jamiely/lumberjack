export interface CharacterSprites {
  idle: string
  chopping: string
  hit: string
}

export interface CharacterAnimations {
  choppingDuration: number
  hitDuration?: number
}

export interface CharacterConfig {
  name: string
  sprites: CharacterSprites
  animations: CharacterAnimations
  dimensions: {
    width: number
    height: number
  }
}

export interface Character {
  type: string
  config: CharacterConfig
}