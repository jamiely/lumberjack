export interface IHighScoreService {
  getHighScore(): number
  saveHighScore(score: number): void
  isNewHighScore(score: number): boolean
}

export class HighScoreService implements IHighScoreService {
  private readonly storageKey = 'lumberjack-high-score'

  getHighScore(): number {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? parseInt(stored, 10) : 0
    } catch {
      return 0
    }
  }

  saveHighScore(score: number): void {
    try {
      localStorage.setItem(this.storageKey, score.toString())
    } catch {
      // Fail silently if localStorage is not available
    }
  }

  isNewHighScore(score: number): boolean {
    return score > this.getHighScore()
  }
}