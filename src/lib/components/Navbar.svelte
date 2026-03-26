<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { t, locale } from '$lib/stores/i18n';
	import { theme } from '$lib/stores/theme';

	let isScrolled = $state(false);
	let isMenuOpen = $state(false);
	let isLangMenuOpen = $state(false);
	let activeSection = $state('intro');

	function handleScroll() {
		isScrolled = window.scrollY > 50;

		const sections = document.querySelectorAll('section');
		const scrollPosition = window.scrollY + 120;

		sections.forEach((section) => {
			if (
				section.offsetTop <= scrollPosition &&
				section.offsetTop + section.offsetHeight > scrollPosition
			) {
				activeSection = section.id;
			}
		});
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		handleScroll();
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('scroll', handleScroll);
		}
	});

	function scrollTo(id: string) {
		const element = document.getElementById(id);
		if (element) {
			const offset = 80;
			const bodyRect = document.body.getBoundingClientRect().top;
			const elementRect = element.getBoundingClientRect().top;
			const elementPosition = elementRect - bodyRect;
			const offsetPosition = elementPosition - offset;

			window.scrollTo({
				top: offsetPosition,
				behavior: 'smooth'
			});
			isMenuOpen = false;
		}
	}

	function setLanguage(lang: string) {
		locale.set(lang);
		isLangMenuOpen = false;
	}

	const flags: Record<string, string> = {
		en: 'EN',
		id: 'ID',
		ja: 'JP'
	};
</script>

<nav class="navbar navbar-expand-lg fixed-top" class:scrolled={isScrolled}>
	<div class="container">
		<a class="navbar-brand" href="#intro" onclick={(e) => { e.preventDefault(); scrollTo('intro'); }}>
			RAMADHAN<span>.</span>
		</a>
		
		<button
			class="navbar-toggler"
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
		
		<div class="collapse navbar-collapse" class:show={isMenuOpen}>
			<ul class="navbar-nav ml-auto">
				{#each ['intro', 'about', 'tech-stack', 'projects', 'contact'] as id}
					<li class="nav-item">
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
			
			<div class="d-flex align-items-center ml-lg-4 mt-4 mt-lg-0">
				<button
					class="icon-btn mr-3"
					onclick={() => $theme = $theme === 'dark' ? 'light' : 'dark'}
					aria-label="Toggle Theme"
				>
					{#if $theme === 'dark'}
						<i class="fas fa-sun"></i>
					{:else}
						<i class="fas fa-moon"></i>
					{/if}
				</button>
				
				<div class="dropdown language-switcher">
					<button
						class="lang-btn"
						onclick={() => isLangMenuOpen = !isLangMenuOpen}
					>
						{flags[$locale]}
						<i class="fas fa-chevron-down ml-2" style="font-size: 0.6rem;"></i>
					</button>
					{#if isLangMenuOpen}
						<div class="lang-dropdown">
							<button onclick={() => setLanguage('en')}>English</button>
							<button onclick={() => setLanguage('id')}>Indonesia</button>
							<button onclick={() => setLanguage('ja')}>日本語</button>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</nav>

<style>
	.navbar {
		padding: var(--space-6) 0;
		background: transparent;
		transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
		z-index: 1000;
	}

	.navbar.scrolled {
		padding: var(--space-3) 0;
		background: var(--bg);
		border-bottom: 1px solid var(--border);
	}

	.navbar-brand {
		font-family: 'Fraunces', serif;
		font-weight: 800;
		font-size: 1.25rem;
		letter-spacing: 0.1em;
		color: var(--text-main) !important;
	}

	.navbar-brand span {
		color: var(--accent);
	}

	.nav-link {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--text-muted) !important;
		padding: 0.5rem 1rem !important;
		transition: all 0.3s ease;
		position: relative;
	}

	.nav-link:hover, .nav-link.active {
		color: var(--text-main) !important;
	}

	.nav-link.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 1rem;
		right: 1rem;
		height: 1px;
		background: var(--accent);
	}

	.icon-btn, .lang-btn {
		background: none;
		border: none;
		color: var(--text-muted);
		font-size: 0.875rem;
		padding: 0.5rem;
		cursor: pointer;
		transition: color 0.3s ease;
	}

	.icon-btn:hover, .lang-btn:hover {
		color: var(--text-main);
	}

	.lang-btn {
		font-weight: 700;
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		display: flex;
		align-items: center;
	}

	.language-switcher {
		position: relative;
	}

	.lang-dropdown {
		position: absolute;
		top: 100%;
		right: 0;
		background: var(--surface);
		border: 1px solid var(--border);
		padding: var(--space-2);
		min-width: 120px;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin-top: 0.5rem;
		animation: dropFade 0.3s cubic-bezier(0.22, 1, 0.36, 1);
	}

	@keyframes dropFade {
		from { opacity: 0; transform: translateY(-10px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.lang-dropdown button {
		background: none;
		border: none;
		color: var(--text-muted);
		text-align: left;
		padding: 0.5rem 1rem;
		font-size: 0.8125rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.lang-dropdown button:hover {
		background: var(--surface-bright);
		color: var(--text-main);
	}

	.burger {
		width: 24px;
		height: 24px;
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
		transition: all 0.3s ease;
	}

	.burger.open span:nth-child(1) { transform: translateY(4px) rotate(45deg); }
	.burger.open span:nth-child(2) { transform: translateY(-3.5px) rotate(-45deg); }

	@media (max-width: 991px) {
		.navbar-collapse {
			background: var(--bg);
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			padding: var(--space-8) var(--space-4);
			border-bottom: 1px solid var(--border);
		}
	}
</style>
