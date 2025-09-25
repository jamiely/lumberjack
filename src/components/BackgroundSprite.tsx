import React from 'react';
import { TREE } from '../config/constants';

interface BackgroundSpriteProps {
  className?: string;
  style?: React.CSSProperties;
}

export const BackgroundSprite: React.FC<BackgroundSpriteProps> = ({ className, style }) => {
  return (
    <div
      className={className}
      style={{
        width: TREE.BACKGROUND_SPRITE_WIDTH,
        height: TREE.BACKGROUND_SPRITE_HEIGHT,
        overflow: 'hidden',
        ...style
      }}
    >
      <img 
        src={TREE.BACKGROUND_SPRITE_PATH}
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