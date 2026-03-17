<script lang="ts">
	import { t } from '$lib/stores/i18n';
	import { onMount, onDestroy } from 'svelte';

	let displayText = $state('');
	let isTyping = $state(false);

	$effect(() => {
		const fullText = $t('hero_title');
		let i = 0;
		displayText = '';
		isTyping = true;

		let timeoutId: ReturnType<typeof setTimeout>;
		const typeNextChar = () => {
			if (i < fullText.length) {
				displayText += fullText.charAt(i);
				i++;
				// Random delay for realistic typing
				timeoutId = setTimeout(typeNextChar, Math.random() * 80 + 40);
			} else {
				isTyping = false;
			}
		};

		timeoutId = setTimeout(typeNextChar, 50);

		return () => clearTimeout(timeoutId);
	});

	onMount(() => {
		// Wait for Particles.js to load from CDN
		const initParticles = () => {
			if (window.particlesJS) {
				window.particlesJS('particles-js', {
					particles: {
						number: { value: 80, density: { enable: true, value_area: 800 } },
						color: { value: '#6c63ff' },
						shape: {
							type: 'circle',
							stroke: { width: 0, color: '#000000' },
							polygon: { nb_sides: 5 }
						},
						opacity: {
							value: 0.5,
							random: false,
							anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }
						},
						size: {
							value: 3,
							random: true,
							anim: { enable: false, speed: 40, size_min: 0.1, sync: false }
						},
						line_linked: { enable: true, distance: 150, color: '#6c63ff', opacity: 0.4, width: 1 },
						move: {
							enable: true,
							speed: 2,
							direction: 'none',
							random: false,
							straight: false,
							out_mode: 'out',
							bounce: false,
							attract: { enable: false, rotateX: 600, rotateY: 1200 }
						}
					},
					interactivity: {
						detect_on: 'canvas',
						events: {
							onhover: { enable: true, mode: 'grab' },
							onclick: { enable: true, mode: 'push' },
							resize: true
						},
						modes: {
							grab: { distance: 140, line_linked: { opacity: 1 } },
							bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
							repulse: { distance: 200, duration: 0.4 },
							push: { particles_nb: 4 },
							remove: { particles_nb: 2 }
						}
					},
					retina_detect: true
				});
			} else {
				setTimeout(initParticles, 100);
			}
		};
		initParticles();
	});
</script>

<section id="intro">
	<div id="particles-js"></div>
	<div class="hero-content">
		<h1 class="typewriter-text">
			{displayText}<span class="blinking-cursor" class:typing={isTyping}>|</span>
		</h1>
		<p class="hero-subtitle">{$t('hero_subtitle')}</p>
		<div class="mt-4">
			<a href="#about" class="btn btn-primary mr-3">{$t('explore_more')}</a>
			<a href="#contact" class="btn btn-outline-light">{$t('contact_me')}</a>
		</div>
	</div>
	<a href="#about" class="scroll-down" aria-label="Scroll Down">
		<i class="fas fa-chevron-down"></i>
	</a>
</section>
