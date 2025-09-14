import React from 'react';
import { BRANCH_SPRITE_PATH, BRANCH_SPRITE_WIDTH, BRANCH_SPRITE_HEIGHT } from '../config/treeConfig';

interface BranchSpriteProps {
  side: 'left' | 'right';
  className?: string;
  style?: React.CSSProperties;
}

export const BranchSprite: React.FC<BranchSpriteProps> = ({ side, className, style }) => {
  const transform = side === 'left' ? 'scaleX(-1)' : undefined;
  const transformOrigin = side === 'left' ? 'bottom-left' : undefined;
  
  return (
    <div
      className={className}
      style={{
        width: BRANCH_SPRITE_WIDTH,
        height: BRANCH_SPRITE_HEIGHT,
        backgroundImage: `url(${BRANCH_SPRITE_PATH})`,
        backgroundSize: 'cover',
        transform,
        transformOrigin,
        ...style
      }}
    />
  );
};