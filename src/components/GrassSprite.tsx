import React from 'react';
import { TREE } from '../config/constants';

interface GrassSpriteProps {
  className?: string;
  style?: React.CSSProperties;
}

export const GrassSprite: React.FC<GrassSpriteProps> = ({ className, style }) => {
  return (
    <div
      className={className}
      style={{
        width: TREE.GRASS_SPRITE_WIDTH,
        height: TREE.GRASS_SPRITE_HEIGHT,
        overflow: 'hidden',
        ...style
      }}
    >
      <img 
        src={TREE.GRASS_SPRITE_PATH}
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