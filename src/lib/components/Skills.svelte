<script lang="ts">
	import { t } from '$lib/stores/i18n';
	import { onMount } from 'svelte';

	let visible = $state(false);

	// Element refs for drag
	let backendInner:  HTMLElement | null = null;
	let frontendInner: HTMLElement | null = null;

	// Drag state (imperative, no reactivity needed)
	const drag = {
		active: false,
		startX: 0,
		originTx: 0,
		el: null as HTMLElement | null
	};

	function getTranslateX(el: HTMLElement): number {
		return new DOMMatrix(window.getComputedStyle(el).transform).m41;
	}

	function startDrag(e: MouseEvent, el: HTMLElement | null) {
		if (!el || e.button !== 0) return;
		e.preventDefault();
		const tx = getTranslateX(el);
		el.style.animationPlayState = 'paused';
		el.style.transform = `translateX(${tx}px)`;
		drag.active    = true;
		drag.startX    = e.clientX;
		drag.originTx  = tx;
		drag.el        = el;
	}

	function onDragMove(e: MouseEvent) {
		if (!drag.active || !drag.el) return;
		drag.el.style.transform = `translateX(${drag.originTx + (e.clientX - drag.startX)}px)`;
	}

	function endDrag() {
		if (!drag.active || !drag.el) return;
		drag.el.style.animationPlayState = '';
		drag.el.style.transform = '';
		drag.active = false;
		drag.el     = null;
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					visible = true;
					observer.disconnect();
				}
			},
			{ threshold: 0.1 }
		);
		const section = document.getElementById('tech-stack');
		if (section) observer.observe(section);

		document.addEventListener('mousemove', onDragMove);
		document.addEventListener('mouseup',   endDrag);

		return () => {
			observer.disconnect();
			document.removeEventListener('mousemove', onDragMove);
			document.removeEventListener('mouseup',   endDrag);
		};
	});

	const backendBase  = ['PHP', 'Laravel', 'Node.js', 'MySQL', 'Python', 'Java', 'PostgreSQL', 'REST APIs'];
	const frontendBase = ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Svelte', 'Flutter', 'Dart', 'Lua', 'CSS'];

	// Duplicate for seamless -50% loop; bake alternating style into data
	const backendItems  = [...backendBase,  ...backendBase ].map((name, i) => ({ name, outline: i % 2 !== 0 }));
	const frontendItems = [...frontendBase, ...frontendBase].map((name, i) => ({ name, outline: i % 2 !== 0 }));
</script>

