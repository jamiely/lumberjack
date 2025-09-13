import { useEffect, useRef, useState } from 'react'
import type { TreeSegment, AnimatedSegment } from '../game/GameState'
import Player from './Player'
import { BranchSprite } from './BranchSprite'
import { GrassSprite } from './GrassSprite'
import { BackgroundSprite } from './BackgroundSprite'
import {
  GAME_BOARD_WIDTH,
  GAME_BOARD_HEIGHT,
  PLAYER_BOTTOM_OFFSET,
  PLAYER_LEFT_POSITION,
  PLAYER_RIGHT_POSITION,
  TREE_TRUNK_WIDTH,
  TREE_TRUNK_HEIGHT,
  TREE_TRUNK_LEFT_POSITION,
  TREE_TRUNK_BOTTOM_OFFSET,
  TREE_SEGMENT_VERTICAL_SPACING,
  TREE_TRUNK_SPRITE_PATH,
  BRANCH_LEFT_POSITION,
  BRANCH_RIGHT_POSITION,
  BRANCH_VERTICAL_OFFSET,
  BRANCH_SPRITE_WIDTH,
  ANIMATION_DURATION,
  ANIMATION_SPEED,
  ANIMATION_OUT_OF_BOUNDS_LEFT,
  ANIMATION_OUT_OF_BOUNDS_RIGHT,
  ANIMATED_BRANCH_OFFSET
} from '../constants'

interface GameBoardProps {
  treeSegments: TreeSegment[]
  playerSide: 'left' | 'right'
  playerState: 'idle' | 'chopping' | 'hit'
  gameOver: boolean
  mode?: 'interactive' | 'static' | 'frozen'
  animatedSegments?: AnimatedSegment[]
  onRemoveAnimatedSegment?: (animationId: string) => void
}

export default function GameBoard({ 
  treeSegments, 
  playerSide,
  playerState,
  gameOver, 
  mode = 'interactive',
  animatedSegments = [],
  onRemoveAnimatedSegment
}: GameBoardProps) {
  const getOpacity = () => {
    if (mode === 'frozen') return 0.7
    if (mode === 'static') return 0.8
    return 1
  }

  const getPointerEvents = () => {
    return mode === 'interactive' ? 'auto' : 'none'
  }

  const animationFrameRef = useRef<number>(0)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    if (animatedSegments.length === 0) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    let isActive = true

    const animate = (timestamp: number) => {
      if (!isActive) return
      
      setCurrentTime(timestamp)
      
      // Check for segments to remove
      animatedSegments.forEach(segment => {
        const elapsed = timestamp - segment.startTime
        const distance = ANIMATION_SPEED * (elapsed / 1000)
        
        // Remove segment if animation is complete or out of bounds
        if (elapsed > ANIMATION_DURATION) {
          onRemoveAnimatedSegment?.(segment.animationId)
        } else {
          // Check if segment has moved out of bounds
          const currentX = segment.startPosition.x + (segment.direction === 'right' ? distance : -distance)
          if (currentX < ANIMATION_OUT_OF_BOUNDS_LEFT || currentX > ANIMATION_OUT_OF_BOUNDS_RIGHT) {
            onRemoveAnimatedSegment?.(segment.animationId)
          }
        }
      })

      if (animatedSegments.length > 0 && isActive) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      isActive = false
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [animatedSegments, onRemoveAnimatedSegment])

  return (
    <div style={{ 
      position: 'relative', 
      width: `${GAME_BOARD_WIDTH}px`, 
      height: `${GAME_BOARD_HEIGHT}px`, 
      backgroundColor: 'transparent', // Let background sprite show through
      overflow: 'hidden',
      opacity: getOpacity(),
      pointerEvents: getPointerEvents()
    }} data-testid="game-board">
      {/* Background sprite - furthest back */}
      <BackgroundSprite
        style={{
          position: 'absolute',
          left: '0px',
          top: '0px',
          zIndex: 0 // Behind game elements but above container background
        }}
      />

      {/* Grass sprite at ground level */}
      <GrassSprite
        style={{
          position: 'absolute',
          left: '0px',
          bottom: '40px',
          zIndex: 0 // Behind tree trunk and other elements
        }}
      />

      {/* Tree segments */}
      {treeSegments.map((segment, index) => (
        <div key={index}>
          {/* Tree trunk segment */}
          <div style={{
            position: 'absolute',
            left: `${TREE_TRUNK_LEFT_POSITION}px`,
            bottom: `${index * TREE_SEGMENT_VERTICAL_SPACING + TREE_TRUNK_BOTTOM_OFFSET}px`,
            width: `${TREE_TRUNK_WIDTH}px`,
            height: `${TREE_TRUNK_HEIGHT}px`,
            backgroundImage: `url(${TREE_TRUNK_SPRITE_PATH})`,
            backgroundSize: '100% 140%',
            // border: TREE_TRUNK_BORDER // Removed - using realistic trunk sprite instead
          }} />
          
          {/* Branch */}
          {segment.branchSide !== 'none' && (
            <BranchSprite
              side={segment.branchSide}
              style={{
                position: 'absolute',
                left: segment.branchSide === 'left' ? `${BRANCH_LEFT_POSITION}px` : `${BRANCH_RIGHT_POSITION}px`,
                bottom: `${index * TREE_SEGMENT_VERTICAL_SPACING + BRANCH_VERTICAL_OFFSET}px`
              }}
            />
          )}
        </div>
      ))}

      {/* Player */}
      <Player 
        playerSide={playerSide}
        playerState={playerState}
        gameOver={gameOver}
        leftPosition={PLAYER_LEFT_POSITION}
        rightPosition={PLAYER_RIGHT_POSITION}
        bottomOffset={PLAYER_BOTTOM_OFFSET}
      />

      {/* Animated flying segments */}
      {animatedSegments.map(segment => {
        const elapsed = currentTime - segment.startTime
        const distance = ANIMATION_SPEED * (elapsed / 1000)
        
        const currentX = segment.startPosition.x + (segment.direction === 'right' ? distance : -distance)
        const rotation = (elapsed * 0.36) % 360 // Smooth rotation - about 1 full rotation per second
        
        return (
          <div key={segment.animationId}>
            {/* Wrapper div for rotating trunk+branch as single unit */}
            <div style={{
              position: 'absolute',
              left: `${currentX}px`,
              bottom: `${segment.startPosition.y}px`,
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              zIndex: 10
            }}>
              {/* Animated trunk segment positioned at wrapper origin */}
              <div style={{
                position: 'absolute',
                left: '0px',
                bottom: '0px',
                width: `${TREE_TRUNK_WIDTH}px`,
                height: `${TREE_TRUNK_HEIGHT}px`,
                backgroundImage: `url(${TREE_TRUNK_SPRITE_PATH})`,
            backgroundSize: '100% 100%',
                // border: TREE_TRUNK_BORDER // Removed - using realistic trunk sprite instead
              }} />
              
              {/* Animated branch positioned relative to trunk within wrapper */}
              {segment.branchSide !== 'none' && (
                <BranchSprite
                  side={segment.branchSide}
                  style={{
                    position: 'absolute',
                    left: segment.branchSide === 'left' ? `-${BRANCH_SPRITE_WIDTH}px` : `${BRANCH_SPRITE_WIDTH}px`,
                    bottom: `${ANIMATED_BRANCH_OFFSET}px`
                  }}
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}