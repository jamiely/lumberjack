import React from 'react';
import { TREE } from '../config/constants';

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
        width: TREE.BRANCH_SPRITE_WIDTH,
        height: TREE.BRANCH_SPRITE_HEIGHT,
        backgroundImage: `url(${TREE.BRANCH_SPRITE_PATH})`,
        backgroundSize: 'cover',
        transform,
        transformOrigin,
        ...style
      }}
    />
  );
};