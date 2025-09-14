import type { GameState, AnimatedSegment, TreeSegment } from '../../game/GameState'
import type { IHighScoreService, ICharacterSelectionService } from '../../services'
import { createInitialGameState } from '../../game/GameState'

export interface ServiceContainer {
  highScoreService: IHighScoreService
  characterSelectionService: ICharacterSelectionService
}

export class MockFactory {
  static createGameState(overrides?: Partial<GameState>): GameState {
    const initial = createInitialGameState()
    return {
      ...initial,
      ...overrides
    }
  }

  static createAnimatedSegment(overrides?: Partial<AnimatedSegment>): AnimatedSegment {
    return {
      branchSide: 'left',
      animationId: `test-${Math.random()}`,
      startTime: performance.now(),
      direction: 'right',
      startPosition: { x: 100, y: 50 },
      ...overrides
    }
  }

  static createTreeSegment(branchSide: 'left' | 'right' | 'none' = 'none'): TreeSegment {
    return { branchSide }
  }

  static createMockServices(): ServiceContainer {
    const mockHighScoreService: IHighScoreService = {
      getHighScore: () => 100,
      saveHighScore: () => {},
      isNewHighScore: (score: number) => score > 100
    }

    const mockCharacterSelectionService: ICharacterSelectionService = {
      selectCharacter: () => 'lumberjack1',
      isCharacterForced: () => false,
      getRandomCharacter: () => 'lumberjack2'
    }

    return {
      highScoreService: mockHighScoreService,
      characterSelectionService: mockCharacterSelectionService
    }
  }

  static createTreeSegments(pattern: string): TreeSegment[] {
    return pattern.split('').map(char => {
      switch (char.toLowerCase()) {
        case 'l': return { branchSide: 'left' as const }
        case 'r': return { branchSide: 'right' as const }
        case 'n': return { branchSide: 'none' as const }
        default: return { branchSide: 'none' as const }
      }
    })
  }
}