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
	<title>Ramadhan | Designer & Engineer</title>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
	<!-- Bootstrap is kept for grid utilities, but custom styles will override its aesthetics -->
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
	<link rel="icon" type="image/png" href="/images/profile.png" />
</svelte:head>

{@render children()}
