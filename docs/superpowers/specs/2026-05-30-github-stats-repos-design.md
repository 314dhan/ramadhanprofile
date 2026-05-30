# GitHub Stats Strip & AI Repo Cards Design

**Date:** 2026-05-30
**Status:** Approved

## Overview

Add a GitHub live stats strip to the About section and 3 AI-tool repo cards to the existing Projects section.

## Architecture

Two existing files modified, no new files:

| File | Change |
|------|--------|
| `src/lib/components/About.svelte` | Add GitHub stats strip at bottom of section |
| `src/lib/components/Projects.svelte` | Add 3 repo cards to existing grid |

## GitHub Stats Strip (About section)

Added at the bottom of the About section, above the section end.

### Row 1 — Live stat numbers

Fetched client-side via `onMount` from `https://api.github.com/users/314dhan`.

Displays:
- Public repo count (`public_repos`)
- Top 3 languages: Python · JavaScript · PHP (hardcoded — derived from known repos, not fetched)
- "View GitHub →" link to `https://github.com/314dhan`

Loading state: skeleton shimmer on the repo count while fetching. Fallback: show `—` if API fails (avoids stale hardcoded number).

### Row 2 — Contribution card

Plain `<img>` embed from `github-readme-stats`, always live:

```
https://github-readme-stats.vercel.app/api?username=314dhan
  &show_icons=true
  &hide_border=false
  &bg_color=111318
  &title_color=6b8af5
  &text_color=e8e9ed
  &icon_color=6b8af5
  &border_color=2a2d36
```

Colors mapped from site OKLCH palette:
- `bg_color=111318` → `--surface` (`oklch(16% 0.02 260)`)
- `title_color=6b8af5` → `--accent` (`oklch(72% 0.14 260)`)
- `text_color=e8e9ed` → `--text-main` (`oklch(92% 0.01 260)`)
- `border_color=2a2d36` → `--border` approximate

Lazy-loaded (`loading="lazy"`). Wrapped in a border matching `--border` for consistency.

## Repo Cards (Projects section)

3 cards added to the existing projects grid after the current project cards. Visual separator with "AI Tools" section label distinguishes them from web projects.

### Cards

| Repo | Description | Link |
|------|-------------|------|
| `coding-llm-local` | Local LLM coding assistant — run AI code suggestions offline | `https://github.com/314dhan/coding-llm-local` |
| `compress-video-python` | Batch video compression script with configurable quality settings | `https://github.com/314dhan/compress-video-python` |
| `download-manager` | Python download manager with queue and progress tracking | `https://github.com/314dhan/download-manager` |

Each card shows:
- Repo name (styled as project title, Fraunces serif)
- Description text
- `Python` language badge (existing `.tag` style)
- `Built with Claude` tag (accent-colored to stand out)
- External link icon + "View on GitHub →" on hover

Cards use existing `.project-item` / `.game-item` pattern for visual consistency.

## Files Changed

- `src/lib/components/About.svelte` — stats strip at bottom of section
- `src/lib/components/Projects.svelte` — 3 repo cards + "AI Tools" label
