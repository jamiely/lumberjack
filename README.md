# Lumberjack

A modern React-based [Timberman](https://apps.apple.com/us/app/timberman/id871809581) clone.

![Game Screenshot](docs/game-screenshot.png)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

## Development

### Tech Stack
- **React 19** - Modern React with concurrent features
- **TypeScript** - Strict type checking with React JSX support
- **Vite** - Fast build tool with HMR and ESM support
- **Vitest** - Jest-compatible testing framework
- **React Testing Library** - Component testing utilities
- **Playwright** - End-to-end testing framework
- **ESLint** - Code quality with React/TypeScript presets

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Lint, TypeScript check, and production build |
| `npm run preview` | Preview production build locally |
| `npm run check` | Run complete quality checks (typecheck, tests, lint, e2e) |
| `npm run lint` | Run ESLint code quality checks |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm test` | Run all unit/integration tests once |
| `npm run test:watch` | Run unit/integration tests in watch mode |
| `npm run test:coverage` | Run unit/integration tests with coverage report |
| `npm run test:e2e` | Run Playwright end-to-end tests (non-interactive) |
| `npm run test:e2e:ui` | Run Playwright tests with interactive UI |
| `npm run test:e2e:html` | Run Playwright tests with HTML report |

### Development Patterns

- **Scene-Based Architecture**: Professional game flow with Attract/Play/GameOver screens
- **Modular Game Logic**: Pure functions separated from React components
- **Custom Hooks**: Encapsulated state and side effects (`useGameState`, `useKeyboardInput`)
- **Comprehensive Testing**: Unit, component, integration, and end-to-end tests
- **Type Safety**: Strict TypeScript configuration with React JSX transform

### Tests

#### Test Execution

```bash
# Run all unit/integration tests
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run end-to-end tests (requires dev server)
npm run test:e2e

# Run E2E tests with interactive UI
npm run test:e2e:ui

# Run E2E tests with HTML report
npm run test:e2e:html
```

#### Special Testing Features
- **Deterministic Test Mode**: Add `?testMode=true` to URL for predictable game behavior in E2E tests
- **Debug Mode**: Press `?` key in game to view internal state and collision detection
- **Accessibility Testing**: All components tested with screen readers and keyboard navigation

### Code Quality

- ESLint v9 flat configuration with React and accessibility rules
- TypeScript strict mode with additional linting
- Automated formatting and quality checks on build

## Contributing

### Development Workflow
1. **Install dependencies**: `npm install`
2. **Start dev server**: `npm run dev`
3. **Run tests during development**: `npm run test:watch`

### Before Committing
1. **Run comprehensive checks**: `npm run check` (includes typecheck, tests, lint, and e2e)
2. **Or run individual checks**:
   - **Run all tests**: `npm test` and `npm run test:e2e`
   - **Check code quality**: `npm run lint`
   - **Verify TypeScript compilation**: `npm run build`
   - **Check test coverage**: `npm run test:coverage`

### Testing Requirements
- Unit tests must pass with >90% coverage
- All E2E tests must pass
- New features require corresponding test coverage

The project uses modern ESM-only configuration and requires Node.js with ES2022 support.

## Game Features

- **Scene-Based Navigation**: Professional game flow with attract screen, gameplay, and game over
- **Score Persistence**: High scores saved to localStorage across sessions
- **Collision Detection**: Real-time branch collision with immediate game over
- **Debug Mode**: Press `?` to view game state, player position, and tree segments
- **Keyboard Controls**: Left Arrow/Right Arrow keys for chopping, `?` for debug, `r` for reset
- **Touch/Click Controls**: Click or tap left/right side of screen to chop on that side
- **Auto-Return**: Game over screen automatically returns to attract after 5 seconds
- **Responsive Design**: Works on desktop and mobile devices

### Character Selection

Choose your lumberjack sprite using the `character` query parameter:

- **Lumberjack 1** (default): `?character=lumberjack1`
- **Lumberjack 2**: `?character=lumberjack2`
- **Lumberjack 3**: `?character=lumberjack3`
- **Lumberjack 4**: `?character=lumberjack4`

Examples:
```
http://localhost:5173/?character=lumberjack1
http://localhost:5173/?character=lumberjack2
http://localhost:5173/?character=lumberjack3
http://localhost:5173/?character=lumberjack4
```

If no character is specified or an invalid character is provided, a random character will be selected.

## Credit

* [Summer sunday background theme](https://opengameart.org/content/summer-sunday)
* [NES 8-bit sound effects](https://opengameart.org/content/nes-8-bit-sound-effects)
