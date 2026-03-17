<script lang="ts">
	import { t } from '$lib/stores/i18n';
	import { fadeInAction } from './About.svelte';
</script>

<section id="game-projects" class="fade-in" use:fadeInAction>
	<div class="container">
		<h2 class="text-center">{$t('my_game_projects_title')}</h2>
		<p class="text-center mb-5">{$t('my_game_projects_subtitle')}</p>

		<div class="row">
			<div class="col-lg-6">
				<div class="project-card">
					<img
						src="/images/roblox/lasbloxguys.png"
						class="card-img-top project-img"
						alt="Roblox Game"
					/>
					<div class="card-body">
						<h5 class="card-title">{$t('game1_title')}</h5>
						<p class="card-text">{$t('game1_desc')}</p>
						<div class="mb-3">
							<span class="badge badge-tech">Roblox Studio</span>
							<span class="badge badge-tech">Lua</span>
						</div>
						<a
							href="https://ro.blox.com/Ebh5?af_dp=roblox%3A%2F%2Fnavigation%2Fgame_details%3FgameId%3D8734574120&af_web_dp=https%3A%2F%2Fwww.roblox.com%2Fgames%2F83595445760346"
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
					<img src="/images/roblox/bloptower.png" class="card-img-top project-img" alt="Roblox Game" />
					<div class="card-body">
						<h5 class="card-title">{$t('game2_title')}</h5>
						<p class="card-text">{$t('game2_desc')}</p>
						<div class="mb-3">
							<span class="badge badge-tech">Roblox Studio</span>
							<span class="badge badge-tech">Lua</span>
						</div>
						<a
							href="https://ro.blox.com/Ebh5?af_dp=roblox%3A%2F%2Fnavigation%2Fgame_details%3FgameId%3D8445961159&af_web_dp=https%3A%2F%2Fwww.roblox.com%2Fgames%2F136041774963699"
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
					<img src="/images/roblox/obby.png" class="card-img-top project-img" alt="Roblox Game" />
					<div class="card-body">
						<h5 class="card-title">{$t('game3_title')}</h5>
						<p class="card-text">{$t('game3_desc')}</p>
						<div class="mb-3">
							<span class="badge badge-tech">Roblox Studio</span>
							<span class="badge badge-tech">Lua</span>
						</div>
						<a
							href="https://ro.blox.com/Ebh5?af_dp=roblox%3A%2F%2Fnavigation%2Fgame_details%3FgameId%3D9099405016&af_web_dp=https%3A%2F%2Fwww.roblox.com%2Fgames%2F92183776319648"
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
