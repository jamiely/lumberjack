import type {
  CharacterConfig,
  CharacterPositioning,
  CharacterSpriteConfig,
  CharacterType,
  GameState,
  PoseBounds
} from './types'

export const DEFAULT_BOTTOM_OFFSET = 86
export const DEFAULT_LEFT_POSITION = 90
export const DEFAULT_RIGHT_POSITION = 390
export const DEFAULT_CHARACTER_HEIGHT = 173
export const BASE_CHARACTER_WIDTH = 90

export type StatePoseMap = Record<GameState, string>

export function calculateCenteringOffset(
  displayWidth: number,
  baseWidth: number = BASE_CHARACTER_WIDTH
): number {
  return Math.max(0, (displayWidth - baseWidth) / 2)
}

export interface CreateCharacterConfigOptions {
  id: CharacterType
  name: string
  sheet: {
    path: string
    width: number
    height: number
  }
  displaySize: number
  poses: Record<string, PoseBounds>
  defaultFacing: 'left' | 'right'
  statePoseMap: StatePoseMap
  width?: number
  height?: number
  availableStates?: string[]
  positioningOverrides?: Partial<CharacterPositioning>
}

export function createStateMapper(
  mapping: StatePoseMap,
  fallbackState: GameState = 'idle'
): (gameState: GameState) => string {
  const fallbackPose = mapping[fallbackState]
  return (gameState: GameState): string => {
    return mapping[gameState] ?? fallbackPose
  }
}

export function createCharacterConfig(options: CreateCharacterConfigOptions): CharacterConfig {
  const width = options.width ?? options.displaySize
  const height = options.height ?? DEFAULT_CHARACTER_HEIGHT

  const positioning: CharacterPositioning = {
    centeringOffset:
      options.positioningOverrides?.centeringOffset ?? calculateCenteringOffset(width),
    bottomOffset: options.positioningOverrides?.bottomOffset ?? DEFAULT_BOTTOM_OFFSET,
    leftPosition: options.positioningOverrides?.leftPosition ?? DEFAULT_LEFT_POSITION,
    rightPosition: options.positioningOverrides?.rightPosition ?? DEFAULT_RIGHT_POSITION
  }

  const spriteConfig: CharacterSpriteConfig = {
    sheetPath: options.sheet.path,
    sheetWidth: options.sheet.width,
    sheetHeight: options.sheet.height,
    dimensions: {
      width,
      height,
      displaySize: options.displaySize
    },
    positioning,
    poses: options.poses,
    defaultFacing: options.defaultFacing
  }

  const derivedStates = options.availableStates ?? Object.keys(options.poses)
  const mappingStates = Object.values(options.statePoseMap)
  const availableStates = Array.from(new Set([...derivedStates, ...mappingStates]))

  return {
    id: options.id,
    name: options.name,
    spriteConfig,
    mapGameStateToSprite: createStateMapper(options.statePoseMap),
    availableStates
  }
}
