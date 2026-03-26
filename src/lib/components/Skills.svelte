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
		
		const section = document.getElementById('tech-stack');
		if (section) observer.observe(section);
	});

	const skillCategories = [
		{
			title: 'Backend',
			skills: [
				{ name: 'php_skill', icon: 'fab fa-php' },
				{ name: 'laravel_skill', icon: 'fab fa-laravel' },
				{ name: 'nodejs_skill', icon: 'fab fa-node-js' },
				{ name: 'db_skill', icon: 'fas fa-database' },
				{ name: 'python_skill', icon: 'fab fa-python' },
				{ name: 'java_skill', icon: 'fab fa-java' }
			]
		},
		{
			title: 'Frontend & Others',
			skills: [
				{ name: 'js_skill', icon: 'fab fa-js' },
				{ name: 'react_skill', icon: 'fab fa-react' },
				{ name: 'vuejs_skill', icon: 'fab fa-vuejs' },
				{ name: 'flutter_skill', icon: 'fas fa-mobile-alt' },
				{ name: 'dart_skill', icon: 'fas fa-bullseye' },
				{ name: 'lua_skill', icon: 'fas fa-file-code' },
				{ name: 'mobile_skill', icon: 'fas fa-mobile-alt' }
			]
		}
	];
</script>

<section id="tech-stack" class:visible>
	<div class="container">
		<div class="row mb-5">
			<div class="col-lg-8">
				<span class="section-label">Expertise</span>
				<h2 class="mt-3">{$t('my_skills_title')}</h2>
				<p class="text-muted mt-3">{$t('my_skills_subtitle')}</p>
			</div>
		</div>

		<div class="skills-container">
			{#each skillCategories as category, catIndex}
				<div class="skill-category {visible ? 'fade-in-up' : ''}" style="animation-delay: {catIndex * 0.2}s">
					<h3 class="category-title">{category.title}</h3>
					<div class="skills-grid">
						{#each category.skills as skill}
							<div class="skill-item">
								<div class="skill-icon">
									<i class={skill.icon}></i>
								</div>
								<div class="skill-info">
									<h4 class="skill-name">{$t(skill.name)}</h4>
									<p class="skill-desc">{$t(skill.name + '_desc')}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	#tech-stack {
		background: var(--surface);
		padding: var(--space-12) 0;
	}

	.section-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--accent);
		font-weight: 700;
	}

	.skills-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
	}

	.category-title {
		font-family: 'Fraunces', serif;
		font-size: 1.25rem;
		color: var(--text-dim);
		margin-bottom: var(--space-6);
		padding-bottom: var(--space-2);
		border-bottom: 1px solid var(--border);
		display: inline-block;
	}

	.skills-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-6) var(--space-8);
	}

	.skill-item {
		display: flex;
		gap: var(--space-4);
		transition: transform 0.3s ease;
	}

	.skill-item:hover {
		transform: translateX(8px);
	}

	.skill-icon {
		font-size: 1.5rem;
		color: var(--accent);
		margin-top: 0.25rem;
		opacity: 0.8;
		transition: all 0.3s ease;
	}

	.skill-item:hover .skill-icon {
		opacity: 1;
		transform: scale(1.1);
	}

	.skill-name {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-main);
		margin-bottom: 0.25rem;
	}

	.skill-desc {
		font-size: 0.8125rem;
		color: var(--text-muted);
		line-height: 1.5;
	}

	.fade-in-up {
		animation: fadeInUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
		opacity: 0;
	}

	@keyframes fadeInUp {
		from { opacity: 0; transform: translateY(30px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@media (max-width: 991px) {
		.skills-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 576px) {
		.skills-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
