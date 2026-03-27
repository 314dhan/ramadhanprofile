<script lang="ts">
	import { t } from '$lib/stores/i18n';
	import { onMount } from 'svelte';

	let visible = $state(false);

	onMount(() => {
		setTimeout(() => visible = true, 100);
	});
</script>

<section id="intro" class:visible>
	<div class="container hero-content">
		<div class="row align-items-center">
			<div class="col-lg-10 offset-lg-1 text-center">
				<h1 class="hero-title {visible ? 'fade-in-up' : ''}">
					<span class="d-block mb-2">{$t('hero_title').split(' ')[0]}</span>
					<span class="italic-accent">{$t('hero_title').split(' ').slice(1).join(' ')}</span>
				</h1>
				
				<p class="hero-subtitle mt-4 {visible ? 'fade-in-up delay-1' : ''}">
					{$t('hero_subtitle')}
				</p>
				
				<div class="cta-group mt-5 {visible ? 'fade-in-up delay-2' : ''}">
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

	<a href="#about" class="scroll-indicator {visible ? 'fade-in' : ''}" aria-label="Scroll Down">
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
		background: radial-gradient(circle at 10% 90%, oklch(25% 0.1 260 / 0.1), transparent 40%);
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

	.delay-1 { animation-delay: 0.2s; }
	.delay-2 { animation-delay: 0.4s; }

	@keyframes fadeInUp {
		from { opacity: 0; transform: translateY(40px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
</style>
