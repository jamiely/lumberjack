// Tree Trunk Dimensions & Positioning
export const TREE_TRUNK_WIDTH = 150;
export const TREE_TRUNK_HEIGHT = Math.floor(173 * 0.9); // 90% of player height = 69px
export const TREE_TRUNK_LEFT_POSITION = 195;
export const TREE_TRUNK_BOTTOM_OFFSET = 86;
export const TREE_SEGMENT_VERTICAL_SPACING = TREE_TRUNK_HEIGHT - 4; // Significant overlap to eliminate gaps
export const TREE_TRUNK_SPRITE_PATH = './images/trunk.png';
export const TREE_TRUNK_BORDER = '4px solid #000';

// Branch Dimensions & Positioning
export const BRANCH_WIDTH = 150;
export const BRANCH_HEIGHT = 86;
export const BRANCH_LEFT_POSITION = 45;
export const BRANCH_RIGHT_POSITION = 325;
export const BRANCH_VERTICAL_OFFSET = Math.floor((TREE_TRUNK_HEIGHT - BRANCH_HEIGHT) / 2) + TREE_TRUNK_BOTTOM_OFFSET; // Center branch on trunk
export const BRANCH_COLOR = '#654321';
export const BRANCH_BORDER = '4px solid #000';

// Branch Sprite Constants
export const BRANCH_SPRITE_PATH = './images/branch.png';
export const BRANCH_SPRITE_WIDTH = 170; // Display width (50% of original 340px)
export const BRANCH_SPRITE_HEIGHT = 124; // Display height (170 * 248/340 = 124px)

// Background Sprite Constants
export const BACKGROUND_SPRITE_PATH = './images/background.png';
export const BACKGROUND_SPRITE_WIDTH = 540; // Full game board width
export const BACKGROUND_SPRITE_HEIGHT = 960; // Full game board height

// Grass Sprite Constants
export const GRASS_SPRITE_PATH = './images/grass.png';
export const GRASS_SPRITE_WIDTH = 540; // Full game board width
export const GRASS_SPRITE_HEIGHT = 120; // Estimated height for grass area