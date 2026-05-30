# Minigame — Tetris Modal Design

**Date:** 2026-05-30  
**Status:** Approved

## Overview

Add a Tetris minigame accessible via a floating button that appears on scroll. The game opens in a centered modal overlay. Style matches the existing site aesthetic using CSS custom properties. Architecture is extensible — more games can be added later.

## Component Architecture

### New files

| File | Purpose |
|------|---------|
| `src/lib/components/MiniGame.svelte` | Floating button + modal shell |
| `src/lib/components/games/Tetris.svelte` | Tetris game canvas + logic |
| `src/lib/stores/game.ts` | Modal open/close state (writable store) |

### Integration point

`MiniGame.svelte` is imported and mounted in `src/routes/+page.svelte` alongside the existing back-to-top button. The Tetris component is conditionally rendered inside the modal (`{#if open}`) so it does not consume CPU/memory when closed.

## Floating Button

- **Position:** Fixed, bottom-left
- **Visibility:** Hidden by default; appears after user scrolls 400px (mirrors back-to-top button threshold)
- **Size:** 48×48px — matches back-to-top button dimensions
- **Icon:** Font Awesome `fa-gamepad`
- **Styling:** Uses `--surface`, `--border`, `--text-main` CSS vars at rest; accent color fill on hover — consistent with back-to-top button hover behavior
- **Transition:** Same `opacity`/`visibility` fade as back-to-top button

## Modal

- **Layout:** Centered overlay, `position: fixed`, `inset: 0`, `z-index: 1000`
- **Backdrop:** Semi-transparent dark overlay with `backdrop-filter: blur(4px)`
- **Panel:** Uses `--surface` background, `--border` border, contains header + game
- **Header:** "Tetris" title (Fraunces serif, matches site headings) + close button (`×`)
- **Close triggers:** Click `×`, click backdrop, press `Escape`
- **Pause behavior:** Game pauses on modal close, resumes on reopen

## Tetris Game

### Grid
- 10 columns × 20 rows, rendered on `<canvas>`
- Cell size: 28px → canvas 280×560px
- Rendered via `requestAnimationFrame` loop; loop stops when modal closes

### Tetrominoes
7 standard pieces (I, O, T, S, Z, J, L). Colors use site palette:
- I → `var(--accent)`
- Others → variations of `var(--text-muted)`, `var(--text-dim)`, muted accent shades

### Controls
| Key | Action |
|-----|--------|
| `←` / `→` | Move left/right |
| `↓` | Soft drop |
| `↑` or `Z` | Rotate |
| `Space` | Hard drop |
| `P` | Pause/resume |

### Scoring
- 1 line: 100 pts × level
- 2 lines: 300 pts × level
- 3 lines: 500 pts × level
- 4 lines (Tetris): 800 pts × level
- Level increases every 10 lines cleared; speed increases with level

### HUD
Score and level displayed above canvas in site font. Game-over state shows final score + "Restart" button styled with `--accent`.

## Extensibility

`game.ts` store exposes `{ open, activeGame }`. `MiniGame.svelte` renders the correct game component based on `activeGame`. Adding Snake or 2048 later means: create the component, add it to the switch, add a tab/button to the modal header.

## Files Changed

- `src/routes/+page.svelte` — import + mount `<MiniGame />`
- `src/lib/stores/game.ts` — new store
- `src/lib/components/MiniGame.svelte` — new component
- `src/lib/components/games/Tetris.svelte` — new component
