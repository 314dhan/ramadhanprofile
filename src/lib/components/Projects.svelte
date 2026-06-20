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
		
		const section = document.getElementById('projects');
		if (section) observer.observe(section);
	});

	const projects = [
		{ id: 4, img: '/images/tinpets.png', url: 'https://314dhan.github.io/tinpets/', tags: ['HTML', 'CSS', 'JS'] },
		{ id: 5, img: '/images/urlsortener.png', url: 'https://linkshortener-chi.vercel.app/', tags: ['NodeJS', 'JS'] },
		{ id: 6, img: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=800&q=80', url: 'https://chat-app-messaging-gamma.vercel.app/', tags: ['Vue', 'NodeJS'] },
		{ id: 7, img: '/images/kanji-flash-card-projecto.png', url: 'https://kanji-flash-card-project.vercel.app/', tags: ['JS', 'CSS'] },
		{ id: 8, img: '/images/sswfood.png', url: 'https://ssw-foodfactory.vercel.app/', tags: ['HTML', 'CSS'] },
		{ id: 9, img: '/images/ssw-restoran.png', url: 'https://ssw-restoran.vercel.app/', tags: ['JS', 'CSS'] },
		{ id: 10, img: '/images/kolam-renang.png', url: 'https://kolam-renang-cv-tirta-nada.vercel.app/', tags: ['HTML', 'CSS', 'JS'] },
		{ id: 11, img: '/images/horror-forest.png', url: 'https://horror-forest-game.vercel.app/', tags: ['JS', 'Game'] }
	];

	const aiRepos = [
		{ name: 'coding-llm-local', description: 'Local LLM coding assistant — run AI code suggestions offline', language: 'Python', url: 'https://github.com/314dhan/coding-llm-local' },
		{ name: 'compress-video-python', description: 'Batch video compression script with configurable quality settings', language: 'Python', url: 'https://github.com/314dhan/compress-video-python' },
		{ name: 'download-manager', description: 'Python download manager with queue and progress tracking', language: 'Python', url: 'https://github.com/314dhan/download-manager' },
		{ name: 'translator-screen', description: 'Screen-based translation tool — translate any text on screen in real time', language: 'Python', url: 'https://github.com/314dhan/translator-screen' },
	];
</script>

<section id="projects" class:visible>
	<span class="ghost-num ghost-num--right" aria-hidden="true">03</span>
	<div class="container">
		<div class="row mb-5 align-items-end">
			<div class="col-lg-8">
				<h2 class="mt-0">{$t('my_projects_title')}</h2>
			</div>
			<div class="col-lg-4 text-lg-right">
				<p class="text-muted">{$t('my_projects_subtitle')}</p>
			</div>
		</div>

		<div class="projects-grid">
			{#each projects as project, i}
				<a 
					href={project.url} 
					class="project-item {visible ? 'fade-in-up' : ''}" 
					style="animation-delay: {i * 0.1}s"
					target="_blank"
				>
					<div class="image-container">
						<img src={project.img} alt={$t(`project${project.id}_title`)} loading="lazy" />
						<div class="image-overlay"></div>
					</div>
					<div class="project-info mt-4">
						<div class="d-flex justify-content-between align-items-start">
							<h3 class="project-title">{$t(`project${project.id}_title`)}</h3>
							<i class="fas fa-arrow-right arrow-icon"></i>
						</div>
						<p class="project-desc">{$t(`project${project.id}_desc`)}</p>
						<div class="project-tags">
							{#each project.tags as tag}
								<span class="tag">{tag}</span>
							{/each}
						</div>
					</div>
				</a>
			{/each}
		</div>

		<div class="ai-section {visible ? 'fade-in-up' : ''}" style="animation-delay: 0.4s">
			<div class="row mb-4 align-items-end">
				<div class="col-lg-8">
					<h3 class="ai-section-title mt-2">Python tools built with Claude AI</h3>
				</div>
			</div>
			<div class="repos-grid">
				{#each aiRepos as repo, i}
					<a
						href={repo.url}
						class="repo-item {visible ? 'fade-in-up' : ''}"
						style="animation-delay: {(projects.length + i) * 0.1}s"
						target="_blank"
						rel="noopener"
					>
						<div class="repo-icon-wrapper">
							<i class="fab fa-github repo-icon"></i>
						</div>
						<div class="repo-info">
							<div class="d-flex justify-content-between align-items-start">
								<h3 class="project-title repo-name">{repo.name}</h3>
								<i class="fas fa-arrow-right arrow-icon"></i>
							</div>
							<p class="project-desc">{repo.description}</p>
							<div class="project-tags">
								<span class="tag">{repo.language}</span>
								<span class="tag tag--claude">Built with Claude</span>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.projects-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-8) var(--space-6);
	}

	.project-item {
		text-decoration: none;
		color: inherit;
		display: block;
	}

	.project-item:hover {
		text-decoration: none;
		color: inherit;
	}

	.image-container {
		position: relative;
		aspect-ratio: 16 / 10;
		overflow: hidden;
		background: var(--surface);
	}

	/* Scroll-driven wipe reveal; browsers without scroll timelines keep the fade-in-up */
	@supports (animation-timeline: view()) {
		.image-container {
			animation: img-wipe linear both;
			animation-timeline: view();
			animation-range: entry 10% entry 65%;
		}
	}

	@keyframes img-wipe {
		from { clip-path: inset(0 100% 0 0); }
		to   { clip-path: inset(0 0 0 0); }
	}

	@media (prefers-reduced-motion: reduce) {
		.image-container { animation: none; }
	}

	.image-container img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: grayscale(0.5);
		transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.image-overlay {
		position: absolute;
		inset: 0;
		background: oklch(12% 0.1 200 / 0.2);
		opacity: 1;
		transition: opacity 0.6s ease;
	}

	.project-item:hover img {
		filter: grayscale(0);
		transform: scale(1.05);
	}

	.project-item:hover .image-overlay {
		opacity: 0;
	}

	.project-title {
		font-family: 'Barlow Condensed', sans-serif;
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
		transition: color 0.3s ease;
	}

	.project-item:hover .project-title {
		color: var(--accent);
	}

	.project-desc {
		color: var(--text-muted);
		font-size: 0.9375rem;
		line-height: 1.5;
		margin-bottom: 1.25rem;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.arrow-icon {
		font-size: 0.875rem;
		transform: rotate(-45deg);
		color: var(--text-dim);
		transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.project-item:hover .arrow-icon {
		transform: rotate(0deg);
		color: var(--accent);
	}

	.project-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tag {
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 0.25rem 0.75rem;
		border: 1px solid var(--border);
		color: var(--text-dim);
	}

	.fade-in-up {
		animation: fadeInUp 1s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	@keyframes fadeInUp {
		from { opacity: 0; transform: translateY(30px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.ai-section {
		border-top: 1px solid var(--border);
		padding-top: var(--space-8);
		margin-top: var(--space-8);
	}

	.ai-section-title {
		font-family: 'Barlow Condensed', sans-serif;
		font-size: 1.5rem;
		color: var(--text-muted);
		font-weight: 400;
	}

	.repos-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-4);
	}

	.repo-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		text-decoration: none;
		color: inherit;
		padding: var(--space-4);
		border: 1px solid var(--border);
		background: var(--surface);
		transition: border-color 0.3s ease, background 0.3s ease;
	}

	.repo-item:hover {
		text-decoration: none;
		color: inherit;
		border-color: var(--accent);
		background: var(--surface-bright);
	}

	.repo-icon-wrapper {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border);
		color: var(--text-dim);
		transition: all 0.3s ease;
	}

	.repo-item:hover .repo-icon-wrapper {
		border-color: var(--accent);
		color: var(--accent);
	}

	.repo-icon { font-size: 1.1rem; }
	.repo-name { font-size: 0.9rem !important; letter-spacing: 0.02em; }

	.tag--claude {
		border-color: var(--accent);
		color: var(--accent);
	}

	@media (max-width: 991px) {
		.repos-grid { grid-template-columns: repeat(2, 1fr); }
	}

	@media (max-width: 768px) {
		.projects-grid {
			grid-template-columns: 1fr;
			gap: var(--space-8);
		}
		.repos-grid { grid-template-columns: 1fr; }
	}
</style>
