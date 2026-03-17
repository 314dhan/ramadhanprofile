<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { t, locale } from '$lib/stores/i18n';
	import { theme } from '$lib/stores/theme';

	let isScrolled = $state(false);
	let isMenuOpen = $state(false);
	let isLangMenuOpen = $state(false);
	let activeSection = $state('intro');

	function handleScroll() {
		isScrolled = window.scrollY > 100;

		const sections = document.querySelectorAll('section');
		const scrollPosition = window.scrollY + 100;

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
		handleScroll(); // initial check
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('scroll', handleScroll);
		}
	});

	function scrollTo(id: string) {
		const element = document.getElementById(id);
		if (element) {
			window.scrollTo({
				top: element.offsetTop - 70,
				behavior: 'smooth'
			});
			isMenuOpen = false; // close mobile menu on click
		}
	}

	function setLanguage(lang: string) {
		locale.set(lang);
		isLangMenuOpen = false;
	}

	// Helper for the dropdown flag
	const flags: Record<string, string> = {
		en: 'EN \uD83C\uDDEC\uD83C\uDDE7',
		id: 'ID \uD83C\uDDEE\uD83C\uDDE9',
		ja: 'JP \uD83C\uDDEF\uD83C\uDDF5'
	};
</script>

<nav class="navbar navbar-expand-lg navbar-dark fixed-top" class:scrolled={isScrolled}>
	<div class="container">
		<a class="navbar-brand" href="#intro" onclick={(e) => { e.preventDefault(); scrollTo('intro'); }}>
			Ramadhan<span>.</span>
		</a>
		
		<button
			class="navbar-toggler"
			type="button"
			aria-expanded={isMenuOpen}
			aria-label="Toggle navigation"
			onclick={() => (isMenuOpen = !isMenuOpen)}
		>
			<span class="navbar-toggler-icon"></span>
		</button>
		
		<div class="collapse navbar-collapse" class:show={isMenuOpen} id="navbarNav">
			<ul class="navbar-nav ml-auto">
				<li class="nav-item">
					<a
						class="nav-link"
						class:active={activeSection === 'intro'}
						href="#intro"
						onclick={(e) => { e.preventDefault(); scrollTo('intro'); }}
					>
						{$t('home')}
					</a>
				</li>
				<li class="nav-item">
					<a
						class="nav-link"
						class:active={activeSection === 'about'}
						href="#about"
						onclick={(e) => { e.preventDefault(); scrollTo('about'); }}
					>
						{$t('about')}
					</a>
				</li>
				<li class="nav-item">
					<a
						class="nav-link"
						class:active={activeSection === 'tech-stack'}
						href="#tech-stack"
						onclick={(e) => { e.preventDefault(); scrollTo('tech-stack'); }}
					>
						{$t('skills')}
					</a>
				</li>
				<li class="nav-item">
					<a
						class="nav-link"
						class:active={activeSection === 'projects' || activeSection === 'game-projects'}
						href="#projects"
						onclick={(e) => { e.preventDefault(); scrollTo('projects'); }}
					>
						{$t('projects')}
					</a>
				</li>
				<li class="nav-item">
					<a
						class="nav-link"
						class:active={activeSection === 'contact'}
						href="#contact"
						onclick={(e) => { e.preventDefault(); scrollTo('contact'); }}
					>
						{$t('contact')}
					</a>
				</li>
			</ul>
			<div class="d-flex align-items-center mt-3 mt-lg-0 mb-2 mb-lg-0">
				<div class="theme-switcher mr-4" class:show={isLangMenuOpen}>
					<button
						class="btn btn-outline-light btn-sm"
						type="button"
						aria-label="Toggle Theme"
						onclick={() => $theme = $theme === 'dark' ? 'light' : 'dark'}
					>
						{#if $theme === 'dark'}
							<i class="fas fa-sun"></i>
						{:else}
							<i class="fas fa-moon"></i>
						{/if}
					</button>
				</div>
				<div class="dropdown language-switcher" class:show={isLangMenuOpen}>
					<button
						class="btn btn-outline-light btn-sm dropdown-toggle"
						type="button"
						aria-expanded={isLangMenuOpen}
						onclick={(e) => { e.preventDefault(); isLangMenuOpen = !isLangMenuOpen; }}
					>
						{flags[$locale]}
					</button>
					<div class="dropdown-menu" class:show={isLangMenuOpen}>
						<button class="dropdown-item" onclick={() => setLanguage('en')}>EN &#x1F1EC;&#x1F1E7;</button>
						<button class="dropdown-item" onclick={() => setLanguage('id')}>ID &#x1F1EE;&#x1F1E9;</button>
						<button class="dropdown-item" onclick={() => setLanguage('ja')}>JP &#x1F1EF;&#x1F1F5;</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</nav>

<style>
    /* Add specific overrides if needed, generic styles in app.css */
	.navbar-toggler {
		border: none;
		outline: none !important;
	}
	button.dropdown-item {
		width: 100%;
		text-align: left;
		background: none;
		border: none;
	}
</style>
