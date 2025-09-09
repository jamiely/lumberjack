# Lumberjack2

A modern React-based lumberjack game built with Vite, TypeScript, and comprehensive testing.

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
- **ESLint** - Code quality with React/TypeScript presets

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Lint, TypeScript check, and production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code quality checks |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

### Project Architecture

```
src/
├── main.tsx           # React app entry point
├── App.tsx           # Main app component
├── game/             # Pure game logic (no React)
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
└── __tests__/       # Integration tests
```

### Development Patterns

- **Modular Architecture**: Separation of game logic, UI, and state management
- **Custom Hooks**: Encapsulated state and side effects (`useGameState`, `useKeyboardInput`)
- **Comprehensive Testing**: Unit, component, and integration tests with React Testing Library
- **Type Safety**: Strict TypeScript configuration with React JSX transform

### Testing Strategy

- **Unit Tests**: Pure functions in `src/game/`
- **Component Tests**: UI components with user-centric queries
- **Hook Tests**: Custom hooks behavior
- **Integration Tests**: Complete user workflows
- **Coverage**: Run `npm run test:coverage` for detailed reports

Tests are co-located with source files using `.test.tsx` suffix.

### Code Quality

- ESLint v9 flat configuration with React and accessibility rules
- TypeScript strict mode with additional linting
- Automated formatting and quality checks on build

## Contributing

1. Ensure all tests pass: `npm test`
2. Check code quality: `npm run lint`
3. Verify TypeScript compilation: `npm run build`

The project uses modern ESM-only configuration and requires Node.js with ES2022 support.