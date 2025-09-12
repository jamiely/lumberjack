// Game Board Dimensions
export const GAME_BOARD_WIDTH = 540;
export const GAME_BOARD_HEIGHT = 960;
export const GAME_BOARD_BACKGROUND_COLOR = '#87CEEB';

// Player Dimensions & Positioning
export const PLAYER_WIDTH = 90;
export const PLAYER_HEIGHT = 173;
export const PLAYER_BOTTOM_OFFSET = 86;
export const PLAYER_LEFT_POSITION = 90;
export const PLAYER_RIGHT_POSITION = 390;

// Tree Segment Dimensions & Positioning
export const TREE_TRUNK_WIDTH = 150;
export const TREE_TRUNK_HEIGHT = Math.floor(PLAYER_HEIGHT * 0.9); // 90% of player height = 69px
export const TREE_TRUNK_LEFT_POSITION = 195;
export const TREE_TRUNK_BOTTOM_OFFSET = 86;
export const TREE_SEGMENT_VERTICAL_SPACING = TREE_TRUNK_HEIGHT - 4; // Significant overlap to eliminate gaps
export const TREE_TRUNK_SPRITE_PATH = '/images/trunk.png';
// export const TREE_TRUNK_COLOR = '#8B4513'; // Deprecated - using trunk sprite instead
export const TREE_TRUNK_BORDER = '4px solid #000';

// Branch Dimensions & Positioning
export const BRANCH_WIDTH = 150;
export const BRANCH_HEIGHT = 86;
export const BRANCH_LEFT_POSITION = 45;
export const BRANCH_RIGHT_POSITION = 345;
export const BRANCH_VERTICAL_OFFSET = Math.floor((TREE_TRUNK_HEIGHT - BRANCH_HEIGHT) / 2) + TREE_TRUNK_BOTTOM_OFFSET; // Center branch on trunk
export const BRANCH_COLOR = '#654321';
export const BRANCH_BORDER = '4px solid #000';

// Branch Sprite Constants
export const BRANCH_SPRITE_PATH = '/images/branch.png';
export const BRANCH_SPRITE_WIDTH = 170; // Display width (50% of original 340px)
export const BRANCH_SPRITE_HEIGHT = 124; // Display height (170 * 248/340 = 124px)

// Animation Constants
export const ANIMATION_DURATION = 1000; // 1 second
export const ANIMATION_SPEED = 1125; // pixels per second
export const ANIMATION_OUT_OF_BOUNDS_LEFT = -338;
export const ANIMATION_OUT_OF_BOUNDS_RIGHT = 1553;
export const ANIMATED_BRANCH_OFFSET = 33; // For animated segments, position branch relative to trunk

// Game Logic Constants
export const TIME_ADDED_PER_CHOP_SEC = 0.25;
export const TIMER_UPDATE_INTERVAL_MS = 100;
export const TIMER_WARNING_THRESHOLD_SEC = 1;
export const MAX_TIME_SEC = 5.0;
export const INITIAL_TIME_REMAINING_SEC = MAX_TIME_SEC;

// UI Constants
export const TIMER_BAR_HEIGHT = 20;
export const DEBUG_PANEL_MARGIN_TOP = 20;
export const DEBUG_PANEL_PADDING = 15;
export const DEBUG_PANEL_FONT_SIZE = 12;

// Grass Sprite Constants
export const GRASS_SPRITE_PATH = '/images/grass.png';
export const GRASS_SPRITE_WIDTH = 540; // Full game board width
export const GRASS_SPRITE_HEIGHT = 120; // Estimated height for grass area

// Sprite Constants
export const SPRITE_SHEET_PATH = '/images/lumberjack.png';
export const SPRITE_SOURCE_SIZE = 1023; // Original sprite sheet dimension
export const SPRITE_INDIVIDUAL_SIZE = 341; // Individual sprite size

// Flexible sprite scaling options - adjust SPRITE_DISPLAY_SIZE to change sprite size
export const SPRITE_DISPLAY_SIZE = 220; // Desired sprite display size (adjustable for different needs)
// Available sizes: 150 (compact), 200 (standard), 220 (enhanced), 250 (large), 300 (arcade)

export const SPRITE_SCALE_FACTOR = SPRITE_DISPLAY_SIZE / SPRITE_INDIVIDUAL_SIZE;
export const SPRITE_SCALED_SHEET_SIZE = Math.floor(SPRITE_SOURCE_SIZE * SPRITE_SCALE_FACTOR);

// Player dimensions for sprite-based rendering (wider to accommodate full sprite)
export const SPRITE_PLAYER_WIDTH = SPRITE_DISPLAY_SIZE; // Full sprite width
export const SPRITE_PLAYER_HEIGHT = PLAYER_HEIGHT; // Keep same height for game balance

// Position adjustments for game balance
export const SPRITE_CENTERING_OFFSET = (SPRITE_PLAYER_WIDTH - PLAYER_WIDTH) / 2; // Offset to center sprite over original position

// Sprite coordinates (x1, y1, x2, y2) - adjusted for clean cropping
export const SPRITE_COORDS = {
  idle: [0, 0, 341, 341],
  chopping: [0, 406, 341, 747], // Shifted down 65px total to eliminate all feet pixels
  hit: [0, 780, 341, 1121] // Back to original width, will use clip-path for precise cropping
} as const;

// Player state timing
export const CHOPPING_STATE_DURATION_MS = 200;