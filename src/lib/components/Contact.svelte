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
		
		const section = document.getElementById('contact');
		if (section) observer.observe(section);
	});
</script>

<section id="contact" class:visible>
	<div class="container">
		<div class="row mb-5">
			<div class="col-lg-8">
				<span class="section-label">Get in Touch</span>
				<h2 class="mt-3">{$t('contact_title')}</h2>
				<p class="text-muted mt-3">{$t('contact_subtitle')}</p>
			</div>
		</div>

		<div class="contact-grid">
			<div class="contact-item {visible ? 'fade-in-up' : ''}" style="animation-delay: 0.1s">
				<div class="contact-icon">
					<i class="fas fa-envelope"></i>
				</div>
				<div class="contact-content">
					<span class="contact-label">{$t('email')}</span>
					<a href="mailto:ramadhan25321@gmail.com" class="contact-value">ramadhan25321@gmail.com</a>
				</div>
			</div>

			<div class="contact-item {visible ? 'fade-in-up' : ''}" style="animation-delay: 0.2s">
				<div class="contact-icon">
					<i class="fas fa-phone"></i>
				</div>
				<div class="contact-content">
					<span class="contact-label">{$t('phone')}</span>
					<a href="tel:+6289501700818" class="contact-value">+62 895 0170 0818</a>
				</div>
			</div>

			<div class="contact-item {visible ? 'fade-in-up' : ''}" style="animation-delay: 0.3s">
				<div class="contact-icon">
					<i class="fas fa-map-marker-alt"></i>
				</div>
				<div class="contact-content">
					<span class="contact-label">{$t('location')}</span>
					<span class="contact-value">{$t('indonesia')}</span>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	#contact {
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

	.contact-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-6);
		margin-top: var(--space-8);
	}

	.contact-item {
		padding: var(--space-6);
		border-bottom: 1px solid var(--border);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
		opacity: 0;
	}

	.contact-item:hover {
		border-bottom-color: var(--accent);
		background: var(--surface);
		transform: translateY(-4px);
	}

	.contact-icon {
		font-size: 1.25rem;
		color: var(--accent);
	}

	.contact-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.contact-label {
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-dim);
		font-weight: 700;
	}

	.contact-value {
		font-size: 1.125rem;
		color: var(--text-main);
		text-decoration: none;
		transition: color 0.3s ease;
	}

	a.contact-value:hover {
		color: var(--accent);
	}

	.fade-in-up {
		animation: fadeInUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	@keyframes fadeInUp {
		from { opacity: 0; transform: translateY(30px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@media (max-width: 991px) {
		.contact-grid {
			grid-template-columns: 1fr;
			gap: 0;
		}
		
		.contact-item {
			padding: var(--space-6) 0;
		}
	}
</style>
