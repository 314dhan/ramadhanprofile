<script lang="ts">
	import { t } from '$lib/stores/i18n';
	import { onMount } from 'svelte';

	let visible = $state(false);
	onMount(() => {
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				visible = true;
				observer.disconnect();
			}
		}, { threshold: 0.1 });
		
		const section = document.getElementById('game-projects');
		if (section) observer.observe(section);
	});

	const games = [
		{ id: 1, img: '/images/roblox/lasbloxguys.png', url: 'https://ro.blox.com/Ebh5?af_dp=roblox%3A%2F%2Fnavigation%2Fgame_details%3FgameId%3D8734574120&af_web_dp=https%3A%2F%2Fwww.roblox.com%2Fgames%2F83595445760346' },
		{ id: 2, img: '/images/roblox/bloptower.png', url: 'https://ro.blox.com/Ebh5?af_dp=roblox%3A%2F%2Fnavigation%2Fgame_details%3FgameId%3D8445961159&af_web_dp=https%3A%2F%2Fwww.roblox.com%2Fgames%2F136041774963699' },
		{ id: 3, img: '/images/roblox/obby.png', url: 'https://ro.blox.com/Ebh5?af_dp=roblox%3A%2F%2Fnavigation%2Fgame_details%3FgameId%3D9099405016&af_web_dp=https%3A%2F%2Fwww.roblox.com%2Fgames%2F92183776319648' }
	];
</script>

<section id="game-projects" class:visible>
	<div class="container">
		<div class="row mb-5 align-items-end">
			<div class="col-lg-8">
				<span class="section-label">Roblox Creations</span>
				<h2 class="mt-3">{$t('my_game_projects_title')}</h2>
			</div>
			<div class="col-lg-4 text-lg-right">
				<p class="text-muted">{$t('my_game_projects_subtitle')}</p>
			</div>
		</div>

		<div class="games-grid">
			{#each games as game, i}
				<a 
					href={game.url} 
					class="game-item {visible ? 'fade-in-up' : ''}" 
					style="animation-delay: {i * 0.15}s"
					target="_blank"
				>
					<div class="image-container">
						<img src={game.img} alt={$t(`game${game.id}_title`)} loading="lazy" />
						<div class="image-overlay"></div>
					</div>
					<div class="game-info mt-4">
						<div class="d-flex justify-content-between align-items-start">
							<h3 class="game-title">{$t(`game${game.id}_title`)}</h3>
							<i class="fas fa-external-link-alt arrow-icon"></i>
						</div>
						<p class="game-desc">{$t(`game${game.id}_desc`)}</p>
						<div class="game-tags">
							<span class="tag">Roblox Studio</span>
							<span class="tag">Lua</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	#game-projects {
		background: var(--bg);
		padding: var(--space-12) 0;
	}

	.section-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--accent);
		font-weight: 700;
	}

	.games-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-8) var(--space-6);
	}

	.game-item {
		text-decoration: none;
		color: inherit;
		display: block;
		opacity: 0;
	}

	.game-item:hover {
		text-decoration: none;
		color: inherit;
	}

	.image-container {
		position: relative;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: var(--surface);
		border-radius: 2px;
	}

	.image-container img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.image-overlay {
		position: absolute;
		inset: 0;
		background: oklch(12% 0.1 260 / 0.1);
		opacity: 1;
		transition: opacity 0.6s ease;
	}

	.game-item:hover img {
		transform: scale(1.05);
	}

	.game-item:hover .image-overlay {
		opacity: 0;
	}

	.game-title {
		font-family: 'Fraunces', serif;
		font-size: 1.25rem;
		margin-bottom: 0.5rem;
		transition: color 0.3s ease;
	}

	.game-item:hover .game-title {
		color: var(--accent);
	}

	.game-desc {
		color: var(--text-muted);
		font-size: 0.875rem;
		line-height: 1.5;
		margin-bottom: 1rem;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.arrow-icon {
		font-size: 0.75rem;
		color: var(--text-dim);
		transition: all 0.3s ease;
	}

	.game-item:hover .arrow-icon {
		color: var(--accent);
		transform: translate(2px, -2px);
	}

	.game-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tag {
		font-size: 0.625rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 0.2rem 0.6rem;
		background: var(--surface-bright);
		color: var(--text-dim);
	}

	.fade-in-up {
		animation: fadeInUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	@keyframes fadeInUp {
		from { opacity: 0; transform: translateY(30px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@media (max-width: 991px) {
		.games-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 768px) {
		.games-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
