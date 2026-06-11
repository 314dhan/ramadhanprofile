<script lang="ts">
	import { onMount } from 'svelte';

	let offsetX = $state(0);
	let offsetY = $state(0);

	const PLANETS = [
		{
			id: 1, size: 8,  orbitR: 72,  speed: 7,  delay: 0,
			highlight: 'oklch(82% 0.22 42)',
			base: 'oklch(58% 0.24 32)',
			glow: 'oklch(72% 0.22 38 / 0.8)'
		},
		{
			id: 2, size: 15, orbitR: 128, speed: 15, delay: -5,
			highlight: 'oklch(68% 0.19 222)',
			base: 'oklch(48% 0.22 228)',
			glow: 'oklch(60% 0.2 224 / 0.75)'
		},
		{
			id: 3, size: 5,  orbitR: 174, speed: 22, delay: -8,
			highlight: 'oklch(78% 0.16 148)',
			base: 'oklch(56% 0.19 142)',
			glow: 'oklch(68% 0.17 145 / 0.7)'
		},
		{
			id: 4, size: 11, orbitR: 228, speed: 36, delay: -14,
			highlight: 'oklch(74% 0.18 298)',
			base: 'oklch(52% 0.21 304)',
			glow: 'oklch(64% 0.19 300 / 0.75)'
		}
	];

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		let rafId: number;
		let targetX = 0, targetY = 0;
		let curX = 0, curY = 0;

		function onMove(e: MouseEvent) {
			const intro = document.getElementById('intro');
			if (!intro) return;
			const rect = intro.getBoundingClientRect();
			targetX = ((e.clientX - rect.left) / rect.width  - 0.5) * -18;
			targetY = ((e.clientY - rect.top)  / rect.height - 0.5) * -18;
		}

		function tick() {
			curX += (targetX - curX) * 0.04;
			curY += (targetY - curY) * 0.04;
			offsetX = curX;
			offsetY = curY;
			rafId = requestAnimationFrame(tick);
		}

		window.addEventListener('mousemove', onMove, { passive: true });
		rafId = requestAnimationFrame(tick);

		return () => {
			window.removeEventListener('mousemove', onMove);
			cancelAnimationFrame(rafId);
		};
	});
</script>

<div class="solar-wrap" aria-hidden="true">
	<div
		class="solar-system"
		style="transform: translate({offsetX}px, {offsetY}px);"
	>
		<!-- Central star -->
		<div class="star">
			<div class="corona"></div>
			<div class="corona corona--slow"></div>
		</div>

		{#each PLANETS as p (p.id)}
			<div
				class="orbit"
				style="
					top: calc(-1 * {p.orbitR}px);
					left: calc(-1 * {p.orbitR}px);
					width: {p.orbitR * 2}px;
					height: {p.orbitR * 2}px;
				"
			>
				<div
					class="planet-carrier"
					style="animation-duration: {p.speed}s; animation-delay: {p.delay}s;"
				>
					<div
						class="planet"
						style="
							width: {p.size}px;
							height: {p.size}px;
							left: {p.orbitR}px;
							top: {-(p.size / 2)}px;
							background: radial-gradient(circle at 36% 28%, {p.highlight}, {p.base});
							box-shadow: 0 0 {p.size * 2.5}px {p.glow}, 0 0 {p.size * 0.8}px oklch(100% 0 0 / 0.25) inset;
						"
					></div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.solar-wrap {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
		z-index: 0;
	}

	.solar-system {
		position: relative;
		width: 0;
		height: 0;
		will-change: transform;
	}

	/* ── Star ── */
	.star {
		position: absolute;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		background: radial-gradient(circle at 38% 32%, oklch(96% 0.1 88), oklch(84% 0.28 52) 55%, oklch(70% 0.26 44));
		box-shadow:
			0 0 18px oklch(90% 0.24 58 / 0.95),
			0 0 52px oklch(80% 0.26 50 / 0.55),
			0 0 110px oklch(72% 0.24 44 / 0.28);
		animation: star-pulse 3.2s ease-in-out infinite;
		z-index: 2;
	}

	@keyframes star-pulse {
		0%, 100% {
			box-shadow:
				0 0 18px oklch(90% 0.24 58 / 0.95),
				0 0 52px oklch(80% 0.26 50 / 0.55),
				0 0 110px oklch(72% 0.24 44 / 0.28);
		}
		50% {
			box-shadow:
				0 0 26px oklch(94% 0.2 62 / 1),
				0 0 72px oklch(83% 0.24 52 / 0.65),
				0 0 150px oklch(74% 0.22 46 / 0.38);
		}
	}

	.corona {
		position: absolute;
		inset: -14px;
		border-radius: 50%;
		background: conic-gradient(
			oklch(88% 0.2 56 / 0.12) 0deg,
			transparent 60deg,
			oklch(88% 0.2 56 / 0.08) 120deg,
			transparent 180deg,
			oklch(88% 0.2 56 / 0.1) 240deg,
			transparent 300deg,
			oklch(88% 0.2 56 / 0.12) 360deg
		);
		animation: corona-spin 9s linear infinite;
	}

	.corona--slow {
		inset: -20px;
		animation-duration: 16s;
		animation-direction: reverse;
		background: conic-gradient(
			transparent 0deg,
			oklch(85% 0.18 50 / 0.07) 40deg,
			transparent 100deg,
			oklch(85% 0.18 50 / 0.05) 200deg,
			transparent 260deg,
			oklch(85% 0.18 50 / 0.07) 320deg,
			transparent 360deg
		);
	}

	@keyframes corona-spin {
		from { transform: rotate(0deg); }
		to   { transform: rotate(360deg); }
	}

	/* ── Orbit rings ── */
	.orbit {
		position: absolute;
		border: 1px solid oklch(68% 0.04 260 / 0.2);
		border-radius: 50%;
	}

	:global(.light-theme) .orbit {
		border-color: oklch(28% 0.04 260 / 0.22);
	}

	/* ── Planet carrier ── */
	.planet-carrier {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		transform-origin: 0 0;
		animation: orbit-spin linear infinite;
		will-change: transform;
	}

	@keyframes orbit-spin {
		from { transform: rotate(0deg); }
		to   { transform: rotate(360deg); }
	}

	/* ── Planet ── */
	.planet {
		position: absolute;
		border-radius: 50%;
	}

	/* ── Reduced motion ── */
	@media (prefers-reduced-motion: reduce) {
		.planet-carrier { animation: none; }
		.corona          { animation: none; }
		.star            { animation: none; }
	}

	/* ── Mobile ── */
	@media (max-width: 768px) {
		.solar-wrap {
			transform: translate(-50%, -50%) scale(0.55);
			opacity: 0.35;
		}
	}
</style>
