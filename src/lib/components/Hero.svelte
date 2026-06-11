<script lang="ts">
	import { t } from '$lib/stores/i18n';
	import { onMount } from 'svelte';
	import ParticleHeadline from '$lib/components/ParticleHeadline.svelte';
	import OrbitalSystem from '$lib/components/OrbitalSystem.svelte';
	import ParticleField from '$lib/components/ParticleField.svelte';

	let visible = $state(false);
	let fieldActive = $state(false);
	let mouseX = $state(0);
	let mouseY = $state(0);
	let clicks = $state<{ x: number; y: number; id: number }[]>([]);
	let clickId = 0;

	onMount(() => {
		setTimeout(() => visible = true, 100);
		function onMouseMove(e: MouseEvent) {
			mouseX = e.clientX;
			mouseY = e.clientY;
		}

		function onClick(e: MouseEvent) {
			const intro = document.getElementById('intro');
			if (!intro) return;
			const rect = intro.getBoundingClientRect();
			
			// Only trigger ripple if click is within the hero section
			if (
				e.clientX >= rect.left && e.clientX <= rect.right &&
				e.clientY >= rect.top && e.clientY <= rect.bottom
			) {
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;
				const id = clickId++;
				clicks.push({ x, y, id });
				
				setTimeout(() => {
					clicks = clicks.filter((c) => c.id !== id);
				}, 600);
			}
		}

		window.addEventListener('mousemove', onMouseMove, { passive: true });
		window.addEventListener('click', onClick, { passive: true });
		return () => {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('click', onClick);
		};
	});
</script>

