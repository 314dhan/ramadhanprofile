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

	function handleScroll() {
		showBackToTop = window.scrollY > 300;
		
		// Scroll progress bar
		const docHeight = document.documentElement.scrollHeight;
		const winHeight = window.innerHeight;
		const scrollPercent = (window.scrollY / (docHeight - winHeight)) * 100;
		const progressBar = document.getElementById('progressBar');
		if (progressBar) {
			progressBar.style.width = scrollPercent + '%';
		}
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

	function scrollToTop() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}
</script>

<div class="progress-container">
	<div class="progress-bar" id="progressBar"></div>
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
	class="back-to-top" 
	class:active={showBackToTop} 
	onclick={scrollToTop}
	aria-label="Back to top"
>
	<i class="fas fa-arrow-up"></i>
</button>

<style>
/* Remove default button styles for back-to-top */
.back-to-top {
	border: none;
	outline: none;
}
</style>
