# Repository Guidelines

## Project Structure & Module Organization
- `index.html`, `privacy.html`, `terms.html`, `refund.html`, and zone pages (for example `koramangala.html`) are top-level static entry points.
- `assets/` holds built CSS/JS and overrides like `assets/overrides.css`.
- `src/data/` stores JSON content such as `therapists.json` and `availability.json`.
- `src/__tests__/` contains Vitest suites like `dataIntegrity.test.js`.
- `netlify/functions/` includes serverless endpoints (`availability.js`, `availability-admin.js`).
- `scripts/build-static.mjs` builds the static output into `dist/`.
- `dist/` and `gh-pages/` are build artifacts; avoid manual edits.

## Build, Test, and Development Commands
- `npm run dev`: start the local Vite dev server for editing static pages.
- `npm run build`: generate the static site into `dist/` via `scripts/build-static.mjs`.
- `npm run preview`: preview the built output locally.
- `npm run lint` / `npm run lint:fix`: run ESLint on `src/` (and auto-fix when possible).
- `npm run format`: run Prettier on `src/**/*.{js,jsx,ts,tsx,json,css,md}`.
- `npm run test`, `npm run test:ui`, `npm run test:coverage`: run Vitest in CLI, UI, or coverage mode.

## Coding Style & Naming Conventions
- JavaScript/JSON in `src/` uses 2-space indentation, semicolons, and single quotes.
- Keep file names lowercase with hyphens for pages (for example `admin-availability.html`).
- Run `npm run format` before committing when editing `src/` or data files.

## Testing Guidelines
- Framework: Vitest.
- Tests live in `src/__tests__/` and follow `*.test.js` naming.
- Data integrity checks cover JSON schemas; update tests when modifying `src/data/*.json`.

## Commit & Pull Request Guidelines
- Commit messages are concise and imperative (for example `Add booking steps and CTA badge`); occasional `feat:` prefixes exist, so match the surrounding style.
- PRs should describe changes, list test commands run, and include screenshots when UI or content changes (especially for static HTML pages).
- Link related issues or tickets when applicable.

## Configuration & Deployment Notes
- Netlify settings live in `netlify.toml`; serverless code in `netlify/functions/`.
- Static deploy artifacts land in `dist/`; ensure it is rebuilt for releases.