<section id="intro" class:visible>
	<!-- Ambient spotlight that subtly follows cursor -->
	<div
		class="hero-ambient"
		style="--mx: {mouseX}px; --my: {mouseY}px;"
		aria-hidden="true"
	></div>

	<!-- Dot-matrix grid -->
	<div class="hero-grid {visible ? '' : 'hero-grid--off'}" aria-hidden="true"></div>

	<!-- Floating particle field -->
	<ParticleField onstatus={(v) => (fieldActive = v)} />

	<!-- Orbital solar system (3D CSS) -->
	<OrbitalSystem />

	<!-- Click ripples -->
	{#each clicks as click (click.id)}
		<div
			class="click-ripple"
			style="--rx: {click.x}px; --ry: {click.y}px;"
			aria-hidden="true"
		></div>
	{/each}

	<div class="container hero-content">
		<div class="row align-items-center">
			<div class="col-lg-10 offset-lg-1 text-center">
				<!-- Eyebrow label -->
				<div class="hero-eyebrow {visible ? 'fade-in-up' : ''}">
					<span class="eyebrow-dot"></span>
					<span>Available for work</span>
				</div>

				<ParticleHeadline
					line1={$t('hero_title').split(' ')[0]}
					line2={$t('hero_title').split(' ').slice(1).join(' ')}
				>
					<h1 class="hero-title {visible ? 'fade-in-up delay-1' : ''}">
						<span class="d-block mb-2">{$t('hero_title').split(' ')[0]}</span>
						<span class="italic-accent">{$t('hero_title').split(' ').slice(1).join(' ')}</span>
					</h1>
				</ParticleHeadline>
				
				<p class="hero-subtitle mt-4 {visible ? 'fade-in-up delay-2' : ''}">
					{$t('hero_subtitle')}
				</p>
				
				<div class="cta-group mt-5 {visible ? 'fade-in-up delay-3' : ''}">
					<a href="#about" class="btn btn-primary">
						{$t('explore_more')}
					</a>
					<a href="#contact" class="btn btn-outline-light">
						{$t('contact_me')}
					</a>
				</div>

			</div>
		</div>
	</div>

	<a href="#about" class="scroll-indicator {visible ? 'fade-in delay-5' : ''}" aria-label="Scroll Down">
		<span class="scroll-text">Scroll</span>
		<div class="scroll-line"></div>
	</a>
</section>

<style>
	#intro {
		height: 100vh;
		display: flex;
		align-items: center;
		overflow: hidden;
		position: relative;
	}

	/* Cursor-tracking ambient glow */
	.hero-ambient {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 0;
		background: radial-gradient(
			600px circle at var(--mx, 50%) var(--my, 30%),
			oklch(72% 0.15 200 / 0.07),
			transparent 70%
		);
		transition: background 0.3s ease;
	}

	.hero-content {
		position: relative;
		z-index: 1;
	}

	/* Click animation in background */
	.click-ripple {
		position: absolute;
		top: 0;
		left: 0;
		width: 100px;
		height: 100px;
		border-radius: 50%;
		border: 1px solid var(--accent);
		box-shadow: 0 0 16px var(--accent-bright) inset, 0 0 8px var(--accent);
		pointer-events: none;
		z-index: 0;
		animation: ripple-scale 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	@keyframes ripple-scale {
		0% {
			transform: translate(calc(var(--rx) - 50px), calc(var(--ry) - 50px)) scale(0);
			opacity: 0.8;
		}
		100% {
			transform: translate(calc(var(--rx) - 50px), calc(var(--ry) - 50px)) scale(1.5);
			opacity: 0;
		}
	}

	/* Eyebrow availability indicator */
	.hero-eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--text-dim);
		margin-bottom: var(--space-4);
	}

	.eyebrow-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: oklch(72% 0.18 145); /* green */
		box-shadow: 0 0 8px oklch(72% 0.18 145 / 0.6);
		animation: pulse-dot 2s ease-in-out infinite;
	}

	@keyframes pulse-dot {
		0%, 100% { opacity: 1; transform: scale(1); }
		50% { opacity: 0.6; transform: scale(0.85); }
	}

	.hero-title {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 700;
		line-height: 0.9;
	}

	.italic-accent {
		font-style: italic;
		font-weight: 400;
		color: var(--accent);
		display: block;
	}

	.hero-subtitle {
		font-size: clamp(1.1rem, 2vw, 1.4rem);
		color: var(--text-muted);
		max-width: 600px;
		margin: 0 auto;
	}

	.cta-group {
		display: flex;
		gap: var(--space-3);
		justify-content: center;
		flex-wrap: wrap;
	}

	.scroll-indicator {
		position: absolute;
		bottom: var(--space-8);
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
		text-decoration: none;
		opacity: 0;
		z-index: 1;
	}

	.scroll-text {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--text-dim);
	}

	.scroll-line {
		width: 1px;
		height: 60px;
		background: linear-gradient(to bottom, var(--accent), transparent);
		animation: scrollLine 2s infinite cubic-bezier(0.16, 1, 0.3, 1);
		transform-origin: top;
	}

	@keyframes scrollLine {
		0% { transform: scaleY(0); opacity: 0; }
		50% { transform: scaleY(1); opacity: 1; }
		100% { transform: scaleY(0); opacity: 0; transform-origin: bottom; }
	}

	.fade-in-up {
		animation: fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.fade-in {
		animation: fadeIn 1.2s ease both;
	}

	.delay-1 { animation-delay: 0.15s; }
	.delay-2 { animation-delay: 0.3s; }
	.delay-3 { animation-delay: 0.45s; }
	.delay-5 { animation-delay: 1.2s; }

	@keyframes fadeInUp {
		from { opacity: 0; transform: translateY(40px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	/* Dot-matrix grid */
	.hero-grid {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(circle, oklch(72% 0.15 200 / 0.18) 1px, transparent 1px);
		background-size: 28px 28px;
		pointer-events: none;
		z-index: 0;
		transition: opacity 1.2s ease;
	}

	.hero-grid--off {
		opacity: 0;
	}

	:global(.light-theme) .hero-grid {
		background-image: radial-gradient(circle, oklch(52% 0.2 200 / 0.14) 1px, transparent 1px);
	}

</style>
