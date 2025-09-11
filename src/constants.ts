// Game Board Dimensions
export const GAME_BOARD_WIDTH = 540;
export const GAME_BOARD_HEIGHT = 960;
export const GAME_BOARD_BACKGROUND_COLOR = '#87CEEB';

// Player Dimensions & Positioning
export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 77;
export const PLAYER_BOTTOM_OFFSET = 38;
export const PLAYER_LEFT_POSITION = 135;
export const PLAYER_RIGHT_POSITION = 337;

// Tree Segment Dimensions & Positioning
export const TREE_TRUNK_WIDTH = 67;
export const TREE_TRUNK_HEIGHT = Math.floor(PLAYER_HEIGHT * 0.9); // 90% of player height = 69px
export const TREE_TRUNK_LEFT_POSITION = 236;
export const TREE_TRUNK_BOTTOM_OFFSET = 38;
export const TREE_SEGMENT_VERTICAL_SPACING = TREE_TRUNK_HEIGHT;
export const TREE_TRUNK_COLOR = '#8B4513';
export const TREE_TRUNK_BORDER = '2px solid #000';

// Branch Dimensions & Positioning
export const BRANCH_WIDTH = 67;
export const BRANCH_HEIGHT = 38;
export const BRANCH_LEFT_POSITION = 169;
export const BRANCH_RIGHT_POSITION = 304;
export const BRANCH_VERTICAL_OFFSET = Math.floor((TREE_TRUNK_HEIGHT - BRANCH_HEIGHT) / 2) + TREE_TRUNK_BOTTOM_OFFSET; // Center branch on trunk
export const BRANCH_COLOR = '#654321';
export const BRANCH_BORDER = '2px solid #000';

// Animation Constants
export const ANIMATION_DURATION = 1000; // 1 second
export const ANIMATION_SPEED = 500; // pixels per second
export const ANIMATION_OUT_OF_BOUNDS_LEFT = -150;
export const ANIMATION_OUT_OF_BOUNDS_RIGHT = 690;
export const ANIMATED_BRANCH_OFFSET = 15; // For animated segments, position branch relative to trunk

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