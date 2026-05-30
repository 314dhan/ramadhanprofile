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
	const PREVIEW_SIZE = 4;

	const SHAPES: number[][][] = [
		[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], // I
		[[1,1],[1,1]],                               // O
		[[0,1,0],[1,1,1],[0,0,0]],                  // T
		[[0,1,1],[1,1,0],[0,0,0]],                  // S
		[[1,1,0],[0,1,1],[0,0,0]],                  // Z
		[[1,0,0],[1,1,1],[0,0,0]],                  // J
		[[0,0,1],[1,1,1],[0,0,0]],                  // L
	];

	const PIECE_COLORS = [
		'oklch(72% 0.14 260)', // I - indigo
		'oklch(72% 0.14 200)', // O - teal
		'oklch(72% 0.14 300)', // T - purple
		'oklch(72% 0.14 145)', // S - green
		'oklch(72% 0.14 30)',  // Z - orange
		'oklch(72% 0.14 350)', // J - pink
		'oklch(72% 0.14 80)',  // L - yellow
	];

	const CANVAS_BG = 'oklch(38% 0.04 260)';
	const GRID_COLOR = 'oklch(55% 0.03 260 / 0.3)';

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

	// ── Reactive state ───────────────────────────────────────────────────────
	let score = $state(0);
	let level = $state(1);
	let totalLines = $state(0);
	let gameOver = $state(false);
	let internalPaused = $state(false);

	// ── Non-reactive game data ───────────────────────────────────────────────
	let board = createBoard();
	let current = randomPiece();
	let next = randomPiece();

	let canvas: HTMLCanvasElement;
	let nextCanvas: HTMLCanvasElement;

	// ── Drawing ──────────────────────────────────────────────────────────────
	function ghostY(): number {
		let gy = current.y;
		while (!collides(board, current, 0, gy - current.y + 1)) gy++;
		return gy;
	}

	function drawCell(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, alpha = 1) {
		ctx.globalAlpha = alpha;
		ctx.fillStyle = color;
		ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
		ctx.fillStyle = 'rgba(255,255,255,0.15)';
		ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, 3);
		ctx.globalAlpha = 1;
	}

	function drawGrid(ctx: CanvasRenderingContext2D, cols: number, rows: number) {
		ctx.strokeStyle = GRID_COLOR;
		ctx.lineWidth = 0.5;
		for (let r = 0; r <= rows; r++) {
			ctx.beginPath(); ctx.moveTo(0, r * CELL); ctx.lineTo(cols * CELL, r * CELL); ctx.stroke();
		}
		for (let c = 0; c <= cols; c++) {
			ctx.beginPath(); ctx.moveTo(c * CELL, 0); ctx.lineTo(c * CELL, rows * CELL); ctx.stroke();
		}
	}

	function draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = CANVAS_BG;
		ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
		drawGrid(ctx, COLS, ROWS);

		for (let r = 0; r < ROWS; r++) {
			for (let c = 0; c < COLS; c++) {
				if (board[r][c]) drawCell(ctx, c, r, PIECE_COLORS[board[r][c] - 1]);
			}
		}

		if (!gameOver) {
			const gy = ghostY();
			current.shape.forEach((row, r) => {
				row.forEach((cell, c) => {
					if (cell) drawCell(ctx, current.x + c, gy + r, PIECE_COLORS[current.shapeIdx], 0.25);
				});
			});
			current.shape.forEach((row, r) => {
				row.forEach((cell, c) => {
					if (cell) drawCell(ctx, current.x + c, current.y + r, PIECE_COLORS[current.shapeIdx]);
				});
			});
		}
	}

	function drawNext(ctx: CanvasRenderingContext2D) {
		const size = PREVIEW_SIZE * CELL;
		ctx.fillStyle = CANVAS_BG;
		ctx.fillRect(0, 0, size, size);
		drawGrid(ctx, PREVIEW_SIZE, PREVIEW_SIZE);

		const shape = next.shape;
		const offsetX = Math.floor((PREVIEW_SIZE - shape[0].length) / 2);
		const offsetY = Math.floor((PREVIEW_SIZE - shape.length) / 2);
		shape.forEach((row, r) => {
			row.forEach((cell, c) => {
				if (cell) drawCell(ctx, offsetX + c, offsetY + r, PIECE_COLORS[next.shapeIdx]);
			});
		});
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

	// ── Mount ────────────────────────────────────────────────────────────────
	onMount(() => {
		const ctx = canvas.getContext('2d')!;
		const nCtx = nextCanvas.getContext('2d')!;
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
			drawNext(nCtx);
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

	<div class="game-area">
		<!-- Left: next piece preview -->
		<div class="side-panel">
			<span class="panel-label">Next</span>
			<div class="next-wrapper">
				<canvas bind:this={nextCanvas} width={PREVIEW_SIZE * CELL} height={PREVIEW_SIZE * CELL}></canvas>
			</div>
		</div>

		<!-- Main game canvas -->
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
	</div>

	<!-- Touch controls (works on mobile + desktop) -->
	<div class="touch-controls">
		<div class="touch-row">
			<button class="touch-btn" onpointerdown={() => { if (!gameOver && !paused && !internalPaused) movePiece(-1); }} aria-label="Move left">←</button>
			<button class="touch-btn" onpointerdown={() => { if (!gameOver && !paused && !internalPaused) rotateCurrent(); }} aria-label="Rotate">↺</button>
			<button class="touch-btn" onpointerdown={() => { if (!gameOver && !paused && !internalPaused) movePiece(1); }} aria-label="Move right">→</button>
		</div>
		<div class="touch-row">
			<button class="touch-btn" onpointerdown={() => { if (!gameOver && !paused && !internalPaused) softDrop(); }} aria-label="Soft drop">↓</button>
			<button class="touch-btn touch-btn--accent" onpointerdown={() => { if (!gameOver && !paused && !internalPaused) hardDrop(); }} aria-label="Hard drop">⬇⬇</button>
			<button class="touch-btn" onpointerdown={() => { if (!gameOver) internalPaused = !internalPaused; }} aria-label="Pause">⏸</button>
		</div>
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

	.game-area {
		display: flex;
		gap: var(--space-3);
		align-items: flex-start;
	}

	.side-panel {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
	}

	.panel-label {
		font-size: 0.6rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--text-dim);
	}

	.next-wrapper {
		border: 1px solid var(--border);
	}

	.next-wrapper canvas {
		display: block;
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
		background: oklch(12% 0.015 260 / 0.92);
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

	.touch-controls {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		align-items: center;
	}

	.touch-row {
		display: flex;
		gap: var(--space-2);
	}

	.touch-btn {
		width: 56px;
		height: 56px;
		background: var(--surface-bright);
		border: 1px solid var(--border-bright);
		color: var(--text-main);
		font-size: 1.2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		touch-action: manipulation;
		user-select: none;
		-webkit-user-select: none;
		transition: background 0.15s ease, transform 0.1s ease;
	}

	.touch-btn:active {
		background: var(--accent);
		color: white;
		transform: scale(0.93);
	}

	.touch-btn--accent {
		border-color: var(--accent);
		color: var(--accent);
	}

	.touch-btn--accent:active {
		background: var(--accent);
		color: white;
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
