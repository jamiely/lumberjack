import React from 'react';
import { GRASS_SPRITE_PATH, GRASS_SPRITE_WIDTH, GRASS_SPRITE_HEIGHT } from '../config/treeConfig';

interface GrassSpriteProps {
  className?: string;
  style?: React.CSSProperties;
}

export const GrassSprite: React.FC<GrassSpriteProps> = ({ className, style }) => {
  return (
    <div
      className={className}
      style={{
        width: GRASS_SPRITE_WIDTH,
        height: GRASS_SPRITE_HEIGHT,
        overflow: 'hidden',
        ...style
      }}
    >
      <img 
        src={GRASS_SPRITE_PATH}
        alt="Grass"
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