<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { t, locale } from '$lib/stores/i18n';
	import { theme } from '$lib/stores/theme';

	let isScrolled = $state(false);
	let isMenuOpen = $state(false);
	let isLangMenuOpen = $state(false);
	let isHidden = $state(false);
	let activeSection = $state('intro');
	let clock = $state('');

	let lastY = 0;

	const timeFmt = new Intl.DateTimeFormat(undefined, {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});

	function updateClock() {
		clock = timeFmt.format(new Date());
	}

	function handleScroll() {
		const y = window.scrollY;
		isScrolled = y > 50;

		// Hide on scroll down, reveal on scroll up. Always shown near the top
		// and while the mobile menu is open.
		if (isMenuOpen || y < 80) {
			isHidden = false;
		} else if (y > lastY + 4) {
			isHidden = true;
		} else if (y < lastY - 4) {
			isHidden = false;
		}
		lastY = y;

		const sections = document.querySelectorAll('section');
		const scrollPosition = y + 120;
		sections.forEach((section) => {
			if (
				section.offsetTop <= scrollPosition &&
				section.offsetTop + section.offsetHeight > scrollPosition
			) {
				activeSection = section.id;
			}
		});
	}

	function handleOutsideClick(e: MouseEvent) {
		if (!isLangMenuOpen) return;
		const switcher = document.querySelector('.language-switcher');
		if (switcher && !switcher.contains(e.target as Node)) {
			isLangMenuOpen = false;
		}
	}

	let clockTimer: ReturnType<typeof setInterval>;

	onMount(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		document.addEventListener('click', handleOutsideClick);
		handleScroll();
		updateClock();
		clockTimer = setInterval(updateClock, 1000);
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('scroll', handleScroll);
			document.removeEventListener('click', handleOutsideClick);
			clearInterval(clockTimer);
		}
	});

	function scrollTo(id: string) {
		const element = document.getElementById(id);
		if (element) {
			const offset = 96;
			const bodyRect = document.body.getBoundingClientRect().top;
			const elementRect = element.getBoundingClientRect().top;
			const offsetPosition = elementRect - bodyRect - offset;

			window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
			isMenuOpen = false;
		}
	}

	function setLanguage(lang: string) {
		locale.set(lang);
		isLangMenuOpen = false;
	}

	const flags: Record<string, string> = { en: 'EN', ja: 'JP' };
</script>

