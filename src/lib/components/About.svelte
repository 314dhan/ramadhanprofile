<script lang="ts" module>
	// Intersection Observer Action for fade-ins reused across components
	export function fadeInAction(node: HTMLElement) {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						node.classList.add('visible');
						observer.unobserve(node);
					}
				});
			},
			{ threshold: 0.1 }
		);

		observer.observe(node);

		return {
			destroy() {
				observer.unobserve(node);
			}
		};
	}
</script>
<script lang="ts">
	import { t } from '$lib/stores/i18n';
</script>

<section id="about" class="fade-in" use:fadeInAction>
	<div class="container">
		<div class="row align-items-center">
			<div class="col-lg-6">
				<h2>{$t('about_me_title')}</h2>
				<p>{$t('about_me_p1')}</p>
				<p>{$t('about_me_p2')}</p>
				<p>{$t('about_me_p3')}</p>
				<div class="mt-4">
					<a
						href="https://www.linkedin.com/in/ramadhan-50973b1aa/"
						target="_blank"
						class="btn btn-primary mr-3"
					>
						<i class="fab fa-linkedin mr-2"></i> <span>{$t('linkedin')}</span>
					</a>
					<a href="https://github.com/314dhan" target="_blank" class="btn btn-dark">
						<i class="fab fa-github mr-2"></i> <span>{$t('github')}</span>
					</a>
				</div>
			</div>
			<div class="col-lg-6 mt-5 mt-lg-0">
				<img
					src="/images/IMG_36.jpg"
					alt="About Me"
					class="img-fluid about-img floating"
				/>
			</div>
		</div>
	</div>
</section>
