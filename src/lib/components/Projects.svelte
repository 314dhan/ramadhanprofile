<script lang="ts">
	import { t } from '$lib/stores/i18n';
	import { fadeInAction } from './About.svelte';
</script>

<section id="projects" class="fade-in" use:fadeInAction>
	<div class="container">
		<h2 class="text-center">{$t('my_projects_title')}</h2>
		<p class="text-center mb-5">{$t('my_projects_subtitle')}</p>

		<div class="row">
			<div class="col-lg-6">
				<div class="project-card">
					<img
						src="https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
						class="card-img-top project-img"
						alt="Tinpets"
					/>
					<div class="card-body">
						<h5 class="card-title">{$t('project4_title')}</h5>
						<p class="card-text">{$t('project4_desc')}</p>
						<div class="mb-3">
							<span class="badge badge-tech">HTML</span>
							<span class="badge badge-tech">CSS</span>
							<span class="badge badge-tech">JavaScript</span>
						</div>
						<a
							href="https://314dhan.github.io/tinpets/"
							class="btn btn-primary"
							target="_blank"
						>
							{$t('view_project')}
						</a>
					</div>
				</div>
			</div>

			<div class="col-lg-6">
				<div class="project-card">
					<img
						src="https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
						class="card-img-top project-img"
						alt="URL Shortener"
					/>
					<div class="card-body">
						<h5 class="card-title">{$t('project5_title')}</h5>
						<p class="card-text">{$t('project5_desc')}</p>
						<div class="mb-3">
							<span class="badge badge-tech">HTML</span>
							<span class="badge badge-tech">CSS</span>
							<span class="badge badge-tech">JavaScript</span>
							<span class="badge badge-tech">NodeJS</span>
						</div>
						<a
							href="https://linkshortener-chi.vercel.app/"
							class="btn btn-primary"
							target="_blank"
						>
							{$t('view_project')}
						</a>
					</div>
				</div>
			</div>
		</div>

		<div class="row mt-4">
			<div class="col-lg-6">
				<div class="project-card">
					<img
						src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
						class="card-img-top project-img"
						alt="Chat App Realtime"
					/>
					<div class="card-body">
						<h5 class="card-title">{$t('project6_title')}</h5>
						<p class="card-text">{$t('project6_desc')}</p>
						<div class="mb-3">
							<span class="badge badge-tech">HTML</span>
							<span class="badge badge-tech">CSS</span>
							<span class="badge badge-tech">JavaScript</span>
							<span class="badge badge-tech">NodeJs</span>
							<span class="badge badge-tech">Vue</span>
						</div>
						<a
							href="https://chat-app-messaging-gamma.vercel.app/"
							class="btn btn-primary"
							target="_blank"
						>
							{$t('view_project')}
						</a>
					</div>
				</div>
			</div>

			<div class="col-lg-6">
				<div class="project-card">
					<img
						src="/images/kanji-flash-card-projecto.png"
						class="card-img-top project-img"
						alt="Kanji Flash Card"
					/>
					<div class="card-body">
						<h5 class="card-title">{$t('project7_title')}</h5>
						<p class="card-text">{$t('project7_desc')}</p>
						<div class="mb-3">
							<span class="badge badge-tech">HTML</span>
							<span class="badge badge-tech">CSS</span>
							<span class="badge badge-tech">JavaScript</span>
						</div>
						<a
							href="https://kanji-flash-card-project.vercel.app/"
							class="btn btn-primary"
							target="_blank"
						>
							{$t('view_project')}
						</a>
					</div>
				</div>
			</div>

			<div class="col-lg-6">
				<div class="project-card">
					<img
						src="/images/sswfood.png"
						class="card-img-top project-img"
						alt="SSW Food Factory"
					/>
					<div class="card-body">
						<h5 class="card-title">{$t('project8_title')}</h5>
						<p class="card-text">{$t('project8_desc')}</p>
						<div class="mb-3">
							<span class="badge badge-tech">HTML</span>
							<span class="badge badge-tech">CSS</span>
							<span class="badge badge-tech">JavaScript</span>
						</div>
						<a
							href="https://ssw-foodfactory.vercel.app/"
							class="btn btn-primary"
							target="_blank"
						>
							{$t('view_project')}
						</a>
					</div>
				</div>
			</div>

			<div class="col-lg-6">
				<div class="project-card">
					<img
						src="/images/ssw-restoran.png"
						class="card-img-top project-img"
						alt="SSW Restoran"
					/>
					<div class="card-body">
						<h5 class="card-title">{$t('project9_title')}</h5>
						<p class="card-text">{$t('project9_desc')}</p>
						<div class="mb-3">
							<span class="badge badge-tech">HTML</span>
							<span class="badge badge-tech">CSS</span>
							<span class="badge badge-tech">JavaScript</span>
						</div>
						<a href="https://ssw-restoran.vercel.app/" class="btn btn-primary" target="_blank">
							{$t('view_project')}
						</a>
					</div>
				</div>
			</div>

			<div class="col-lg-6">
				<div class="project-card">
					<img
						src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
						class="card-img-top project-img"
						alt="E-Survey System"
					/>
					<div class="card-body">
						<h5 class="card-title">{$t('project1_title')}</h5>
						<p class="card-text">{$t('project1_desc')}</p>
						<div class="mb-3">
							<span class="badge badge-tech">PHP</span>
							<span class="badge badge-tech">JavaScript</span>
							<span class="badge badge-tech">MySQL</span>
							<span class="badge badge-tech">Chart.js</span>
						</div>
						<a href="https://github.com/314dhan/e-survey" class="btn btn-primary" target="_blank">
							{$t('view_project')}
						</a>
					</div>
				</div>
			</div>

			<div class="col-lg-6">
				<div class="project-card">
					<img
						src="https://images.unsplash.com/photo-1503917988258-f87a78e3c995?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
						class="card-img-top project-img"
						alt="Travel Tracker"
					/>
					<div class="card-body">
						<h5 class="card-title">{$t('project2_title')}</h5>
						<p class="card-text">{$t('project2_desc')}</p>
						<div class="mb-3">
							<span class="badge badge-tech">Node.js</span>
							<span class="badge badge-tech">Express</span>
							<span class="badge badge-tech">PostgreSQL</span>
							<span class="badge badge-tech">EJS</span>
						</div>
						<a
							href="https://github.com/314dhan/travel-tracker"
							class="btn btn-primary"
							target="_blank"
						>
							{$t('view_project')}
						</a>
					</div>
				</div>
			</div>

			<div class="col-lg-6">
				<div class="project-card">
					<img
						src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
						class="card-img-top project-img"
						alt="News Management"
					/>
					<div class="card-body">
						<h5 class="card-title">{$t('project3_title')}</h5>
						<p class="card-text">{$t('project3_desc')}</p>
						<div class="mb-3">
							<span class="badge badge-tech">PHP</span>
							<span class="badge badge-tech">MySQL</span>
							<span class="badge badge-tech">Bootstrap</span>
						</div>
						<a
							href="https://github.com/314dhan/News-Web-App"
							class="btn btn-primary"
							target="_blank"
						>
							{$t('view_project')}
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
