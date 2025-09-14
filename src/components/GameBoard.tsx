import type { TreeSegment, AnimatedSegment } from '../game/GameState'
import Player from './Player'
import type { CharacterType } from '../characters'
import { BranchSprite } from './BranchSprite'
import { GrassSprite } from './GrassSprite'
import { BackgroundSprite } from './BackgroundSprite'
import { useAnimationSystem } from '../hooks/useAnimationSystem'
import {
  GAME_BOARD_WIDTH,
  GAME_BOARD_HEIGHT,
  PLAYER_BOTTOM_OFFSET,
  PLAYER_LEFT_POSITION,
  PLAYER_RIGHT_POSITION
} from '../config/uiConfig'
import {
  TREE_TRUNK_WIDTH,
  TREE_TRUNK_HEIGHT,
  TREE_TRUNK_LEFT_POSITION,
  TREE_TRUNK_BOTTOM_OFFSET,
  TREE_SEGMENT_VERTICAL_SPACING,
  TREE_TRUNK_SPRITE_PATH,
  BRANCH_LEFT_POSITION,
  BRANCH_RIGHT_POSITION,
  BRANCH_VERTICAL_OFFSET,
  BRANCH_SPRITE_WIDTH
} from '../config/treeConfig'
import { ANIMATED_BRANCH_OFFSET } from '../config/animationConfig'

interface GameBoardProps {
  treeSegments: TreeSegment[]
  playerSide: 'left' | 'right'
  playerState: 'idle' | 'chopping' | 'hit'
  gameOver: boolean
  mode?: 'interactive' | 'static' | 'frozen'
  animatedSegments?: AnimatedSegment[]
  characterType?: CharacterType | null
}

export default function GameBoard({ 
  treeSegments, 
  playerSide,
  playerState,
  gameOver, 
  mode = 'interactive',
  animatedSegments = [],
  characterType
}: GameBoardProps) {
  const getOpacity = () => {
    if (mode === 'frozen') return 0.7
    if (mode === 'static') return 0.8
    return 1
  }

  const getPointerEvents = () => {
    return mode === 'interactive' ? 'auto' : 'none'
  }

  const { animationData } = useAnimationSystem(animatedSegments)

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

      {/* Branches - render behind trunk */}
      {treeSegments.map((segment, index) => (
        segment.branchSide !== 'none' && (
          <BranchSprite
            key={`branch-${index}`}
            side={segment.branchSide}
            style={{
              position: 'absolute',
              left: segment.branchSide === 'left' ? `${BRANCH_LEFT_POSITION}px` : `${BRANCH_RIGHT_POSITION}px`,
              bottom: `${index * TREE_SEGMENT_VERTICAL_SPACING + BRANCH_VERTICAL_OFFSET}px`,
              zIndex: 1 // Behind trunk
            }}
          />
        )
      ))}

      {/* Tree trunk segments - render on top of branches */}
      {treeSegments.map((_, index) => (
        <div 
          key={`trunk-${index}`}
          style={{
            position: 'absolute',
            left: `${TREE_TRUNK_LEFT_POSITION}px`,
            bottom: `${index * TREE_SEGMENT_VERTICAL_SPACING + TREE_TRUNK_BOTTOM_OFFSET}px`,
            width: `${TREE_TRUNK_WIDTH}px`,
            height: `${TREE_TRUNK_HEIGHT}px`,
            backgroundImage: `url(${TREE_TRUNK_SPRITE_PATH})`,
            backgroundSize: '100% 140%',
            zIndex: 2 // On top of branches
            // border: TREE_TRUNK_BORDER // Removed - using realistic trunk sprite instead
          }} 
        />
      ))}

      {/* Player */}
      <Player 
        playerSide={playerSide}
        playerState={playerState}
        gameOver={gameOver}
        leftPosition={PLAYER_LEFT_POSITION}
        rightPosition={PLAYER_RIGHT_POSITION}
        bottomOffset={PLAYER_BOTTOM_OFFSET}
        characterType={characterType || 'lumberjack2'}
      />

      {/* Animated flying segments */}
      {animationData.map(animatedSegment => {
        return (
          <div key={animatedSegment.animationId}>
            {/* Wrapper div for rotating trunk+branch as single unit */}
            <div style={{
              position: 'absolute',
              left: `${animatedSegment.currentX}px`,
              bottom: `${animatedSegment.startPosition.y}px`,
              transform: `rotate(${animatedSegment.rotation}deg)`,
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
                backgroundSize: '100% 100%'
              }} />
              
              {/* Animated branch positioned relative to trunk within wrapper */}
              {animatedSegment.branchSide !== 'none' && (
                <BranchSprite
                  side={animatedSegment.branchSide}
                  style={{
                    position: 'absolute',
                    left: animatedSegment.branchSide === 'left' ? `-${BRANCH_SPRITE_WIDTH}px` : `${BRANCH_SPRITE_WIDTH}px`,
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