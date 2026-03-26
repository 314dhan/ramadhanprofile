<script lang="ts">
	import { t } from '$lib/stores/i18n';

	function scrollTo(id: string) {
		const element = document.getElementById(id);
		if (element) {
			const offset = 80;
			const bodyRect = document.body.getBoundingClientRect().top;
			const elementRect = element.getBoundingClientRect().top;
			const elementPosition = elementRect - bodyRect;
			const offsetPosition = elementPosition - offset;

			window.scrollTo({
				top: offsetPosition,
				behavior: 'smooth'
			});
		}
	}
</script>

<footer class="footer">
	<div class="container">
		<div class="footer-top pb-5">
			<div class="row">
				<div class="col-lg-4 mb-5 mb-lg-0">
					<h2 class="footer-logo">RAMADHAN<span>.</span></h2>
					<p class="mt-4 text-muted footer-desc">{$t('footer_desc')}</p>
				</div>
				
				<div class="col-lg-2 offset-lg-2 col-md-4 mb-4 mb-md-0">
					<h4 class="footer-heading">Navigation</h4>
					<ul class="footer-links">
						{#each ['intro', 'about', 'tech-stack', 'projects', 'contact'] as id}
							<li>
								<a 
									href="#{id}" 
									onclick={(e) => { e.preventDefault(); scrollTo(id); }}
								>
									{$t(id === 'intro' ? 'home' : id === 'tech-stack' ? 'skills' : id)}
								</a>
							</li>
						{/each}
					</ul>
				</div>
				
				<div class="col-lg-4 col-md-8">
					<h4 class="footer-heading">{$t('connect_with_me')}</h4>
					<div class="footer-socials mt-4">
						<a href="https://www.linkedin.com/in/ramadhan-50973b1aa/" target="_blank" aria-label="LinkedIn">
							<i class="fab fa-linkedin-in"></i>
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
					<div class="mt-4">
						<span class="d-block text-dim font-weight-600 mb-2" style="font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.1em;">Direct Email</span>
						<a href="mailto:ramadhan25321@gmail.com" class="footer-email">ramadhan25321@gmail.com</a>
					</div>
				</div>
			</div>
		</div>
		
		<div class="footer-bottom pt-5">
			<div class="row align-items-center">
				<div class="col-md-6 text-center text-md-left">
					<p class="copyright">
						&copy; {new Date().getFullYear()} {$t('copyright')}
					</p>
				</div>
				<div class="col-md-6 text-center text-md-right mt-3 mt-md-0">
				</div>
			</div>
		</div>
	</div>
</footer>

<style>
	.footer {
		background: var(--bg);
		padding: var(--space-12) 0 var(--space-6);
		border-top: 1px solid var(--border);
	}

	.footer-logo {
		font-family: 'Fraunces', serif;
		font-size: 1.5rem;
		font-weight: 800;
		letter-spacing: 0.1em;
	}

	.footer-logo span {
		color: var(--accent);
	}

	.footer-desc {
		font-size: 0.9375rem;
		line-height: 1.7;
		max-width: 300px;
	}

	.footer-heading {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		font-weight: 700;
		color: var(--text-dim);
		margin-bottom: var(--space-4);
	}

	.footer-links {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.footer-links a {
		text-decoration: none;
		color: var(--text-muted);
		font-size: 0.875rem;
		font-weight: 500;
		transition: color 0.3s ease;
	}

	.footer-links a:hover {
		color: var(--text-main);
	}

	.footer-socials {
		display: flex;
		gap: 1rem;
	}

	.footer-socials a {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border);
		color: var(--text-muted);
		text-decoration: none;
		transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
		font-size: 1rem;
	}

	.footer-socials a:hover {
		border-color: var(--accent);
		color: var(--accent);
		transform: translateY(-4px);
	}

	.footer-email {
		font-size: 1rem;
		color: var(--text-main);
		font-weight: 600;
		text-decoration: none;
		border-bottom: 1px solid var(--border);
		padding-bottom: 2px;
		transition: border-color 0.3s ease;
	}

	.footer-email:hover {
		border-bottom-color: var(--accent);
		color: var(--text-main);
	}

	.footer-bottom {
		border-top: 1px solid var(--border);
	}

	.copyright {
		font-size: 0.8125rem;
		color: var(--text-dim);
		margin: 0;
	}

	.built-with {
		font-size: 0.8125rem;
		color: var(--text-dim);
	}

	.built-with .accent {
		color: var(--accent);
		font-weight: 600;
	}
</style>
