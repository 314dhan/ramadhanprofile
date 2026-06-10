<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { theme } from '$lib/stores/theme';

	let {
		line1,
		line2,
		children
	}: { line1: string; line2: string; children?: Snippet } = $props();

	let wrapEl: HTMLElement;
	let canvasEl: HTMLCanvasElement;
	let active = $state(false);
	let onLinesChanged: (() => void) | null = null;

	// re-sample when the headline copy changes (language switch) — morphs in place
	$effect(() => {
		void line1;
		void line2;
		onLinesChanged?.();
	});

	const BLEED = 110; // px of canvas overhang so scattered dots aren't clipped
	const TARGET_COUNT = 2600;
	const SPRING = 0.028;
	const FRICTION = 0.86;
	const CURSOR_RADIUS = 95;

	onMount(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) return;

		const ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		let w = 0, h = 0, dpr = 1;
		let count = 0;
		let hx = new Float32Array(0);
		let hy = new Float32Array(0);
		let x = new Float32Array(0);
		let y = new Float32Array(0);
		let vx = new Float32Array(0);
		let vy = new Float32Array(0);
		let lineOf = new Uint8Array(0);
		let colors = ['#fff', '#7a8fff'];
		let destroyed = false;

		function resolveCssColor(value: string, fallback: string): string {
			try {
				const c = document.createElement('canvas');
				c.width = c.height = 1;
				const cx = c.getContext('2d');
				if (!cx) return fallback;
				cx.fillStyle = value;
				cx.fillRect(0, 0, 1, 1);
				const d = cx.getImageData(0, 0, 1, 1).data;
				return `rgb(${d[0]} ${d[1]} ${d[2]})`;
			} catch {
				return fallback;
			}
		}

		function refreshColors() {
			const root = getComputedStyle(document.documentElement);
			colors = [
				resolveCssColor(root.getPropertyValue('--text-main').trim(), '#eee'),
				resolveCssColor(root.getPropertyValue('--accent').trim(), '#7a8fff')
			];
		}

		// Sample the two headline lines into particle home positions
		function sampleText(): { homes: { x: number; y: number; line: number }[] } | null {
			const h1 = wrapEl.querySelector('h1');
			if (!h1) return null;
			const boxW = wrapEl.clientWidth;
			const boxH = wrapEl.clientHeight;
			if (boxW < 50 || boxH < 30) return null;

			let fontPx = parseFloat(getComputedStyle(h1).fontSize);
			const off = document.createElement('canvas');
			off.width = boxW;
			off.height = boxH;
			const octx = off.getContext('2d', { willReadFrequently: true });
			if (!octx) return null;

			const font1 = (px: number) => `600 ${px}px Fraunces, serif`;
			const font2 = (px: number) => `italic 400 ${px}px Fraunces, serif`;

			// shrink canvas font if a line would overflow the box
			octx.font = font1(fontPx);
			const w1 = octx.measureText(line1).width;
			octx.font = font2(fontPx);
			const w2 = octx.measureText(line2).width;
			const widest = Math.max(w1, w2);
			if (widest > boxW * 0.98) fontPx *= (boxW * 0.98) / widest;

			const lineH = fontPx * 1.0;
			const blockH = lineH * 2;
			const top = boxH / 2 - blockH / 2;
			octx.textAlign = 'center';
			octx.textBaseline = 'middle';
			octx.fillStyle = '#f00';
			octx.font = font1(fontPx);
			octx.fillText(line1, boxW / 2, top + lineH * 0.5);
			octx.fillStyle = '#00f';
			octx.font = font2(fontPx);
			octx.fillText(line2, boxW / 2, top + lineH * 1.5);

			const data = octx.getImageData(0, 0, boxW, boxH).data;
			const maxCount = window.innerWidth < 768 ? 1200 : TARGET_COUNT;
			let step = 3;
			let homes: { x: number; y: number; line: number }[] = [];
			for (; step < 12; step++) {
				homes = [];
				for (let yy = 0; yy < boxH; yy += step) {
					for (let xx = 0; xx < boxW; xx += step) {
						const i = (yy * boxW + xx) * 4;
						if (data[i + 3] > 128) {
							homes.push({ x: xx + BLEED, y: yy + BLEED, line: data[i] > data[i + 2] ? 0 : 1 });
						}
					}
				}
				if (homes.length <= maxCount * 1.3) break;
			}
			return homes.length > 50 ? { homes } : null;
		}

		function applyHomes(homes: { x: number; y: number; line: number }[]) {
			const prev = count;
			count = homes.length;
			const nhx = new Float32Array(count);
			const nhy = new Float32Array(count);
			const nx = new Float32Array(count);
			const ny = new Float32Array(count);
			const nvx = new Float32Array(count);
			const nvy = new Float32Array(count);
			const nline = new Uint8Array(count);
			for (let i = 0; i < count; i++) {
				nhx[i] = homes[i].x;
				nhy[i] = homes[i].y;
				nline[i] = homes[i].line;
				if (i < prev) {
					// reuse live particle so language switches morph instead of restart
					nx[i] = x[i];
					ny[i] = y[i];
					nvx[i] = vx[i];
					nvy[i] = vy[i];
				} else {
					nx[i] = Math.random() * w;
					ny[i] = Math.random() * h;
				}
			}
			hx = nhx; hy = nhy; x = nx; y = ny; vx = nvx; vy = nvy; lineOf = nline;
		}

		function sizeCanvas() {
			w = wrapEl.clientWidth + BLEED * 2;
			h = wrapEl.clientHeight + BLEED * 2;
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvasEl.width = w * dpr;
			canvasEl.height = h * dpr;
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
		}

		// ── Cursor ───────────────────────────────────────────────
		let mx = -9999, my = -9999;
		let cursorIdle = 999;
		function onPointerMove(e: PointerEvent) {
			const r = canvasEl.getBoundingClientRect();
			mx = e.clientX - r.left;
			my = e.clientY - r.top;
			cursorIdle = 0;
			start();
		}

		// ── Loop with settle-pause ───────────────────────────────
		let rafId = 0;
		let running = false;
		let inView = true;

		function frame() {
			rafId = requestAnimationFrame(frame);
			cursorIdle++;
			let energy = 0;

			for (let i = 0; i < count; i++) {
				vx[i] += (hx[i] - x[i]) * SPRING;
				vy[i] += (hy[i] - y[i]) * SPRING;

				const dx = x[i] - mx;
				const dy = y[i] - my;
				const d2 = dx * dx + dy * dy;
				if (d2 < CURSOR_RADIUS * CURSOR_RADIUS && d2 > 0.01) {
					const d = Math.sqrt(d2);
					const f = ((CURSOR_RADIUS - d) / CURSOR_RADIUS) * 3.2;
					vx[i] += (dx / d) * f;
					vy[i] += (dy / d) * f;
				}

				vx[i] *= FRICTION;
				vy[i] *= FRICTION;
				x[i] += vx[i];
				y[i] += vy[i];
				energy += Math.abs(vx[i]) + Math.abs(vy[i]);
			}

			ctx!.clearRect(0, 0, w, h);
			const size = 2;
			for (let pass = 0; pass < 2; pass++) {
				ctx!.fillStyle = colors[pass];
				for (let i = 0; i < count; i++) {
					if (lineOf[i] !== pass) continue;
					ctx!.fillRect(x[i] - size / 2, y[i] - size / 2, size, size);
				}
			}

			// fully settled and cursor quiet: stop burning frames
			if (energy < count * 0.012 && cursorIdle > 90) stop();
		}

		function start() {
			if (running || destroyed || !active || !inView) return;
			running = true;
			rafId = requestAnimationFrame(frame);
		}
		function stop() {
			if (!running) return;
			running = false;
			cancelAnimationFrame(rafId);
		}

		async function build() {
			try {
				const h1 = wrapEl.querySelector('h1');
				const fontPx = h1 ? parseFloat(getComputedStyle(h1).fontSize) : 80;
				await Promise.all([
					document.fonts.load(`600 ${fontPx}px Fraunces`),
					document.fonts.load(`italic 400 ${fontPx}px Fraunces`)
				]).catch(() => {});
				if (destroyed) return;
				refreshColors();
				sizeCanvas();
				const sampled = sampleText();
				if (!sampled) return;
				applyHomes(sampled.homes);
				active = true;
				start();
			} catch {
				active = false;
			}
		}

		onLinesChanged = () => {
			if (!active) return;
			const sampled = sampleText();
			if (sampled) {
				applyHomes(sampled.homes);
				cursorIdle = 0;
				start();
			}
		};

		const unsubTheme = theme.subscribe(() => {
			if (!active) return;
			refreshColors();
			cursorIdle = 0;
			start();
		});

		const io = new IntersectionObserver(
			(entries) => {
				inView = entries[0].isIntersecting;
				if (!inView) stop();
				else {
					cursorIdle = 0;
					start();
				}
			},
			{ threshold: 0 }
		);
		io.observe(canvasEl);

		let resizeTimer: ReturnType<typeof setTimeout>;
		function onResize() {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(() => {
				if (!active) return;
				sizeCanvas();
				const sampled = sampleText();
				if (sampled) {
					applyHomes(sampled.homes);
					cursorIdle = 0;
					start();
				}
			}, 200);
		}
		window.addEventListener('resize', onResize);
		window.addEventListener('pointermove', onPointerMove, { passive: true });

		build();

		return () => {
			destroyed = true;
			onLinesChanged = null;
			stop();
			io.disconnect();
			unsubTheme();
			window.removeEventListener('resize', onResize);
			window.removeEventListener('pointermove', onPointerMove);
			clearTimeout(resizeTimer);
		};
	});
</script>

<div bind:this={wrapEl} class="ph-wrap" class:ph-wrap--on={active}>
	{@render children?.()}
	<canvas bind:this={canvasEl} class="ph-canvas" aria-hidden="true"></canvas>
</div>

<style>
	.ph-wrap {
		position: relative;
	}

	.ph-wrap--on :global(h1) {
		opacity: 0 !important;
	}

	.ph-canvas {
		position: absolute;
		top: -110px;
		left: -110px;
		width: calc(100% + 220px);
		height: calc(100% + 220px);
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.4s ease;
	}

	.ph-wrap--on .ph-canvas {
		opacity: 1;
	}
</style>
