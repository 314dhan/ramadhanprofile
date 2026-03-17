<script lang="ts">
	import { t } from '$lib/stores/i18n';
	import { fadeInAction } from './About.svelte';
</script>

<section id="contact" class="fade-in" use:fadeInAction>
	<div class="container">
		<h2 class="text-center">{$t('contact_title')}</h2>
		<p class="text-center mb-5">{$t('contact_subtitle')}</p>

		<div class="row mt-5">
			<div class="col-md-4 text-center">
				<div class="contact-info">
					<i class="fas fa-envelope fa-2x mb-3" style="color: var(--primary-color);"></i>
					<h5>{$t('email')}</h5>
					<p>ramadhan25321@gmail.com</p>
				</div>
			</div>
			<div class="col-md-4 text-center">
				<div class="contact-info">
					<i class="fas fa-phone fa-2x mb-3" style="color: var(--primary-color);"></i>
					<h5>{$t('phone')}</h5>
					<p>+62 895 0170 0818</p>
				</div>
			</div>
			<div class="col-md-4 text-center">
				<div class="contact-info">
					<i class="fas fa-map-marker-alt fa-2x mb-3" style="color: var(--primary-color);"></i>
					<h5>{$t('location')}</h5>
					<p>{$t('indonesia')}</p>
				</div>
			</div>
		</div>
	</div>
</section>
