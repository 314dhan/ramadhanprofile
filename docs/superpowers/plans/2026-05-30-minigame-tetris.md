# Tetris Minigame Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Tetris minigame accessible via a floating bottom-left button that appears on scroll, opening in a centered modal overlay styled to match the site's OKLCH design system.

**Architecture:** A `game.ts` writable store manages modal open/close state. `MiniGame.svelte` mounts in `+page.svelte` and owns the floating button, modal shell, and pause-resume behavior. `Tetris.svelte` is a self-contained canvas game that receives a `paused` prop and is kept mounted after first open so game state persists across modal toggles.

**Tech Stack:** SvelteKit + Svelte 5 (runes), TypeScript, Canvas 2D API, Font Awesome (already in project), OKLCH CSS custom properties.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/lib/stores/game.ts` | Modal open/close state + active game id |
| Create | `src/lib/components/games/Tetris.svelte` | Canvas Tetris — all game logic + rendering |
| Create | `src/lib/components/MiniGame.svelte` | Floating button, modal shell, pause wiring |
| Modify | `src/routes/+page.svelte` | Import and mount `<MiniGame />` |

---

## Task 1: Game Store

**Files:**
- Create: `src/lib/stores/game.ts`

- [ ] **Step 1: Create the store**

```typescript
// src/lib/stores/game.ts
import { writable } from 'svelte/store';

export type GameId = 'tetris';

interface GameState {
  open: boolean;
  activeGame: GameId;
}

function createGameStore() {
  const { subscribe, update } = writable<GameState>({
    open: false,
    activeGame: 'tetris',
  });

  return {
    subscribe,
    open: (game: GameId = 'tetris') => update(s => ({ ...s, open: true, activeGame: game })),
    close: () => update(s => ({ ...s, open: false })),
  };
}

export const gameStore = createGameStore();
```

- [ ] **Step 2: Verify TypeScript**

Run: `npm run check`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/stores/game.ts
git commit -m "feat: add game store for modal open/close state"
```

---

## Task 2: Tetris Component

**Files:**
- Create: `src/lib/components/games/Tetris.svelte`

This is the full canvas Tetris implementation. The component receives a `paused` prop (true when the modal is hidden), owns an internal `internalPaused` state for the P key, and runs a `requestAnimationFrame` loop for rendering and gravity.

- [ ] **Step 1: Create the directory**

```bash
mkdir -p src/lib/components/games
```

- [ ] **Step 2: Write the full Tetris component**

