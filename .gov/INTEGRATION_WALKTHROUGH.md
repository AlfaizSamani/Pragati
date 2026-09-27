# PRAGATI Frontend + Backend Integration Walkthrough

This file is the chronological checklist for connecting the current Vite frontend to the backend repository and validating the result.

## 1. Baseline and workspace safety

- [x] Inspect the current frontend structure, scripts, routes, and working-tree state.
- [x] Create this walkthrough before integration changes.
- [x] Record the baseline build result and current runtime errors.

## 2. Backend acquisition and deployment alignment

- [x] Clone `https://github.com/AlfaizSamani/Pragati.git` into a sibling `Pragati-backend` directory.
- [x] Inspect the backend entrypoint, requirements, environment variables, Supabase schema/RLS, and deployment files.
- [x] Reconcile the uploaded deployment instructions with the actual repository layout.
- [x] Start the backend locally with non-secret configuration and verify health/API documentation.

## 3. Frontend data and route audit

- [x] Inventory every mock/static data source and every API call already present.
- [ ] Map each page/component value to a backend endpoint or a clearly defined derived response field.
- [ ] Map every remaining button, link, tab, filter, modal action, export action, and navigation control to a valid destination/action.
- [ ] Identify incomplete components by comparing their states with completed pages and shared design conventions.

## 4. Integration implementation

- [x] Add environment-driven live API access for heatmap data and typed response normalization.
- [x] Add the frontend public API environment example and align FastAPI CORS with Vite's local origin.
- [x] Replace Analytics KPI, risk distribution, and sector performance values with the live portfolio summary response.
- [x] Replace Watchlist project groups with live `/projects` records and preserve existing list/grid interactions.
- [x] Connect Intelligence project ranking, prompt actions, follow-up form, and grounded response to backend endpoints.
- [x] Replace National Dashboard headline KPI card values with the live portfolio summary response.
- [x] Hydrate Project Detail core identity, risk, progress, financial, and schedule values from `/projects`.
- [x] Normalize Project Detail evidence, model signals, and history into flagged reasons, breakdown, and updates panels.
- [x] Connect Data Update PDF submission to `/ingest/monthly-report` and remove mock upload rows from runtime state.
- [x] Replace Intelligence placeholder navigation destinations with valid in-app routes.
- [ ] Replace remaining page mock data with live backend data; do not retain mock data as a runtime fallback.
- [ ] Connect all user actions to real routes/API operations and add loading, empty, and error states without changing the established visual structure.
- [ ] Complete unfinished page/component states while preserving dimensions, layout, visual language, and responsive behavior.
- [ ] Keep frontend secrets out of browser code; use only public client configuration in Vite.

## 5. Verification after each execution

- [x] Run the focused check immediately after each implementation slice.
- [ ] Run `npm run build` and backend tests/health checks.
- [x] Verify local desktop route loading and navigation destinations for dashboard, watchlist, analytics, and early warnings.
- [ ] Verify mobile flows, live heatmap rendering, filters, modals, exports, and remaining error states.
- [ ] Perform manual verification together: page-by-page and button-by-button.
- [ ] Record unresolved environment prerequisites or backend credentials explicitly.

## 6. Deployment readiness

- [ ] Document required frontend/backend environment variables from the actual code.
- [ ] Confirm CORS, Supabase auth/RLS, storage policy, and production API URL behavior.
- [ ] Confirm the final build and provide local run/deployment commands.