<nav class="navshell" class:hidden={isHidden}>
	<div class="pill" class:scrolled={isScrolled}>
		<a class="brand" href="#intro" onclick={(e) => { e.preventDefault(); scrollTo('intro'); }}>
			RAMADHAN<span>.</span>
		</a>

		<ul class="links">
			{#each ['intro', 'about', 'experience', 'tech-stack', 'projects', 'contact'] as id}
				<li>
					<a
						class="nav-link"
						class:active={activeSection === id || (id === 'projects' && activeSection === 'game-projects')}
						href="#{id}"
						onclick={(e) => { e.preventDefault(); scrollTo(id); }}
					>
						{$t(id === 'intro' ? 'home' : id === 'tech-stack' ? 'skills' : id)}
					</a>
				</li>
			{/each}
		</ul>

		<div class="controls">
			<span class="clock" aria-label="Local time">
				<span class="clock-dot"></span>
				<time>{clock}</time>
			</span>
			<span class="divider" aria-hidden="true"></span>

			<button
				class="icon-btn"
				onclick={() => $theme = $theme === 'dark' ? 'light' : 'dark'}
				aria-label="Toggle Theme"
			>
				{#if $theme === 'dark'}
					<i class="fas fa-sun"></i>
				{:else}
					<i class="fas fa-moon"></i>
				{/if}
			</button>

			<div class="language-switcher">
				<button class="lang-btn" onclick={() => isLangMenuOpen = !isLangMenuOpen}>
					{flags[$locale]}
					<i class="fas fa-chevron-down" style="font-size: 0.55rem;"></i>
				</button>
				{#if isLangMenuOpen}
					<div class="lang-dropdown">
						<button onclick={() => setLanguage('en')}>English</button>
						<button onclick={() => setLanguage('ja')}>日本語</button>
					</div>
				{/if}
			</div>

			<button
				class="burger-btn"
				type="button"
				aria-expanded={isMenuOpen}
				aria-label="Toggle navigation"
				onclick={() => (isMenuOpen = !isMenuOpen)}
			>
				<div class="burger" class:open={isMenuOpen}>
					<span></span>
					<span></span>
				</div>
			</button>
		</div>
	</div>

	<!-- Mobile dropdown panel -->
	{#if isMenuOpen}
		<div class="mobile-panel">
			{#each ['intro', 'about', 'experience', 'tech-stack', 'projects', 'contact'] as id}
				<a
					class="mobile-link"
					class:active={activeSection === id || (id === 'projects' && activeSection === 'game-projects')}
					href="#{id}"
					onclick={(e) => { e.preventDefault(); scrollTo(id); }}
				>
					{$t(id === 'intro' ? 'home' : id === 'tech-stack' ? 'skills' : id)}
				</a>
			{/each}
		</div>
	{/if}
</nav>

<style>
	.navshell {
		position: fixed;
		top: var(--space-3);
		left: 50%;
		transform: translateX(-50%);
		width: min(1100px, calc(100% - var(--space-4)));
		z-index: 1000;
		transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
			opacity 0.35s ease;
	}

	.navshell.hidden {
		transform: translateX(-50%) translateY(calc(-100% - var(--space-4)));
		opacity: 0;
	}

	.pill {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		padding: 0.55rem 0.6rem 0.55rem 1.25rem;
		border: 1px solid var(--border);
		border-radius: 100px;
		background: color-mix(in oklch, var(--bg) 70%, transparent);
		backdrop-filter: blur(14px) saturate(1.3);
		-webkit-backdrop-filter: blur(14px) saturate(1.3);
		transition: border-color 0.4s ease, background 0.4s ease, box-shadow 0.4s ease;
	}

	.pill.scrolled {
		border-color: var(--border-bright);
		box-shadow: 0 10px 30px -12px oklch(0% 0 0 / 0.45);
	}

	/* ── Brand ─────────────────────────────── */
	.brand {
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 700;
		font-size: 1.25rem;
		letter-spacing: 0.12em;
		color: var(--text-main);
		text-decoration: none;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.brand span { color: var(--accent); }

	/* ── Center links ──────────────────────── */
	.links {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav-link {
		display: block;
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--text-muted);
		text-decoration: none;
		padding: 0.45rem 0.85rem;
		border-radius: 100px;
		position: relative;
		transition: color 0.3s ease, background 0.3s ease;
	}

	.nav-link:hover {
		color: var(--text-main);
	}

	.nav-link.active {
		color: var(--text-main);
		background: color-mix(in oklch, var(--accent) 14%, transparent);
	}

	/* ── Controls ──────────────────────────── */
	.controls {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		flex-shrink: 0;
	}

	/* ── Local clock ───────────────────────── */
	.clock {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding-left: 0.4rem;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.clock time {
		min-width: 5ch; /* reserve width so digits don't jitter the layout */
	}

	.clock-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 8px color-mix(in oklch, var(--accent) 60%, transparent);
		animation: clock-pulse 2s ease-in-out infinite;
	}

	@keyframes clock-pulse {
		0%, 100% { opacity: 1; transform: scale(1); }
		50% { opacity: 0.5; transform: scale(0.8); }
	}

	@media (prefers-reduced-motion: reduce) {
		.clock-dot { animation: none; }
	}

	.divider {
		width: 1px;
		height: 18px;
		background: var(--border-bright);
		margin: 0 0.25rem;
	}

	.icon-btn, .lang-btn {
		background: none;
		border: none;
		color: var(--text-muted);
		cursor: pointer;
		transition: color 0.3s ease;
		display: flex;
		align-items: center;
	}

	.icon-btn {
		width: 36px;
		height: 36px;
		justify-content: center;
		border-radius: 50%;
		font-size: 0.875rem;
	}

	.icon-btn:hover, .lang-btn:hover { color: var(--text-main); }
	.icon-btn:hover { background: var(--surface); }

	.lang-btn {
		font-weight: 700;
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		gap: 0.3rem;
		padding: 0.45rem 0.6rem;
		border-radius: 100px;
	}

	.lang-btn:hover { background: var(--surface); }

	.language-switcher { position: relative; }

	.lang-dropdown {
		position: absolute;
		top: calc(100% + 0.6rem);
		right: 0;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: var(--space-2);
		min-width: 130px;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		box-shadow: 0 12px 28px -14px oklch(0% 0 0 / 0.5);
		animation: dropFade 0.3s cubic-bezier(0.22, 1, 0.36, 1);
	}

	@keyframes dropFade {
		from { opacity: 0; transform: translateY(-8px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.lang-dropdown button {
		background: none;
		border: none;
		color: var(--text-muted);
		text-align: left;
		padding: 0.5rem 0.85rem;
		border-radius: 8px;
		font-size: 0.8125rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.lang-dropdown button:hover {
		background: var(--surface-bright);
		color: var(--text-main);
	}

	/* ── Burger (mobile only) ──────────────── */
	.burger-btn {
		display: none;
		background: none;
		border: none;
		cursor: pointer;
		width: 36px;
		height: 36px;
		align-items: center;
		justify-content: center;
	}

	.burger {
		width: 22px;
		height: 16px;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 6px;
	}

	.burger span {
		display: block;
		width: 100%;
		height: 1.5px;
		background: var(--text-main);
		transition: transform 0.3s ease;
	}

	.burger.open span:nth-child(1) { transform: translateY(4px) rotate(45deg); }
	.burger.open span:nth-child(2) { transform: translateY(-3.5px) rotate(-45deg); }

	/* ── Mobile dropdown panel ─────────────── */
	.mobile-panel {
		display: none;
		flex-direction: column;
		margin-top: 0.6rem;
		padding: var(--space-3);
		border: 1px solid var(--border);
		border-radius: 18px;
		background: color-mix(in oklch, var(--bg) 88%, transparent);
		backdrop-filter: blur(14px) saturate(1.3);
		-webkit-backdrop-filter: blur(14px) saturate(1.3);
		animation: dropFade 0.3s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.mobile-link {
		padding: 0.75rem 0.5rem;
		font-size: 0.85rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: var(--text-muted);
		text-decoration: none;
		border-bottom: 1px solid var(--border);
		transition: color 0.3s ease;
	}

	.mobile-link:last-child { border-bottom: none; }
	.mobile-link:hover, .mobile-link.active { color: var(--accent); }

	/* ── Responsive ────────────────────────── */
	@media (max-width: 860px) {
		.links { display: none; }
		.burger-btn { display: flex; }
		.mobile-panel { display: flex; }
		.divider { display: none; } /* drop separator on mobile to save room */
		.clock { padding-left: 0; }
	}

	/* Only the smallest phones can't fit the clock alongside everything */
	@media (max-width: 380px) {
		.clock { display: none; }
	}
</style>
