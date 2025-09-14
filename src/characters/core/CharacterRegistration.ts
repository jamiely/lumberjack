import { CharacterFactory } from './CharacterFactory'
import type { CharacterConfig } from './Character'
import { lumberjack1Config } from '../lumberjack1/config'
import { lumberjack2Config } from '../lumberjack2/config'
import { lumberjack3Config } from '../lumberjack3/config'
import { lumberjack4Config } from '../lumberjack4/config'

// Convert existing character configs to new format  
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertLegacyToNewConfig(legacyConfig: any): CharacterConfig {
  const { spriteConfig } = legacyConfig
  
  return {
    name: legacyConfig.name,
    sprites: {
      idle: spriteConfig.sheetPath, // We'll use the sheet path for all states for now
      chopping: spriteConfig.sheetPath,
      hit: spriteConfig.sheetPath
    },
    animations: {
      choppingDuration: 200 // Default duration
    },
    dimensions: {
      width: spriteConfig.dimensions.width,
      height: spriteConfig.dimensions.height
    }
  }
}

// Initialize character factory with existing characters
export function initializeCharacters() {
  try {
    CharacterFactory.registerCharacter('lumberjack1', convertLegacyToNewConfig(lumberjack1Config))
    CharacterFactory.registerCharacter('lumberjack2', convertLegacyToNewConfig(lumberjack2Config))
    CharacterFactory.registerCharacter('lumberjack3', convertLegacyToNewConfig(lumberjack3Config))
    CharacterFactory.registerCharacter('lumberjack4', convertLegacyToNewConfig(lumberjack4Config))
  } catch (error) {
    console.warn('Some characters could not be registered:', error)
  }
}