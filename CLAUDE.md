# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this Vite + TypeScript + React game application.

## 🎯 CRITICAL WORKFLOW INSTRUCTIONS

### Essential Commands (ALWAYS use these)
- `npm run dev` - Start development server
- `npm run build` - Build for production (includes lint + TypeScript check)
- `npm run lint` - Check code quality 
- `npm run lint:fix` - Auto-fix linting issues
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode (recommended during development)

### Quality Gates (ALWAYS run before completing tasks)
2. **Run tests, linting, and e2e tests**: `npm run check` - NO test failures, linting errors, or e2e test failures allowed
3. **Run build**: `npm run build` - Build must succeed

## 📁 KEY PROJECT FILES AND THEIR PURPOSE

### Documentation Files (Do not include code line number references)
- `GAME_DESIGN.md` - Game specifications and design decisions (CONSULT when planning)
- `RESEARCH.md` - Research and context for current tasks (NO CODE ALLOWED). Shouldn't have any ambiguity when it is done. Used to create `PLAN.md`.
- `PLAN.md` - Implementation steps based on RESEARCH.md and file references for LLMs
- `QUESTIONS.md` - Questions needing user clarification

### Code Structure
- `src/main.tsx` - Application entry point
- `src/App.tsx` - Main app component
- `src/game/` - Pure game logic (no React dependencies)
- `src/components/` - Reusable UI components
- `src/hooks/` - Custom React hooks
- `src/__tests__/` - Integration tests

## 🛠️ DEVELOPMENT GUIDELINES

### Core Development Principles
1. **MVP First**: Implement minimum viable features first, expand later if needed
2. **Clean Architecture**: Maintain separation of concerns across modules
3. **Test-Driven**: Write tests for new functionality and ensure all tests pass
4. **Consult Documentation**: Always check `GAME_DESIGN.md` when planning features
5. **Update Documentation**: Keep `GAME_DESIGN.md` current after implementing features

### Code Organization Patterns
- **Pure Game Logic**: Keep `src/game/` modules React-free for testability
- **Component Design**: Use functional components with TypeScript interfaces
- **State Management**: Encapsulate state logic in custom hooks (`useGameState`)
- **Event Handling**: Use dedicated hooks for side effects (`useKeyboardInput`)
- **Test Co-location**: Place `.test.tsx` files alongside source files

### Testing Requirements
- **Strategy**: Unit tests for game logic, component tests for UI, integration tests for workflows
- **Tools**: Vitest + React Testing Library with user-centric queries
- **Best Practices**: Test behavior not implementation, use semantic queries, mock external dependencies
- **Coverage**: Ensure comprehensive test coverage for all new functionality

## 🏗️ TECHNICAL STACK

### Build & Development
- **Vite**: Modern build tool with fast HMR and ESM support
- **TypeScript**: Strict mode with React JSX and ES2022 target
- **ESLint**: v9 flat config with React/TypeScript presets
- **ESM-only**: Project uses `"type": "module"`

### Frontend Stack
- **React 19**: Latest with concurrent features
- **Functional Components**: TypeScript interfaces for props
- **Custom Hooks**: For state management and side effects
- **Modular Architecture**: Separated game logic, UI, and hooks

### Testing Stack
- **Vitest**: Jest-compatible, optimized for Vite
- **React Testing Library**: User-centric component testing
- **jsdom**: DOM environment for component tests
- **Global utilities**: `describe`, `it`, `expect` available without imports