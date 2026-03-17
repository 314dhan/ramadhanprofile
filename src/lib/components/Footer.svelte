<script lang="ts">
	import { t } from '$lib/stores/i18n';

	function scrollTo(id: string) {
		const element = document.getElementById(id);
		if (element) {
			window.scrollTo({
				top: element.offsetTop - 70,
				behavior: 'smooth'
			});
		}
	}
</script>

<footer class="footer">
	<div class="container">
		<div class="row">
			<div class="col-lg-4 mb-4 mb-lg-0">
				<h3>Ramadhan</h3>
				<p>{$t('footer_desc')}</p>
			</div>
			<div class="col-lg-4 mb-4 mb-lg-0">
				<h3>{$t('quick_links')}</h3>
				<ul class="list-unstyled">
					<li>
						<a
							href="#intro"
							class="text-white"
							onclick={(e) => { e.preventDefault(); scrollTo('intro'); }}
						>
							{$t('home')}
						</a>
					</li>
					<li>
						<a
							href="#about"
							class="text-white"
							onclick={(e) => { e.preventDefault(); scrollTo('about'); }}
						>
							{$t('about')}
						</a>
					</li>
					<li>
						<a
							href="#tech-stack"
							class="text-white"
							onclick={(e) => { e.preventDefault(); scrollTo('tech-stack'); }}
						>
							{$t('skills')}
						</a>
					</li>
					<li>
						<a
							href="#projects"
							class="text-white"
							onclick={(e) => { e.preventDefault(); scrollTo('projects'); }}
						>
							{$t('projects')}
						</a>
					</li>
					<li>
						<a
							href="#contact"
							class="text-white"
							onclick={(e) => { e.preventDefault(); scrollTo('contact'); }}
						>
							{$t('contact')}
						</a>
					</li>
				</ul>
			</div>
			<div class="col-lg-4">
				<h3>{$t('connect_with_me')}</h3>
				<div class="social-icons">
					<a href="https://www.linkedin.com/in/ramadhan-50973b1aa/" target="_blank" aria-label="LinkedIn">
						<i class="fab fa-linkedin"></i>
					</a>
					<a href="https://github.com/314dhan" target="_blank" aria-label="Github">
						<i class="fab fa-github"></i>
					</a>
					<a href="https://wa.me/6289501700818" target="_blank" aria-label="WhatsApp">
						<i class="fab fa-whatsapp"></i>
					</a>
					<a href="mailto:ramadhan25321@gmail.com" aria-label="Email">
						<i class="fas fa-envelope"></i>
					</a>
				</div>
			</div>
		</div>
		<div class="footer-bottom text-center mt-5">
			<p class="mb-0">{new Date().getFullYear()} {$t('copyright')}</p>
		</div>
	</div>
</footer>
