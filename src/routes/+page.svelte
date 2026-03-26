<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Skills from '$lib/components/Skills.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import GameProjects from '$lib/components/GameProjects.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount, onDestroy } from 'svelte';

	let showBackToTop = $state(false);
	let scrollPercent = $state(0);

	function handleScroll() {
		showBackToTop = window.scrollY > 400;
		
		const docHeight = document.documentElement.scrollHeight;
		const winHeight = window.innerHeight;
		scrollPercent = (window.scrollY / (docHeight - winHeight)) * 100;
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('scroll', handleScroll);
		}
	});

	function scrollToTop() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}
</script>

<div class="scroll-progress">
	<div class="progress-fill" style="width: {scrollPercent}%"></div>
</div>

<Navbar />

<main>
	<Hero />
	<About />
	<Skills />
	<Projects />
	<GameProjects />
	<Contact />
</main>

<Footer />

<button 
	class="back-to-top-btn" 
	class:visible={showBackToTop} 
	onclick={scrollToTop}
	aria-label="Back to top"
>
	<i class="fas fa-arrow-up"></i>
</button>

<style>
	.scroll-progress {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 2px;
		background: transparent;
		z-index: 2000;
	}

	.progress-fill {
		height: 100%;
		background: var(--accent);
		transition: width 0.1s ease-out;
	}

	.back-to-top-btn {
		position: fixed;
		bottom: var(--space-6);
		right: var(--space-6);
		width: 48px;
		height: 48px;
		background: var(--surface);
		border: 1px solid var(--border);
		color: var(--text-main);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		opacity: 0;
		visibility: hidden;
		transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
		z-index: 900;
	}

	.back-to-top-btn.visible {
		opacity: 1;
		visibility: visible;
	}

	.back-to-top-btn:hover {
		background: var(--accent);
		color: white;
		border-color: var(--accent);
		transform: translateY(-4px);
	}
</style>
