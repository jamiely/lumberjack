import type { GameState, TreeSegment, AnimatedSegment } from '../../game/GameState'
import { createInitialGameState } from '../../game/GameState'

export class GameStateBuilder {
  private state: GameState

  constructor() {
    this.state = createInitialGameState()
  }

  withScore(score: number): GameStateBuilder {
    this.state = { ...this.state, score }
    return this
  }

  withTimer(time: number): GameStateBuilder {
    this.state = { ...this.state, timeRemaining: time }
    return this
  }

  withTreeSegments(segments: TreeSegment[]): GameStateBuilder {
    this.state = { ...this.state, treeSegments: segments }
    return this
  }

  withPlayerSide(side: 'left' | 'right'): GameStateBuilder {
    this.state = { ...this.state, playerSide: side }
    return this
  }

  withPlayerState(playerState: 'idle' | 'chopping' | 'hit'): GameStateBuilder {
    this.state = { ...this.state, playerState }
    return this
  }

  withGameOver(gameOver: boolean): GameStateBuilder {
    this.state = { ...this.state, gameOver }
    return this
  }

  withDebug(showDebug: boolean): GameStateBuilder {
    this.state = { ...this.state, showDebug }
    return this
  }

  withAnimatedSegments(segments: AnimatedSegment[]): GameStateBuilder {
    this.state = { ...this.state, animatedSegments: segments }
    return this
  }

  withMaxTime(maxTime: number): GameStateBuilder {
    this.state = { ...this.state, maxTime }
    return this
  }

  build(): GameState {
    return { ...this.state }
  }
}