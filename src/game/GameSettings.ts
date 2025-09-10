export interface AudioSettings {
  enabled: boolean
  masterVolume: number // 0.0 to 1.0
  sfxVolume: number    // 0.0 to 1.0
}

export interface GameSettings {
  audio: AudioSettings
  freePlay: boolean
}

export const defaultSettings: GameSettings = {
  audio: {
    enabled: true,
    masterVolume: 0.8,
    sfxVolume: 1.0
  },
  freePlay: true
}