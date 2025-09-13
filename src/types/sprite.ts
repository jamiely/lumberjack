// Legacy sprite type definitions for backward compatibility
// These types are maintained for existing components that haven't been migrated to the new character system

export interface SpriteConfig {
  sheetPath: string
  sourceSize: number
  individualSize: number
  displaySize: number
  scaleFactor: number
  scaledSheetSize: number
  coordinates: {
    idle: [number, number, number, number]
    chopping: [number, number, number, number]
    hit: [number, number, number, number]
  }
}

export interface Lumberjack2SpriteConfig {
  sheetPath: string
  sheetWidth: number
  sheetHeight: number
  individualSize: number
  displaySize: number
  scaleFactor: number
  scaledSheetWidth: number
  scaledSheetHeight: number
  coordinates: {
    idleFrame1: [number, number, number, number]
    idleFrame2: [number, number, number, number]
    chopAnticipation: [number, number, number, number]
    chopImpact: [number, number, number, number]
    chopFollowThrough: [number, number, number, number]
    chopRecovery: [number, number, number, number]
    hitStunned: [number, number, number, number]
    knockedDown: [number, number, number, number]
  }
}