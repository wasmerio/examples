# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### ✨ Added

#### Type System Architecture

- **Centralized Type Definitions**: Created dedicated `src/types/` directory
  exclusively for TypeScript type definitions
- **Comprehensive Type Coverage**: Added organized type definitions across
  multiple domains:
  - `common.ts` - Utility types (ID, Nullable, AsyncState, LoadingState, etc.)
  - `api.ts` - API-related types (ApiResponse, HttpMethod, PaginationParams,
    etc.)
  - `ui.ts` - UI component types (ButtonProps, DialogProps, SelectProps, etc.)
  - `page.ts` - Page and metadata types (PageMeta, SiteConfig, SEO types, etc.)
  - `environment.ts` - Environment and configuration types
  - `index.ts` - Central export hub for all type definitions

#### Development Safety

- **ESLint Type Enforcement**: Custom ESLint rules preventing non-type code in
  `src/types/` directory
- **Runtime Code Prevention**: Rules blocking functions, classes, and variables
  in type files
- **Named Export Enforcement**: Requirement for named exports only (no default
  exports)
- **Architectural Consistency**: Automated enforcement of type-only architecture

### 🔧 Fixed

#### Type Safety Issues

- **Global Type Extensions**: Resolved modifier conflicts in `ImportMetaEnv` and
  `ProcessEnv` extensions
- **React Type Integration**: Fixed React component type imports and references
- **Browser API Types**: Corrected global type references (Event, MouseEvent,
  SVGElement, etc.)
- **ESLint Configuration**: Resolved TypeScript compilation errors across all
  type files

### 🔄 Changed

#### Code Organization

- **Type Import Patterns**: Simplified imports using centralized `@/types`
  exports
- **Developer Experience**: Enhanced IntelliSense and autocompletion through
  better type structure
- **Maintainability**: Clear separation of type definitions from implementation
  code

---

## [0.2.0] - 2025-08-11

### ✨ Added

#### Development Environment

- **ESLint Integration**: Complete ESLint setup with TypeScript, React, and
  Astro support
- **Prettier Integration**: Automatic code formatting with save-on-format in
  VSCode
- **Vitest Test Framework**: Unit testing with React Testing Library and jsdom
  environment
- **GitHub Actions CI/CD**: Comprehensive pipeline with code quality, testing,
  and multi-environment builds
- **Dependency Updates**: Automated weekly dependency update workflow

#### Testing

- Vitest configuration with Astro integration
- Sample tests for utility functions and React components
- Test commands: `test`, `test:run`, `test:ui`, `test:coverage`

#### Code Quality

- ESLint with modern flat config format
- Prettier with Astro plugin support
- VSCode workspace settings for automatic formatting
- Pre-configured recommended extensions

#### CI/CD

- Multi-node version testing (20.x, 22.x)
- Multi-environment builds (development, staging, production)
- Security audit integration
- Build artifact preservation
- Automated dependency updates with PR creation

### 🔧 Fixed

#### Type Safety

- **Sentry API Update**: Replaced deprecated `getCurrentHub()` with
  `getClient()`
- **Type Definitions**: Removed all `any` types in favor of specific type
  definitions
- **TypeScript Errors**: Resolved all compilation errors for production-ready
  code

#### Code Quality

- **ESLint Configuration**: Fixed Astro file parsing with proper plugin
  configuration
- **Prettier Formatting**: Unified code style across all file types
- **Import Resolution**: Proper module resolution for test environment

### 🔄 Changed

#### Configuration

- **Node.js Version**: Updated engine requirement from `>=20.9.0 <21.0.0` to
  `>=20.9.0`
- **Package Scripts**: Added comprehensive test and code quality scripts
- **Volta Configuration**: Updated to Node.js 24.4.1 for development consistency

#### Dependencies

- Added testing libraries: `vitest`, `@testing-library/react`, `jsdom`
- Added development tools: `eslint`, `prettier-plugin-astro`, `@vitest/ui`
- Updated Sentry integration to use modern API patterns

### 📚 Documentation

- Enhanced VSCode workspace configuration
- Added comprehensive test examples
- Detailed CI/CD workflow documentation

### 🛠️ Technical Improvements

#### Performance

- Optimized ESLint configuration with proper file exclusions
- Efficient test setup with minimal overhead
- Fast CI/CD pipeline with proper caching

#### Maintainability

- Consistent code formatting across all file types
- Comprehensive error handling in CI/CD workflows
- Modular test structure for easy expansion

---

## [0.1.0] - Initial Release

### ✨ Added

- Astro v5 with React integration
- TailwindCSS v4 with modern utility classes
- shadcn/ui component library
- TypeScript configuration with strict mode
- Sentry error tracking integration
- Environment-specific build configurations
- HTML formatting plugin for build optimization
- Comprehensive project documentation

### 🎯 Features

- Multi-environment support (development, staging, production)
- Custom path aliases with `@/` prefix
- Asset URL customization for CDN integration
- Responsive design with Tailwind CSS
- Modern React 19 integration
- Type-safe development environment
