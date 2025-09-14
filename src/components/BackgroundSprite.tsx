import React from 'react';
import { BACKGROUND_SPRITE_PATH, BACKGROUND_SPRITE_WIDTH, BACKGROUND_SPRITE_HEIGHT } from '../config/treeConfig';

interface BackgroundSpriteProps {
  className?: string;
  style?: React.CSSProperties;
}

export const BackgroundSprite: React.FC<BackgroundSpriteProps> = ({ className, style }) => {
  return (
    <div
      className={className}
      style={{
        width: BACKGROUND_SPRITE_WIDTH,
        height: BACKGROUND_SPRITE_HEIGHT,
        overflow: 'hidden',
        ...style
      }}
    >
      <img 
        src={BACKGROUND_SPRITE_PATH}
        alt="Forest Background"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
      />
    </div>
  );
};