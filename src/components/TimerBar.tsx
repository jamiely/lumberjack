import React from 'react'

interface TimerBarProps {
  timeRemaining: number
  maxTime: number
}

export const TimerBar: React.FC<TimerBarProps> = ({ timeRemaining, maxTime }) => {
  const percentage = (timeRemaining / maxTime) * 100
  const isLow = timeRemaining < 3 // Warning threshold
  
  return (
    <div style={{
      width: '100%',
      height: '20px',
      backgroundColor: '#333',
      border: '2px solid #fff'
    }}>
      <div style={{
        width: `${percentage}%`,
        height: '100%',
        backgroundColor: isLow ? '#ff4444' : '#44ff44',
        transition: 'width 0.1s ease-out'
      }} />
    </div>
  )
}