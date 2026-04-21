<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { onMount, onDestroy } from 'svelte';
	import '../app.css';

	let { children } = $props();

	let dotEl: HTMLElement;
	let ringEl: HTMLElement;
	let mouseX = 0, mouseY = 0;
	let ringX = 0, ringY = 0;
	let rafId: number;

	onMount(() => {
		const unsubscribe = theme.subscribe((currentTheme) => {
			if (typeof document !== 'undefined') {
				if (currentTheme === 'light') {
					document.documentElement.classList.add('light-theme');
				} else {
					document.documentElement.classList.remove('light-theme');
				}
			}
		});

		// Custom cursor — only on pointer-fine devices
		const isPointerFine = window.matchMedia('(pointer: fine)').matches;
		if (isPointerFine) {
			function onMove(e: MouseEvent) {
				mouseX = e.clientX;
				mouseY = e.clientY;
				if (dotEl) {
					dotEl.style.left = mouseX + 'px';
					dotEl.style.top = mouseY + 'px';
				}
			}

			function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

			function animateRing() {
				ringX = lerp(ringX, mouseX, 0.12);
				ringY = lerp(ringY, mouseY, 0.12);
				if (ringEl) {
					ringEl.style.left = ringX + 'px';
					ringEl.style.top = ringY + 'px';
				}
				rafId = requestAnimationFrame(animateRing);
			}

			function onHoverLink() {
				if (ringEl) { ringEl.style.width = '52px'; ringEl.style.height = '52px'; }
			}
			function onLeaveLink() {
				if (ringEl) { ringEl.style.width = '32px'; ringEl.style.height = '32px'; }
			}

			window.addEventListener('mousemove', onMove, { passive: true });
			document.querySelectorAll('a, button').forEach(el => {
				el.addEventListener('mouseenter', onHoverLink);
				el.addEventListener('mouseleave', onLeaveLink);
			});
			rafId = requestAnimationFrame(animateRing);

			return () => {
				window.removeEventListener('mousemove', onMove);
				cancelAnimationFrame(rafId);
			};
		}

		return unsubscribe;
	});
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
	<title>Ramadhan | Designer & Engineer</title>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
	<!-- Bootstrap is kept for grid utilities, but custom styles will override its aesthetics -->
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
	<link rel="icon" type="image/png" href="/images/profile.png" />
</svelte:head>

<!-- Custom cursor elements -->
<div id="cursor-dot" bind:this={dotEl} aria-hidden="true"></div>
<div id="cursor-ring" bind:this={ringEl} aria-hidden="true"></div>

{@render children()}
