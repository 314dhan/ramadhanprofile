<script lang="ts">
	import { t } from '$lib/stores/i18n';
	// Reuse the fade in action
	import { fadeInAction } from './About.svelte';
</script>

<section id="tech-stack" class="fade-in" use:fadeInAction>
	<div class="container">
		<h2 class="text-center">{$t('my_skills_title')}</h2>
		<p class="text-center mb-5">{$t('my_skills_subtitle')}</p>

		<div class="row">
			<div class="col-md-4">
				<div class="tech-item">
					<i class="fab fa-php tech-icon"></i>
					<h4>{$t('php_skill')}</h4>
					<p>{$t('php_skill_desc')}</p>
				</div>
			</div>
			<div class="col-md-4">
				<div class="tech-item">
					<i class="fab fa-laravel tech-icon"></i>
					<h4>{$t('laravel_skill')}</h4>
					<p>{$t('laravel_skill_desc')}</p>
				</div>
			</div>
			<div class="col-md-4">
				<div class="tech-item">
					<i class="fab fa-node-js tech-icon"></i>
					<h4>{$t('nodejs_skill')}</h4>
					<p>{$t('nodejs_skill_desc')}</p>
				</div>
			</div>
		</div>

		<div class="row mt-4">
			<div class="col-md-4">
				<div class="tech-item">
					<i class="fas fa-database tech-icon"></i>
					<h4>{$t('db_skill')}</h4>
					<p>{$t('db_skill_desc')}</p>
				</div>
			</div>
			<div class="col-md-4">
				<div class="tech-item">
					<i class="fab fa-js tech-icon"></i>
					<h4>{$t('js_skill')}</h4>
					<p>{$t('js_skill_desc')}</p>
				</div>
			</div>
			<div class="col-md-4">
				<div class="tech-item">
					<i class="fab fa-python tech-icon"></i>
					<h4>{$t('python_skill')}</h4>
					<p>{$t('python_skill_desc')}</p>
				</div>
			</div>
		</div>

		<div class="row mt-4">
			<div class="col-md-4">
				<div class="tech-item">
					<i class="fab fa-java tech-icon"></i>
					<h4>{$t('java_skill')}</h4>
					<p>{$t('java_skill_desc')}</p>
				</div>
			</div>
			<div class="col-md-4">
				<div class="tech-item">
					<i class="fas fa-file-code tech-icon"></i>
					<h4>{$t('lua_skill')}</h4>
					<p>{$t('lua_skill_desc')}</p>
				</div>
			</div>
			<div class="col-md-4">
				<div class="tech-item">
					<i class="fab fa-react tech-icon"></i>
					<h4>{$t('react_skill')}</h4>
					<p>{$t('react_skill_desc')}</p>
				</div>
			</div>
		</div>

		<div class="row mt-4">
			<div class="col-md-4">
				<div class="tech-item">
					<i class="fab fa-vuejs tech-icon"></i>
					<h4>{$t('vuejs_skill')}</h4>
					<p>{$t('vuejs_skill_desc')}</p>
				</div>
			</div>
			<div class="col-md-4">
				<div class="tech-item">
					<i class="fas fa-mobile-alt tech-icon"></i>
					<h4>{$t('mobile_skill')}</h4>
					<p>{$t('mobile_skill_desc')}</p>
				</div>
			</div>
		</div>
	</div>
</section>
