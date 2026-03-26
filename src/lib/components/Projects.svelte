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
		{ id: 4, img: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=800&q=80', url: 'https://314dhan.github.io/tinpets/', tags: ['HTML', 'CSS', 'JS'] },
		{ id: 5, img: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=800&q=80', url: 'https://linkshortener-chi.vercel.app/', tags: ['NodeJS', 'JS'] },
		{ id: 6, img: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=800&q=80', url: 'https://chat-app-messaging-gamma.vercel.app/', tags: ['Vue', 'NodeJS'] },
		{ id: 7, img: '/images/kanji-flash-card-projecto.png', url: 'https://kanji-flash-card-project.vercel.app/', tags: ['JS', 'CSS'] },
		{ id: 8, img: '/images/sswfood.png', url: 'https://ssw-foodfactory.vercel.app/', tags: ['HTML', 'CSS'] },
		{ id: 9, img: '/images/ssw-restoran.png', url: 'https://ssw-restoran.vercel.app/', tags: ['JS', 'CSS'] }
	];
</script>

<section id="projects" class:visible>
	<div class="container">
		<div class="row mb-5 align-items-end">
			<div class="col-lg-8">
				<span class="section-label">Selected Works</span>
				<h2 class="mt-3">{$t('my_projects_title')}</h2>
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
	</div>
</section>

<style>
	.section-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--accent);
		font-weight: 700;
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-8) var(--space-6);
	}

	.project-item {
		text-decoration: none;
		color: inherit;
		display: block;
		opacity: 0;
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
		background: oklch(12% 0.1 260 / 0.2);
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
		font-family: 'Fraunces', serif;
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
		transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
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
		animation: fadeInUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	@keyframes fadeInUp {
		from { opacity: 0; transform: translateY(30px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@media (max-width: 768px) {
		.projects-grid {
			grid-template-columns: 1fr;
			gap: var(--space-8);
		}
	}
</style>
