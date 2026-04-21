<script lang="ts">
	import { t } from '$lib/stores/i18n';
	import { onMount } from 'svelte';

	let visible = $state(false);
	let mouseX = $state(0);
	let mouseY = $state(0);

	onMount(() => {
		setTimeout(() => visible = true, 100);

		function onMouseMove(e: MouseEvent) {
			mouseX = e.clientX;
			mouseY = e.clientY;
		}
		window.addEventListener('mousemove', onMouseMove, { passive: true });
		return () => window.removeEventListener('mousemove', onMouseMove);
	});
</script>

<section id="intro" class:visible>
	<!-- Ambient spotlight that subtly follows cursor -->
	<div 
		class="hero-ambient"
		style="--mx: {mouseX}px; --my: {mouseY}px;"
		aria-hidden="true"
	></div>

	<!-- Decorative grid -->
	<div class="hero-grid" aria-hidden="true"></div>

	<div class="container hero-content">
		<div class="row align-items-center">
			<div class="col-lg-10 offset-lg-1 text-center">
				<!-- Eyebrow label -->
				<div class="hero-eyebrow {visible ? 'fade-in-up' : ''}">
					<span class="eyebrow-dot"></span>
					<span>Available for work</span>
				</div>

				<h1 class="hero-title {visible ? 'fade-in-up delay-1' : ''}">
					<span class="d-block mb-2">{$t('hero_title').split(' ')[0]}</span>
					<span class="italic-accent">{$t('hero_title').split(' ').slice(1).join(' ')}</span>
				</h1>
				
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

				<!-- Floating tech badges -->
				<div class="tech-badges {visible ? 'fade-in delay-4' : ''}">
					{#each ['PHP', 'Laravel', 'Flutter', 'Node.js', 'Python'] as tech, i}
						<span class="tech-badge" style="animation-delay: {0.6 + i * 0.1}s">{tech}</span>
					{/each}
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
			oklch(72% 0.14 260 / 0.06),
			transparent 70%
		);
		transition: background 0.3s ease;
	}

	/* Subtle dot-grid overlay */
	.hero-grid {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 0;
		background-image: radial-gradient(circle, oklch(65% 0.02 260 / 0.15) 1px, transparent 1px);
		background-size: 40px 40px;
		mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%);
	}

	.hero-content {
		position: relative;
		z-index: 1;
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
		opacity: 0;
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
		font-family: 'Fraunces', serif;
		font-weight: 600;
		line-height: 0.9;
		opacity: 0;
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
		opacity: 0;
	}

	.cta-group {
		opacity: 0;
		display: flex;
		gap: var(--space-3);
		justify-content: center;
		flex-wrap: wrap;
	}

	/* Tech badge strip */
	.tech-badges {
		display: flex;
		wrap: nowrap;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: var(--space-6);
		opacity: 0;
	}

	.tech-badge {
		display: inline-block;
		padding: 0.3rem 0.9rem;
		border: 1px solid var(--border);
		color: var(--text-dim);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
		cursor: default;
		opacity: 0;
		animation: badgeFadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	.tech-badge:hover {
		border-color: var(--accent);
		color: var(--accent);
		background: oklch(72% 0.14 260 / 0.06);
	}

	@keyframes badgeFadeIn {
		from { opacity: 0; transform: translateY(8px); }
		to { opacity: 1; transform: translateY(0); }
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
		animation: fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	.fade-in {
		animation: fadeIn 1.2s ease forwards;
	}

	.delay-1 { animation-delay: 0.15s; }
	.delay-2 { animation-delay: 0.3s; }
	.delay-3 { animation-delay: 0.45s; }
	.delay-4 { animation-delay: 0.6s; }
	.delay-5 { animation-delay: 1.2s; }

	@keyframes fadeInUp {
		from { opacity: 0; transform: translateY(40px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@media (max-width: 768px) {
		.tech-badges { display: none; }
	}
</style>
