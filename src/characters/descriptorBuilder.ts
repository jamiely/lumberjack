import { createCharacterConfig } from './sharedConfig'
import type { CharacterConfig, CharacterType, GameState } from './types'
import type { CharacterDescriptor } from './descriptors'

const DEFAULT_STATE_POSE_MAP: Record<GameState, string> = {
  idle: 'idle',
  chopping: 'chopping',
  hit: 'hit'
}

export function createStandardStateMap(
  overrides: Partial<Record<GameState, string>> = {}
): Record<GameState, string> {
  return {
    idle: overrides.idle ?? DEFAULT_STATE_POSE_MAP.idle,
    chopping: overrides.chopping ?? DEFAULT_STATE_POSE_MAP.chopping,
    hit: overrides.hit ?? DEFAULT_STATE_POSE_MAP.hit
  }
}

export function buildCharacterConfig(descriptor: CharacterDescriptor): CharacterConfig {
  const statePoseMap = createStandardStateMap(descriptor.statePoseMap)

  return createCharacterConfig({
    id: descriptor.id as CharacterType,
    name: descriptor.name,
    sheet: descriptor.sheet,
    displaySize: descriptor.displaySize,
    height: descriptor.height,
    width: descriptor.width,
    poses: descriptor.poses,
    defaultFacing: descriptor.defaultFacing,
    statePoseMap,
    availableStates: descriptor.availableStates,
    positioningOverrides: descriptor.positioningOverrides
  })
}

export function buildCharacterEntries(
  descriptors: readonly CharacterDescriptor[]
): Array<[CharacterType, CharacterConfig]> {
  return descriptors.map(descriptor => {
    const config = buildCharacterConfig(descriptor)
    return [descriptor.id as CharacterType, config]
  })
}

export function buildCharacterRegistry(
  descriptors: readonly CharacterDescriptor[]
): Record<CharacterType, CharacterConfig> {
  return buildCharacterEntries(descriptors).reduce<Record<CharacterType, CharacterConfig>>((registry, [id, config]) => {
    registry[id] = config
    return registry
  }, {} as Record<CharacterType, CharacterConfig>)
}
