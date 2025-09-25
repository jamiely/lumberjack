
/**
 * Game timing and scoring constants
 */
export const GAME = {
  TIME_ADDED_PER_CHOP_SEC: 0.25,
  TIMER_UPDATE_INTERVAL_MS: 100,
  TIMER_WARNING_THRESHOLD_SEC: 1,
  MAX_TIME_SEC: 5.0,
  INITIAL_TIME_REMAINING_SEC: 5.0, // Derived from MAX_TIME_SEC
  CHOPPING_STATE_DURATION_MS: 200,
} as const;

/**
 * UI dimensions and layout constants
 */
export const UI = {
  // Game Board Dimensions
  GAME_BOARD_WIDTH: 540,
  GAME_BOARD_HEIGHT: 960,
  GAME_BOARD_BACKGROUND_COLOR: '#87CEEB',
  
  // Player Dimensions & Positioning  
  PLAYER_WIDTH: 90,
  PLAYER_HEIGHT: 173,
  PLAYER_BOTTOM_OFFSET: 86,
  PLAYER_LEFT_POSITION: 90,
  PLAYER_RIGHT_POSITION: 390,
  
  // UI Layout Constants
  TIMER_BAR_HEIGHT: 20,
  DEBUG_PANEL_MARGIN_TOP: 20,
  DEBUG_PANEL_PADDING: 15,
  DEBUG_PANEL_FONT_SIZE: 12,
} as const;

/**
 * Animation timing and movement constants
 */
export const ANIMATION = {
  ANIMATION_DURATION: 1000,
  ANIMATION_SPEED: 1125,
  ANIMATION_OUT_OF_BOUNDS_LEFT: -338,
  ANIMATION_OUT_OF_BOUNDS_RIGHT: 1553,
  ANIMATED_BRANCH_OFFSET: 33,
} as const;

/**
 * Tree, branch, and sprite constants
 */
export const TREE = {
  // Tree Trunk
  TREE_TRUNK_WIDTH: 150,
  TREE_TRUNK_HEIGHT: Math.floor(173 * 0.9), // 90% of player height
  TREE_TRUNK_LEFT_POSITION: 195,
  TREE_TRUNK_BOTTOM_OFFSET: 86,
  TREE_SEGMENT_VERTICAL_SPACING: Math.floor(173 * 0.9) - 4, // TREE_TRUNK_HEIGHT - 4
  TREE_TRUNK_SPRITE_PATH: './images/trunk.png',
  TREE_TRUNK_BORDER: '4px solid #000',
  
  // Branches
  BRANCH_WIDTH: 150,
  BRANCH_HEIGHT: 86,
  BRANCH_LEFT_POSITION: 45,
  BRANCH_RIGHT_POSITION: 325,
  BRANCH_VERTICAL_OFFSET: Math.floor((Math.floor(173 * 0.9) - 86) / 2) + 86, // Center branch on trunk
  BRANCH_COLOR: '#654321',
  BRANCH_BORDER: '4px solid #000',
  
  // Sprite Paths and Dimensions
  BRANCH_SPRITE_PATH: './images/branch.png',
  BRANCH_SPRITE_WIDTH: 170,
  BRANCH_SPRITE_HEIGHT: 124,
  BACKGROUND_SPRITE_PATH: './images/background.png',
  BACKGROUND_SPRITE_WIDTH: 540,
  BACKGROUND_SPRITE_HEIGHT: 960,
  GRASS_SPRITE_PATH: './images/grass.png',
  GRASS_SPRITE_WIDTH: 540,
  GRASS_SPRITE_HEIGHT: 120,
} as const;

/**
 * Scaling configuration objects
 */
export const SCALING = {
  DEFAULT_OPTIONS: {
    strategy: 'fit-to-screen' as const,
    minScale: 0.1,
    maxScale: 10,
    maintainAspectRatio: true,
  },
  DEVELOPMENT_OPTIONS: {
    strategy: 'fit-to-screen' as const,
    minScale: 0.5,
    maxScale: 3,
    maintainAspectRatio: true,
  },
  ARCADE_OPTIONS: {
    strategy: 'fit-to-screen' as const,
    minScale: 1,
    maxScale: 2,
    maintainAspectRatio: true,
  },
};