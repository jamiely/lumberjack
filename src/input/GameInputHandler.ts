export interface GameInputHandler {
  onChopLeft: () => void
  onChopRight: () => void
  onReset: () => void
  onToggleDebug: () => void
}