# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Type
This is a Vite + TypeScript + React application with Vitest and React Testing Library.

## Essential Commands

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - TypeScript compilation + production build
- `npm run preview` - Preview production build locally

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
- **ESM-only**: Project uses `"type": "module"` in package.json

### React Setup
- **React 19**: Latest React with concurrent features
- **TypeScript JSX**: Configured with `"jsx": "react-jsx"` for modern JSX transform
- **Component Architecture**: Functional components with hooks
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
- `src/App.tsx` - Main App component
- `src/Counter.tsx` - Example React component with state management
- `src/*.test.tsx` - React component test files using Testing Library
- `src/__tests__/setup.ts` - Test environment configuration for React
- `vite.config.ts` - Contains both Vite and Vitest configuration with React plugin

## Development Notes

### TypeScript Configuration
- Strict mode enabled with additional linting rules
- React JSX transformation enabled
- Bundler module resolution for Vite compatibility
- No emit (compilation handled by Vite)
- Targets ES2022 with DOM types included
- Testing types included for Vitest and Testing Library

### React Patterns
- Functional components with TypeScript interfaces for props
- React hooks for state management (useState, useEffect, etc.)
- Component co-location: keep related components, tests, and styles together

### Testing Patterns
- Use React Testing Library for component testing
- Test user interactions with `@testing-library/user-event`
- Focus on testing behavior, not implementation details
- Use semantic queries (`getByRole`, `getByLabelText`, etc.)
- Component tests co-located with source files using `.test.tsx` suffix