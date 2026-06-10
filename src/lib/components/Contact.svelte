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
	<span class="ghost-num ghost-num--right" aria-hidden="true">05</span>
	<div class="container">
		<div class="row mb-5">
			<div class="col-lg-8">
				<div class="section-eyebrow">
					<span class="section-eyebrow__num">05</span>
					<span class="section-eyebrow__rule"></span>
					<span class="section-eyebrow__text">Get in Touch</span>
				</div>
				<div class="contact-heading-row mt-2">
					<h2 class="contact-h2 mt-0">{$t('contact_title')}</h2>
					<span class="available-badge">
						<span class="avail-dot"></span>
						Available
					</span>
				</div>
				<p class="contact-lead mt-3">{$t('contact_subtitle')}</p>
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

	.contact-heading-row {
		display: flex;
		align-items: flex-end;
		gap: var(--space-4);
		flex-wrap: wrap;
	}

	.contact-h2 {
		margin-bottom: 0;
	}

	.available-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.6875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: oklch(72% 0.18 145);
		padding-bottom: 0.375rem;
		white-space: nowrap;
	}

	.avail-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: oklch(72% 0.18 145);
		box-shadow: 0 0 6px oklch(72% 0.18 145 / 0.5);
		animation: pulse-dot 2s ease-in-out infinite;
		flex-shrink: 0;
	}

	@keyframes pulse-dot {
		0%, 100% { opacity: 1; transform: scale(1); }
		50% { opacity: 0.5; transform: scale(0.8); }
	}

	.contact-lead {
		font-size: 1rem;
		color: var(--text-muted);
		line-height: 1.7;
		max-width: 520px;
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
