# Repository Guidelines

## Project Structure

This is a monorepo containing a Preact web application:

- `/apps/web/` - Main web application
  - `src/` - Source code (TypeScript/TSX files)
  - `public/` - Static assets
  - `dist/` - Build output directory
  - Configuration files: `vite.config.ts`, `tsconfig.*.json`, `eslint.config.js`
- `/.github/workflows/` - CI/CD pipelines for GitHub Pages deployment

The web app uses Preact + TypeScript + Vite stack with Mantine UI components, Zustand for state management, and Leaflet for maps.

## Build, Test, and Development Commands

All commands should be run from `/apps/web/` directory:

```bash
cd apps/web
```

**Development:**
- `npm run dev` - Start development server at http://localhost:5173/projekt30/

**Build:**
- `npm run build` - Typecheck and build the app into `/dist`
- `npm run preview` - Preview the production build locally

**Code Quality:**
- `npm run typecheck` - Run TypeScript type checking without building
- `npm run lint` - Run ESLint on source files
- `npm run prettier-check` - Check code formatting
- `npm run prettier-fix` - Fix code formatting issues

**Dependencies:**
- `npm install` - Install dependencies

## Coding Style & Naming Conventions

- **Language:** TypeScript with React/Preact patterns
- **Indentation:** 2 spaces
- **File extensions:** `.ts` for TypeScript, `.tsx` for React components
- **Naming:**
  - PascalCase for component files (`ComponentName.tsx`)
  - camelCase for utility functions and variables
  - UPPER_CASE for constants
- **Linting:** ESLint with TypeScript and React plugins
- **Formatting:** Prettier for consistent code style

## Testing Guidelines

Do not write tests for now.

## Commit & Pull Request Guidelines

Do not commit. Only use git to look into the commit history and for blaming.
