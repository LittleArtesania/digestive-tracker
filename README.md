# Wellness — Private Digestive Journal

A private, offline-first PWA for tracking bowel movements and gas — built as a
digital product for Etsy. No accounts, no backend, no cloud sync: every record
lives in the browser's `localStorage` on the user's own device.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router · Recharts ·
Lucide icons · Vitest · `vite-plugin-pwa`

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (defaults to `http://localhost:5173`).

## Scripts

| Command                | What it does                                      |
| ----------------------- | -------------------------------------------------- |
| `npm run dev`           | Local dev server with hot reload                   |
| `npm run build`         | Type-checks, then builds the production bundle + PWA assets into `dist/` |
| `npm run preview`       | Serves the production build locally (useful for testing offline behavior) |
| `npm test`              | Runs the full test suite once                      |
| `npm run test:watch`    | Runs tests in watch mode                           |
| `npm run test:coverage` | Runs tests with a coverage report                  |
| `npm run lint`          | Lints the codebase                                 |

## Project structure

```
src/
  components/   UI building blocks, grouped by concern
    ui/           Button, Card, ChipGroup, Toast, ConfirmDialog, etc.
    layout/       AppShell, Sidebar, BottomNav
    timeline/     ActivityTimeline, HistoryEntryCard
    calendar/     MonthGrid, DayDetailPanel
    charts/       Recharts-based charts (lazy-loaded — see note below)
    onboarding/   First-run onboarding flow
    empty/        EmptyState
  pages/        One file per route (Dashboard, Log, History, Calendar, Insights, Settings...)
  storage/      All localStorage access lives here — nothing outside this folder
                touches window.localStorage directly. CRUD, backups, insights,
                and chart-series computation are all pure, testable functions.
  hooks/        useBathroomTimer, useAppliedTheme, ThemeContext
  types/        Shared TypeScript types for the data model
  constants/    Static option lists (Bristol scale, gas amounts/odors, nav items...)
  utils/        Small pure helpers (date formatting, mode/average math, calendar grid math)
  test/         Vitest setup (clears localStorage between every test)
```

## Data model

Two record types, defined in `src/types/tracker.ts`:

- **BowelMovement** — timestamp, duration, Bristol type, color, ease, straining,
  feeling afterward, sensations, notes.
- **GasEvent** — timestamp, amount, odor, context, notes.

Both are plain JSON stored under versioned keys (see `src/constants/storageKeys.ts`).
Settings and backups have their own storage modules with the same pattern.

## Testing

The suite focuses on business logic, not visual components (per the product
spec) — CRUD operations, daily/weekly/monthly aggregation, the insights engine
(averages, mode, percentiles, and the sample-size thresholds that gate
"most common X" pattern sentences), calendar grid math, and the full
export → reset → import round trip.

```bash
npm test
```

## PWA / offline

`vite-plugin-pwa` generates the manifest and service worker at build time —
there's nothing to configure for local dev. To verify offline behavior:

```bash
npm run build
npm run preview
```

Then load the preview URL once, open dev tools → Network → set to "Offline",
and reload — the app should still work.

## Dark mode

Implemented via CSS custom properties in `src/index.css`, swapped by a
`data-theme="dark"` attribute on `<html>` (see `src/hooks/useAppliedTheme.ts`).
Every color token has both a light and dark value tuned to meet WCAG AA
contrast — notably, button-fill colors and "colored text on the page
background" use *separate* tokens (`--color-clay` vs `--color-clay-text`)
because a single hue can't satisfy 4.5:1 contrast against both a light and a
near-black background at once.

## Generating demo/preview data

There's a hidden, unlinked route for populating the app with ~21 days of
realistic synthetic data — useful for taking product screenshots for the
Etsy listing without exposing a "load fake data" button to real customers:

```
/dev/demo-data
```

It's not in the nav and not discoverable by clicking around — you have to
type the URL. It always asks for confirmation before overwriting existing
data.

## Privacy & data ownership

- No account, no backend, no analytics.
- All data stays in the browser's `localStorage`.
- Settings → Export downloads a full JSON backup; Import restores from one.
- Settings → Delete all data permanently wipes everything on that device.