```svelte
<!-- src/lib/components/games/Tetris.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		paused: boolean;
	}

	let { paused }: Props = $props();

	// ── Constants ────────────────────────────────────────────────────────────
	const COLS = 10;
	const ROWS = 20;
	const CELL = 28;

	const SHAPES: number[][][] = [
		[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], // I
		[[1,1],[1,1]],                               // O
		[[0,1,0],[1,1,1],[0,0,0]],                  // T
		[[0,1,1],[1,1,0],[0,0,0]],                  // S
		[[1,1,0],[0,1,1],[0,0,0]],                  // Z
		[[1,0,0],[1,1,1],[0,0,0]],                  // J
		[[0,0,1],[1,1,1],[0,0,0]],                  // L
	];

	// All pieces share the accent's lightness/chroma, varying only hue
	const PIECE_COLORS = [
		'oklch(72% 0.14 260)', // I - indigo (matches --accent)
		'oklch(72% 0.14 200)', // O - teal
		'oklch(72% 0.14 300)', // T - purple
		'oklch(72% 0.14 145)', // S - green
		'oklch(72% 0.14 30)',  // Z - orange
		'oklch(72% 0.14 350)', // J - pink
		'oklch(72% 0.14 80)',  // L - yellow
	];

	// ── Types ────────────────────────────────────────────────────────────────
	interface Piece {
		shapeIdx: number;
		shape: number[][];
		x: number;
		y: number;
	}

	// ── Pure game logic ──────────────────────────────────────────────────────
	function createBoard(): number[][] {
		return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
	}

	function randomPiece(): Piece {
		const shapeIdx = Math.floor(Math.random() * SHAPES.length);
		const shape = SHAPES[shapeIdx];
		return {
			shapeIdx,
			shape,
			x: Math.floor((COLS - shape[0].length) / 2),
			y: 0,
		};
	}

	function collides(board: number[][], piece: Piece, dx = 0, dy = 0, shape = piece.shape): boolean {
		for (let r = 0; r < shape.length; r++) {
			for (let c = 0; c < shape[r].length; c++) {
				if (!shape[r][c]) continue;
				const nx = piece.x + c + dx;
				const ny = piece.y + r + dy;
				if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
				if (ny >= 0 && board[ny][nx]) return true;
			}
		}
		return false;
	}

	function rotatePieceShape(shape: number[][]): number[][] {
		const n = shape.length;
		const m = shape[0].length;
		const rotated = Array.from({ length: m }, () => Array(n).fill(0));
		for (let r = 0; r < n; r++) {
			for (let c = 0; c < m; c++) {
				rotated[c][n - 1 - r] = shape[r][c];
			}
		}
		return rotated;
	}

	function lockPiece(board: number[][], piece: Piece): number[][] {
		const newBoard = board.map(row => [...row]);
		piece.shape.forEach((row, r) => {
			row.forEach((cell, c) => {
				if (cell && piece.y + r >= 0) {
					newBoard[piece.y + r][piece.x + c] = piece.shapeIdx + 1;
				}
			});
		});
		return newBoard;
	}

	function clearLines(board: number[][]): { board: number[][], count: number } {
		const kept = board.filter(row => row.some(cell => cell === 0));
		const count = ROWS - kept.length;
		const empty = Array.from({ length: count }, () => Array(COLS).fill(0));
		return { board: [...empty, ...kept], count };
	}

	const LINE_SCORES = [0, 100, 300, 500, 800];

	function calcScore(lines: number, level: number): number {
		return (LINE_SCORES[lines] ?? 0) * level;
	}

	function dropInterval(level: number): number {
		return Math.max(100, 800 - (level - 1) * 75);
	}

	// ── Reactive state (shown in template) ───────────────────────────────────
	let score = $state(0);
	let level = $state(1);
	let totalLines = $state(0);
	let gameOver = $state(false);
	let internalPaused = $state(false);

	// ── Non-reactive game data (canvas-only) ─────────────────────────────────
	let board = createBoard();
	let current = randomPiece();
	let next = randomPiece();

	let canvas: HTMLCanvasElement;

	// ── Canvas helpers ───────────────────────────────────────────────────────
	function ghostY(): number {
		let gy = current.y;
		while (!collides(board, current, 0, gy - current.y + 1)) gy++;
		return gy;
	}

	function drawCell(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, alpha = 1) {
		ctx.globalAlpha = alpha;
		ctx.fillStyle = color;
		ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
		// subtle top-edge highlight
		ctx.fillStyle = 'rgba(255,255,255,0.12)';
		ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, 3);
		ctx.globalAlpha = 1;
	}

	function draw(ctx: CanvasRenderingContext2D) {
		// Background
		ctx.fillStyle = 'oklch(12% 0.015 260)';
		ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);

		// Grid lines
		ctx.strokeStyle = 'oklch(25% 0.02 260 / 0.25)';
		ctx.lineWidth = 0.5;
		for (let r = 0; r <= ROWS; r++) {
			ctx.beginPath(); ctx.moveTo(0, r * CELL); ctx.lineTo(COLS * CELL, r * CELL); ctx.stroke();
		}
		for (let c = 0; c <= COLS; c++) {
			ctx.beginPath(); ctx.moveTo(c * CELL, 0); ctx.lineTo(c * CELL, ROWS * CELL); ctx.stroke();
		}

		// Locked cells
		for (let r = 0; r < ROWS; r++) {
			for (let c = 0; c < COLS; c++) {
				if (board[r][c]) drawCell(ctx, c, r, PIECE_COLORS[board[r][c] - 1]);
			}
		}

		if (!gameOver) {
			// Ghost piece (landing preview)
			const gy = ghostY();
			current.shape.forEach((row, r) => {
				row.forEach((cell, c) => {
					if (cell) drawCell(ctx, current.x + c, gy + r, PIECE_COLORS[current.shapeIdx], 0.2);
				});
			});
			// Active piece
			current.shape.forEach((row, r) => {
				row.forEach((cell, c) => {
					if (cell) drawCell(ctx, current.x + c, current.y + r, PIECE_COLORS[current.shapeIdx]);
				});
			});
		}
	}

	// ── Game actions ─────────────────────────────────────────────────────────
	function moveDown() {
		if (collides(board, current, 0, 1)) {
			board = lockPiece(board, current);
			const { board: cleared, count } = clearLines(board);
			board = cleared;
			if (count > 0) {
				score += calcScore(count, level);
				totalLines += count;
				level = Math.floor(totalLines / 10) + 1;
			}
			current = next;
			next = randomPiece();
			if (collides(board, current, 0, 0)) gameOver = true;
		} else {
			current = { ...current, y: current.y + 1 };
		}
	}

	function movePiece(dx: number) {
		if (!collides(board, current, dx, 0)) current = { ...current, x: current.x + dx };
	}

	function rotateCurrent() {
		const rotated = rotatePieceShape(current.shape);
		for (const kick of [0, -1, 1, -2, 2]) {
			if (!collides(board, current, kick, 0, rotated)) {
				current = { ...current, shape: rotated, x: current.x + kick };
				return;
			}
		}
	}

	function softDrop() {
		if (!collides(board, current, 0, 1)) {
			current = { ...current, y: current.y + 1 };
			score += 1;
		}
	}

	function hardDrop() {
		let dropped = 0;
		while (!collides(board, current, 0, dropped + 1)) dropped++;
		score += dropped * 2;
		current = { ...current, y: current.y + dropped };
		moveDown();
	}

	function restart() {
		board = createBoard();
		current = randomPiece();
		next = randomPiece();
		score = 0;
		level = 1;
		totalLines = 0;
		gameOver = false;
		internalPaused = false;
	}

	// ── Mount: start game loop + keyboard ────────────────────────────────────
	onMount(() => {
		const ctx = canvas.getContext('2d')!;
		let rafId: number;
		let lastTime = 0;
		let dropAcc = 0;

		function loop(timestamp: number) {
			const delta = timestamp - lastTime;
			lastTime = timestamp;

			if (!paused && !internalPaused && !gameOver) {
				dropAcc += delta;
				if (dropAcc >= dropInterval(level)) {
					dropAcc = 0;
					moveDown();
				}
			}

			draw(ctx);
			rafId = requestAnimationFrame(loop);
		}

		rafId = requestAnimationFrame(loop);

		function handleKey(e: KeyboardEvent) {
			const gameKeys = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' ', 'p', 'P', 'z', 'Z'];
			if (gameKeys.includes(e.key)) e.preventDefault();
			if (gameOver) {
				if (e.key === 'Enter') restart();
				return;
			}
			if ((paused || internalPaused) && e.key !== 'p' && e.key !== 'P') return;
			switch (e.key) {
				case 'ArrowLeft': movePiece(-1); break;
				case 'ArrowRight': movePiece(1); break;
				case 'ArrowDown': softDrop(); break;
				case 'ArrowUp': case 'z': case 'Z': rotateCurrent(); break;
				case ' ': hardDrop(); break;
				case 'p': case 'P': internalPaused = !internalPaused; break;
			}
		}

		window.addEventListener('keydown', handleKey);
		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener('keydown', handleKey);
		};
	});
</script>

<div class="tetris-wrapper">
	<div class="hud">
		<div class="hud-item">
			<span class="hud-label">Score</span>
			<span class="hud-value">{score}</span>
		</div>
		<div class="hud-item">
			<span class="hud-label">Level</span>
			<span class="hud-value">{level}</span>
		</div>
		<div class="hud-item">
			<span class="hud-label">Lines</span>
			<span class="hud-value">{totalLines}</span>
		</div>
	</div>

	<div class="canvas-wrapper">
		<canvas bind:this={canvas} width={COLS * CELL} height={ROWS * CELL}></canvas>
		{#if gameOver}
			<div class="overlay">
				<h4>Game Over</h4>
				<p class="final-score">{score}</p>
				<button class="restart-btn" onclick={restart}>Restart</button>
				<p class="hint">or press Enter</p>
			</div>
		{:else if internalPaused}
			<div class="overlay">
				<p class="paused-text">PAUSED</p>
				<p class="hint">Press P to resume</p>
			</div>
		{/if}
	</div>

	<div class="controls-hint">
		<span>← → Move</span>
		<span>↑/Z Rotate</span>
		<span>↓ Soft Drop</span>
		<span>Space Hard Drop</span>
		<span>P Pause</span>
	</div>
</div>

<style>
	.tetris-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
	}

	.hud {
		display: flex;
		gap: var(--space-2);
		width: 100%;
	}

	.hud-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		background: var(--surface-bright);
		border: 1px solid var(--border);
		padding: var(--space-2) var(--space-3);
	}

	.hud-label {
		font-size: 0.6rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--text-dim);
	}

	.hud-value {
		font-family: 'Fraunces', serif;
		font-size: 1.5rem;
		color: var(--text-main);
		line-height: 1.2;
		min-width: 3ch;
		text-align: center;
	}

	.canvas-wrapper {
		position: relative;
		border: 1px solid var(--border);
	}

	canvas {
		display: block;
	}

	.overlay {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		background: oklch(12% 0.015 260 / 0.85);
		backdrop-filter: blur(4px);
	}

	.overlay h4 {
		font-family: 'Fraunces', serif;
		font-size: 2rem;
		color: var(--text-main);
		margin: 0;
	}

	.final-score {
		font-family: 'Fraunces', serif;
		font-size: 2.5rem;
		color: var(--accent);
		margin: 0;
	}

	.paused-text {
		font-family: 'Fraunces', serif;
		font-size: 1.5rem;
		color: var(--text-main);
		margin: 0;
		letter-spacing: 0.2em;
	}

	.restart-btn {
		background: var(--accent);
		color: white;
		border: none;
		padding: var(--space-2) var(--space-4);
		font-family: 'Plus Jakarta Sans', sans-serif;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		margin-top: var(--space-2);
	}

	.restart-btn:hover {
		background: var(--accent-bright);
		transform: translateY(-2px);
	}

	.hint {
		font-size: 0.75rem;
		color: var(--text-dim);
		margin: 0;
	}

	.controls-hint {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		justify-content: center;
	}

	.controls-hint span {
		font-size: 0.625rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-dim);
		background: var(--surface-bright);
		border: 1px solid var(--border);
		padding: 0.15rem 0.5rem;
	}
</style>
```

