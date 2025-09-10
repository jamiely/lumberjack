import React from 'react'

interface ScreenContainerProps {
  children: React.ReactNode
  backgroundColor?: string
  className?: string
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  backgroundColor = '#000000',
  className = ''
}) => {
  return (
    <div 
      className={`screen-container ${className}`}
      style={{
        width: '540px',
        height: '960px',
        backgroundColor,
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}
    >
      {children}
    </div>
  )
}