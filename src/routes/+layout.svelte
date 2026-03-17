<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { onMount, onDestroy } from 'svelte';
	import '../app.css';

	let { children } = $props();

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

		return unsubscribe;
	});
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
	<title>Ramadhan - Portfolio</title>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
	<!-- Required Core Stylesheet -->
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
	<link rel="icon" type="image/png" href="/images/profile.png" />
	<link
		href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
	<!-- Required Particles.js for interactive hero canvas -->
	<script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
</svelte:head>

{@render children()}
