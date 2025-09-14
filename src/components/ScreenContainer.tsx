import React from 'react'
import { useViewportScaling, type ScalingOptions } from '../hooks/useViewportScaling'
import { GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT } from '../config/uiConfig'
import { getScalingOptions } from '../config/scalingConfig'

interface ScreenContainerProps {
  children: React.ReactNode
  backgroundColor?: string
  className?: string
  scalingOptions?: ScalingOptions
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  backgroundColor = 'transparent',
  className = '',
  scalingOptions
}) => {
  // Use provided options or get defaults from configuration
  const options = scalingOptions || getScalingOptions()
  const scaling = useViewportScaling(options)

  return (
    <div 
      className={`screen-container ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'transparent',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      data-scale={scaling.scale}
      data-offset-x={scaling.offsetX}
      data-offset-y={scaling.offsetY}
    >
      <div
        className="game-content"
        style={{
          width: `${GAME_BOARD_WIDTH}px`,
          height: `${GAME_BOARD_HEIGHT}px`,
          backgroundColor,
          position: 'relative',
          transform: `scale(${scaling.scale})`,
          transformOrigin: 'center center',
          imageRendering: scaling.scale >= 1 ? 'pixelated' : 'auto'
        }}
        data-testid="scaled-game-content"
      >
        {children}
      </div>
    </div>
  )
}