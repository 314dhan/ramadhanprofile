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
		}, { threshold: 0.2 });
		
		const section = document.getElementById('about');
		if (section) observer.observe(section);
	});
</script>

<section id="about" class:visible>
	<div class="container">
		<div class="row align-items-center">
			<div class="col-lg-5 mb-5 mb-lg-0 {visible ? 'fade-in-left' : ''}">
				<div class="image-wrapper">
					<img
						src="/images/IMG_36.jpg"
						alt="About Me"
						class="img-fluid about-img"
					/>
					<div class="image-accent"></div>
				</div>
			</div>
			
			<div class="col-lg-6 offset-lg-1 {visible ? 'fade-in-right' : ''}">
				<span class="section-label">Biography</span>
				<h2 class="mt-3">{$t('about_me_title')}</h2>
				
				<div class="about-content mt-4">
					<p class="lead-text">{$t('about_me_p1')}</p>
					<p>{$t('about_me_p2')}</p>
					<p>{$t('about_me_p3')}</p>
				</div>
				
				<div class="social-links mt-5">
					<a
						href="https://www.linkedin.com/in/ramadhan-50973b1aa/"
						target="_blank"
						class="social-link"
					>
						<span class="link-icon"><i class="fab fa-linkedin-in"></i></span>
						<span class="link-text">{$t('linkedin')}</span>
					</a>
					<a 
						href="https://github.com/314dhan" 
						target="_blank" 
						class="social-link ml-4"
					>
						<span class="link-icon"><i class="fab fa-github"></i></span>
						<span class="link-text">{$t('github')}</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	#about {
		background: var(--bg);
		opacity: 0;
		transition: opacity 1s ease;
	}

	#about.visible {
		opacity: 1;
	}

	.section-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--accent);
		font-weight: 700;
	}

	.image-wrapper {
		position: relative;
		padding-right: var(--space-4);
		padding-bottom: var(--space-4);
	}

	.about-img {
		position: relative;
		z-index: 2;
		filter: grayscale(0.2) contrast(1.1);
		border-radius: 2px;
		transition: filter 0.6s ease;
	}

	.about-img:hover {
		filter: grayscale(0);
	}

	.image-accent {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 80%;
		height: 80%;
		border: 1px solid var(--accent);
		z-index: 1;
		opacity: 0.3;
	}

	.lead-text {
		font-size: 1.125rem;
		color: var(--text-main);
		font-weight: 500;
		margin-bottom: var(--space-4);
	}

	.about-content p:not(.lead-text) {
		color: var(--text-muted);
		line-height: 1.8;
		margin-bottom: var(--space-3);
	}

	.social-link {
		display: inline-flex;
		align-items: center;
		text-decoration: none;
		color: var(--text-muted);
		font-weight: 600;
		font-size: 0.875rem;
		transition: color 0.3s ease;
	}

	.social-link:hover {
		color: var(--accent);
		text-decoration: none;
	}

	.link-icon {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border);
		border-radius: 50%;
		margin-right: 12px;
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.social-link:hover .link-icon {
		border-color: var(--accent);
		background: var(--accent);
		color: white;
		transform: translateY(-2px);
	}

	.fade-in-left {
		animation: fadeInLeft 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	.fade-in-right {
		animation: fadeInRight 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	@keyframes fadeInLeft {
		from { opacity: 0; transform: translateX(-40px); }
		to { opacity: 1; transform: translateX(0); }
	}

	@keyframes fadeInRight {
		from { opacity: 0; transform: translateX(40px); }
		to { opacity: 1; transform: translateX(0); }
	}
</style>
