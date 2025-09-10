import { useEffect, useRef, useState } from 'react'
import type { TreeSegment, AnimatedSegment } from '../game/GameState'

interface GameBoardProps {
  treeSegments: TreeSegment[]
  playerSide: 'left' | 'right'
  gameOver: boolean
  mode?: 'interactive' | 'static' | 'frozen'
  animatedSegments?: AnimatedSegment[]
  onRemoveAnimatedSegment?: (animationId: string) => void
}

export default function GameBoard({ 
  treeSegments, 
  playerSide, 
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

  const animationFrameRef = useRef<number>()
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
        const animationDuration = 1000 // 1 second for smoother motion
        const speed = 500 // pixels per second - balanced speed
        const distance = speed * (elapsed / 1000)
        
        // Remove segment if animation is complete or out of bounds
        if (elapsed > animationDuration) {
          onRemoveAnimatedSegment?.(segment.animationId)
        } else {
          // Check if segment has moved out of bounds (540px width + buffer)
          const currentX = segment.startPosition.x + (segment.direction === 'right' ? distance : -distance)
          if (currentX < -150 || currentX > 690) {
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
      width: '540px', 
      height: '960px', 
      backgroundColor: '#87CEEB',
      overflow: 'hidden',
      opacity: getOpacity(),
      pointerEvents: getPointerEvents()
    }}>
      {/* Tree segments */}
      {treeSegments.map((segment, index) => (
        <div key={index}>
          {/* Tree trunk segment */}
          <div style={{
            position: 'absolute',
            left: '236px',
            bottom: `${index * 115 + 38}px`,
            width: '67px',
            height: '115px',
            backgroundColor: '#8B4513',
            border: '2px solid #000'
          }} />
          
          {/* Branch */}
          {segment.branchSide !== 'none' && (
            <div style={{
              position: 'absolute',
              left: segment.branchSide === 'left' ? '169px' : '304px',
              bottom: `${index * 115 + 77}px`,
              width: '67px',
              height: '38px',
              backgroundColor: '#654321',
              border: '2px solid #000'
            }} />
          )}
        </div>
      ))}

      {/* Player */}
      <div style={{
        position: 'absolute',
        left: playerSide === 'left' ? '135px' : '337px',
        bottom: '38px',
        width: '40px',
        height: '77px',
        backgroundColor: gameOver ? 'red' : 'blue',
        border: '2px solid #000'
      }} />

      {/* Animated flying segments */}
      {animatedSegments.map(segment => {
        const elapsed = currentTime - segment.startTime
        const speed = 500 // pixels per second - match the animation loop speed
        const distance = speed * (elapsed / 1000)
        
        const currentX = segment.startPosition.x + (segment.direction === 'right' ? distance : -distance)
        const rotation = (elapsed * 0.36) % 360 // Smooth rotation - about 1 full rotation per second
        
        return (
          <div key={segment.animationId}>
            {/* Animated trunk segment */}
            <div style={{
              position: 'absolute',
              left: `${currentX}px`,
              bottom: `${segment.startPosition.y}px`,
              width: '67px',
              height: '115px',
              backgroundColor: '#8B4513',
              border: '2px solid #000',
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center',
              zIndex: 10
            }} />
            
            {/* Animated branch if exists */}
            {segment.branchSide !== 'none' && (
              <div style={{
                position: 'absolute',
                left: `${currentX + (segment.branchSide === 'left' ? -67 : 67)}px`,
                bottom: `${segment.startPosition.y + 39}px`,
                width: '67px',
                height: '38px',
                backgroundColor: '#654321',
                border: '2px solid #000',
                transform: `rotate(${rotation}deg)`,
                transformOrigin: 'center',
                zIndex: 10
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}