<section id="tech-stack" class:visible>
	<div class="container">
		<div class="row">
			<div class="col-lg-6">
				<div class="section-eyebrow">
					<span class="section-eyebrow__num">02</span>
					<span class="section-eyebrow__rule"></span>
					<span class="section-eyebrow__text">Expertise</span>
				</div>
				<h2 class="mt-0">{$t('my_skills_title')}</h2>
			</div>
			<div class="col-lg-5 offset-lg-1 d-flex align-items-end">
				<p class="intro-text">{$t('my_skills_subtitle')}</p>
			</div>
		</div>
	</div>

	<div class="bands {visible ? 'bands--visible' : ''}">
		<!-- Backend band -->
		<div class="band">
			<div class="container band-meta">
				<span class="band-number">01</span>
				<span class="band-label">Backend</span>
			</div>
			<div class="marquee" role="region" aria-label="Backend skills" onmousedown={(e) => startDrag(e, backendInner)}>
				<div class="marquee__inner" bind:this={backendInner}>
					{#each backendItems as item}
						<span
							class="marquee__item"
							class:marquee__item--outline={item.outline}
							aria-hidden="true"
						>{item.name}</span>
						<span class="marquee__sep" aria-hidden="true">◆</span>
					{/each}
				</div>
			</div>
		</div>

		<!-- Frontend & Tools band (reverse) -->
		<div class="band">
			<div class="container band-meta">
				<span class="band-number">02</span>
				<span class="band-label">Frontend & Tools</span>
			</div>
			<div class="marquee marquee--reverse" role="region" aria-label="Frontend and tools skills" onmousedown={(e) => startDrag(e, frontendInner)}>
				<div class="marquee__inner" bind:this={frontendInner}>
					{#each frontendItems as item}
						<span
							class="marquee__item"
							class:marquee__item--outline={item.outline}
							aria-hidden="true"
						>{item.name}</span>
						<span class="marquee__sep" aria-hidden="true">◆</span>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Accessible text list, visually hidden -->
	<div class="sr-only">
		<p>Backend skills: {backendBase.join(', ')}</p>
		<p>Frontend and tools: {frontendBase.join(', ')}</p>
	</div>
</section>

<style>
	#tech-stack {
		background: var(--surface);
		padding: var(--space-12) 0;
		overflow: hidden;
	}

	.intro-text {
		color: var(--text-muted);
		font-size: 0.9375rem;
		line-height: 1.7;
		margin: 0;
		padding-bottom: 0.25rem;
	}

	/* ── Bands ──────────────────────────────── */

	.bands {
		margin-top: var(--space-8);
		opacity: 0;
		transform: translateY(16px);
		transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.bands--visible {
		opacity: 1;
		transform: translateY(0);
	}

	.band {
		border-top: 1px solid var(--border);
		padding: var(--space-4) 0;
	}

	.band:last-child {
		border-bottom: 1px solid var(--border);
	}

	.band-meta {
		display: flex;
		align-items: baseline;
		gap: var(--space-3);
		margin-bottom: var(--space-3);
	}

	.band-number {
		font-family: 'Fraunces', serif;
		font-size: 0.6875rem;
		font-weight: 600;
		color: var(--text-dim);
		letter-spacing: 0.12em;
	}

	.band-label {
		font-size: 0.6875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--text-muted);
	}

	/* ── Marquee ────────────────────────────── */

	.marquee {
		overflow: hidden;
		cursor: grab;
		width: 100%;
		mask-image: linear-gradient(
			to right,
			transparent,
			black 80px,
			black calc(100% - 80px),
			transparent
		);
		-webkit-mask-image: linear-gradient(
			to right,
			transparent,
			black 80px,
			black calc(100% - 80px),
			transparent
		);
	}

	.marquee:active {
		cursor: grabbing;
	}

	.marquee:hover .marquee__inner {
		animation-play-state: paused;
	}

	.marquee__inner {
		display: flex;
		align-items: center;
		width: max-content;
		animation: scroll-fwd 32s linear infinite;
	}

	.marquee--reverse .marquee__inner {
		animation-name: scroll-rev;
		animation-duration: 36s;
	}

	@keyframes scroll-fwd {
		from { transform: translateX(0); }
		to   { transform: translateX(-50%); }
	}

	@keyframes scroll-rev {
		from { transform: translateX(-50%); }
		to   { transform: translateX(0); }
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee__inner { animation: none; }
	}

	/* ── Items ──────────────────────────────── */

	.marquee__item {
		display: inline-block;
		padding: 0.25rem 1.5rem;
		font-size: 1.25rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		white-space: nowrap;
		user-select: none;
		color: var(--text-main);
		transition: color 0.25s ease;
		cursor: default;
	}

	.marquee__item:hover:not(.marquee__item--outline) {
		color: var(--accent);
	}

	/* Outlined variant */
	.marquee__item--outline {
		color: transparent;
		-webkit-text-stroke: 1.5px oklch(45% 0.02 260 / 0.55);
		transition: -webkit-text-stroke-color 0.25s ease;
	}

	.marquee__item--outline:hover {
		-webkit-text-stroke-color: var(--accent);
	}

	/* Separator diamond */
	.marquee__sep {
		font-size: 0.35rem;
		color: var(--accent);
		opacity: 0.35;
		user-select: none;
		padding: 0 0.25rem;
		vertical-align: middle;
	}

	/* Screen-reader list */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
