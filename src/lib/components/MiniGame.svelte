<script lang="ts">
	import { gameStore } from '$lib/stores/game';
	import Tetris from '$lib/components/games/Tetris.svelte';
	import { onMount } from 'svelte';

	let showButton = $state(false);
	let gameMounted = $state(false);

	function handleScroll() {
		showButton = window.scrollY > 400;
	}

	function openGame() {
		gameMounted = true;
		gameStore.open();
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();

		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'Escape' && $gameStore.open) gameStore.close();
		}
		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<!-- Modal: stays in DOM after first open so game state persists -->
<div
	class="modal-container"
	class:hidden={!$gameStore.open}
	aria-hidden={!$gameStore.open}
>
	<div
		class="modal-backdrop"
		onclick={() => gameStore.close()}
		role="presentation"
	></div>

	<div
		class="modal-panel"
		role="dialog"
		aria-modal="true"
		aria-label="Tetris"
	>
		<div class="modal-header">
			<h3 class="modal-title">Tetris</h3>
			<button class="close-btn" onclick={() => gameStore.close()} aria-label="Close game">
				×
			</button>
		</div>
		<div class="modal-body">
			{#if gameMounted}
				<Tetris paused={!$gameStore.open} />
			{/if}
		</div>
	</div>
</div>

<button
	class="game-btn"
	class:visible={showButton}
	onclick={openGame}
	aria-label="Open Tetris"
>
	<i class="fas fa-gamepad"></i>
</button>

<style>
	.modal-container {
		position: fixed;
		inset: 0;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal-container.hidden {
		visibility: hidden;
		pointer-events: none;
	}

	.modal-backdrop {
		position: absolute;
		inset: 0;
		background: oklch(8% 0.01 260 / 0.75);
		backdrop-filter: blur(4px);
	}

	.modal-panel {
		position: relative;
		z-index: 1;
		background: var(--surface);
		border: 1px solid var(--border-bright);
		padding: var(--space-4);
		max-height: 90vh;
		overflow-y: auto;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-3);
	}

	.modal-title {
		font-family: 'Fraunces', serif;
		font-size: 1.25rem;
		color: var(--text-main);
		margin: 0;
	}

	.close-btn {
		background: none;
		border: none;
		color: var(--text-dim);
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		padding: 0 var(--space-1);
		transition: color 0.2s ease;
	}

	.close-btn:hover {
		color: var(--text-main);
	}

	.modal-body {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	/* Mirrors back-to-top button, bottom-left */
	.game-btn {
		position: fixed;
		bottom: var(--space-6);
		left: var(--space-6);
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
		font-size: 1rem;
	}

	.game-btn.visible {
		opacity: 1;
		visibility: visible;
	}

	.game-btn:hover {
		background: var(--accent);
		color: white;
		border-color: var(--accent);
		transform: translateY(-4px);
	}
</style>