- [ ] **Step 3: Verify TypeScript**

Run: `npm run check`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/components/games/Tetris.svelte
git commit -m "feat: add Tetris canvas game component"
```

---

## Task 3: MiniGame Shell

**Files:**
- Create: `src/lib/components/MiniGame.svelte`

The shell owns: the floating game button (appears after 400px scroll), the modal overlay, Escape key handling, and the `gameMounted` flag that keeps Tetris mounted after first open so state persists.

The modal uses `visibility: hidden` (not `{#if}`) when closed so Tetris stays mounted. `paused={!$gameStore.open}` tells Tetris to freeze the drop timer while hidden.

- [ ] **Step 1: Write the MiniGame component**

```svelte
<!-- src/lib/components/MiniGame.svelte -->
<script lang="ts">
	import { gameStore } from '$lib/stores/game';
	import Tetris from '$lib/components/games/Tetris.svelte';
	import { onMount } from 'svelte';

	let showButton = $state(false);
	let gameMounted = $state(false);

	function handleScroll() {
		showButton = window.scrollY > 400;
	}

	function openGame() {
		gameMounted = true;
		gameStore.open();
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();

		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'Escape' && $gameStore.open) gameStore.close();
		}
		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<!-- Modal: always in DOM once gameMounted, hidden via CSS when closed -->
<div
	class="modal-container"
	class:hidden={!$gameStore.open}
	aria-hidden={!$gameStore.open}
>
	<!-- Backdrop -->
	<div
		class="modal-backdrop"
		onclick={() => gameStore.close()}
		role="presentation"
	></div>

	<!-- Panel -->
	<div
		class="modal-panel"
		role="dialog"
		aria-modal="true"
		aria-label="Tetris"
	>
		<div class="modal-header">
			<h3 class="modal-title">Tetris</h3>
			<button class="close-btn" onclick={() => gameStore.close()} aria-label="Close game">
				×
			</button>
		</div>
		<div class="modal-body">
			{#if gameMounted}
				<Tetris paused={!$gameStore.open} />
			{/if}
		</div>
	</div>
</div>

<!-- Floating game button -->
<button
	class="game-btn"
	class:visible={showButton}
	onclick={openGame}
	aria-label="Open Tetris"
>
	<i class="fas fa-gamepad"></i>
</button>

<style>
	.modal-container {
		position: fixed;
		inset: 0;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal-container.hidden {
		visibility: hidden;
		pointer-events: none;
	}

	.modal-backdrop {
		position: absolute;
		inset: 0;
		background: oklch(8% 0.01 260 / 0.75);
		backdrop-filter: blur(4px);
	}

	.modal-panel {
		position: relative;
		z-index: 1;
		background: var(--surface);
		border: 1px solid var(--border-bright);
		padding: var(--space-4);
		max-height: 90vh;
		overflow-y: auto;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-3);
	}

	.modal-title {
		font-family: 'Fraunces', serif;
		font-size: 1.25rem;
		color: var(--text-main);
		margin: 0;
	}

	.close-btn {
		background: none;
		border: none;
		color: var(--text-dim);
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		padding: 0 var(--space-1);
		transition: color 0.2s ease;
	}

	.close-btn:hover {
		color: var(--text-main);
	}

	.modal-body {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	/* Floating button — mirrors back-to-top but on the left */
	.game-btn {
		position: fixed;
		bottom: var(--space-6);
		left: var(--space-6);
		width: 48px;
		height: 48px;
		background: var(--surface);
		border: 1px solid var(--border);
		color: var(--text-main);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		opacity: 0;
		visibility: hidden;
		transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
		z-index: 900;
		font-size: 1rem;
	}

	.game-btn.visible {
		opacity: 1;
		visibility: visible;
	}

	.game-btn:hover {
		background: var(--accent);
		color: white;
		border-color: var(--accent);
		transform: translateY(-4px);
	}
</style>
```

- [ ] **Step 2: Verify TypeScript**

Run: `npm run check`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/MiniGame.svelte
git commit -m "feat: add MiniGame shell with floating button and modal"
```

---

## Task 4: Wire Into Page

**Files:**
- Modify: `src/routes/+page.svelte`

- [ ] **Step 1: Add MiniGame import**

In `src/routes/+page.svelte`, add the import alongside the other component imports:

```svelte
<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Skills from '$lib/components/Skills.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import GameProjects from '$lib/components/GameProjects.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import MiniGame from '$lib/components/MiniGame.svelte';
	import { onMount, onDestroy } from 'svelte';
	// ... rest unchanged
```

- [ ] **Step 2: Mount MiniGame alongside the back-to-top button**

At the end of the template (after the `<button class="back-to-top-btn">` block), add:

```svelte
<MiniGame />
```

The final template tail should look like:

```svelte
<button 
	class="back-to-top-btn" 
	class:visible={showBackToTop} 
	onclick={scrollToTop}
	aria-label="Back to top"
>
	<i class="fas fa-arrow-up"></i>
</button>

<MiniGame />
```

- [ ] **Step 3: Verify TypeScript**

Run: `npm run check`
Expected: no errors

- [ ] **Step 4: Start dev server and manually test**

Run: `npm run dev`

Test checklist:
- [ ] Page loads without errors
- [ ] Scroll down 400px → gamepad button appears bottom-left
- [ ] Scroll back to top → button disappears
- [ ] Click gamepad button → modal opens with Tetris
- [ ] Arrow keys move/rotate piece; space hard-drops; P pauses
- [ ] Lines clear and score/level increment
- [ ] Game over overlay appears; Enter or Restart button resets game
- [ ] Click backdrop or × closes modal
- [ ] Escape key closes modal
- [ ] Reopen modal → game is paused where you left it, P resumes
- [ ] Back-to-top button (bottom-right) still works correctly

- [ ] **Step 5: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "feat: mount MiniGame in page layout"
```
