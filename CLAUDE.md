# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Type
This is a Vite + TypeScript + React application with Vitest and React Testing Library.

## Essential Commands

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Lint, TypeScript compilation + production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Run ESLint and auto-fix issues

### Testing
- `npm test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode (recommended for development)
- `npm run test:coverage` - Run tests with coverage report
- `vitest src/specific-file.test.tsx` - Run a single test file

## Architecture Overview

### Build System
- **Vite**: Modern build tool with ESM support and fast HMR
- **React Plugin**: `@vitejs/plugin-react` for JSX transformation and Fast Refresh
- **TypeScript**: Strict configuration with bundler module resolution and React JSX support
- **ESLint**: Modern v9 flat config with React/TypeScript presets and accessibility rules
- **ESM-only**: Project uses `"type": "module"` in package.json

### React Setup
- **React 19**: Latest React with concurrent features
- **TypeScript JSX**: Configured with `"jsx": "react-jsx"` for modern JSX transform
- **Modular Architecture**: Game logic, UI components, and custom hooks separated
- **Entry Point**: `src/main.tsx` renders App component into DOM

### Testing Setup
- **Vitest**: Jest-compatible testing framework optimized for Vite
- **React Testing Library**: Component testing with user-centric queries
- **jsdom environment**: Configured for DOM and React component testing
- **Global test utilities**: `describe`, `it`, `expect` available without imports
- **Testing Library matchers**: `@testing-library/jest-dom` matchers extended globally
- **Test setup**: `src/__tests__/setup.ts` configures React Testing Library cleanup and matchers

### Project Structure
- `src/main.tsx` - React application entry point with StrictMode
- `src/App.tsx` - Main App component with high-level orchestration
- `src/game/` - Game logic modules (GameState, GameLogic, TreeSystem)
- `src/components/` - Reusable UI components (GameBoard, ScoreDisplay, DebugPanel)
- `src/hooks/` - Custom React hooks (useGameState, useKeyboardInput)
- `src/__tests__/` - Integration tests and test setup
- `src/**/*.test.tsx` - Unit tests co-located with source files
- `vite.config.ts` - Contains both Vite and Vitest configuration with React plugin
- `eslint.config.js` - ESLint v9 flat configuration

## Development Notes

### TypeScript Configuration
- Strict mode enabled with additional linting rules
- React JSX transformation enabled
- Bundler module resolution for Vite compatibility
- No emit (compilation handled by Vite)
- Targets ES2022 with DOM types included
- Testing types included for Vitest and Testing Library

### React Patterns
- **Modular Architecture**: Separation of concerns with dedicated modules
  - Pure game logic functions in `src/game/` (no React dependencies)
  - Reusable UI components in `src/components/` with typed props
  - Custom hooks in `src/hooks/` for state management and side effects
- **Component Design**: Functional components with TypeScript interfaces for props
- **State Management**: Custom hooks encapsulate state logic (useGameState)
- **Event Handling**: Dedicated hooks for side effects (useKeyboardInput)
- **Component co-location**: Tests placed alongside source files using `.test.tsx` suffix

### Testing Patterns
- **Comprehensive Test Coverage**: Unit, integration, and component tests
- **React Testing Library**: Component testing with user-centric queries
- **User Event Testing**: Test interactions with `@testing-library/user-event` 
- **Testing Strategy**:
  - Unit tests for pure functions in `src/game/`
  - Component tests for UI components in `src/components/`
  - Hook tests for custom hooks in `src/hooks/`
  - Integration tests for complete user workflows in `src/__tests__/`
- **Best Practices**:
  - Focus on testing behavior, not implementation details
  - Use semantic queries (`getByRole`, `getByLabelText`, etc.)
  - Test user interactions and state changes
  - Mock external dependencies appropriately
- **Test Organization**: Tests co-located with source files using `.test.tsx` suffix
- **Quality Gates**: Before committing, ensure all tests and lint pass