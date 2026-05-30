<script lang="ts">
	import { t, locale } from '$lib/stores/i18n';
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';

	// Language-aware CV URL: JP → Ramadhan_CV_JP.pdf, EN/ID → Ramadhan_CV_I.pdf
	const cvUrl = derived(locale, ($locale) =>
		$locale === 'ja' ? '/Ramadhan_CV_JP.pdf' : '/Ramadhan_CV_I.pdf'
	);

	const cvLabel = derived(locale, ($locale) =>
		$locale === 'ja' ? 'view_cv' : 'download_cv'
	);

	interface LangStat { name: string; percent: number; }
	interface GitHubStats { repos: number; followers: number; avatar: string; topLangs: LangStat[]; }

	const LANG_COLORS: Record<string, string> = {
		Python: '#3572A5', JavaScript: '#f1e05a', TypeScript: '#2b7489',
		PHP: '#4F5D95', HTML: '#e34c26', CSS: '#563d7c',
		Lua: '#000080', Go: '#00ADD8', Svelte: '#ff3e00', Dart: '#00B4AB',
	};

	let visible = $state(false);
	let githubStats = $state<GitHubStats | null>(null);

	onMount(() => {
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				visible = true;
				observer.disconnect();
			}
		}, { threshold: 0.2 });

		const section = document.getElementById('about');
		if (section) observer.observe(section);

		Promise.all([
			fetch('https://api.github.com/users/314dhan').then(r => r.json()),
			fetch('https://api.github.com/users/314dhan/repos?per_page=100').then(r => r.json()),
		]).then(([user, repos]) => {
			const langCount: Record<string, number> = {};
			repos.forEach((repo: { language: string | null }) => {
				if (repo.language) langCount[repo.language] = (langCount[repo.language] ?? 0) + 1;
			});
			const total = Object.values(langCount).reduce((a, b) => a + b, 0);
			const topLangs = Object.entries(langCount)
				.sort((a, b) => b[1] - a[1])
				.slice(0, 5)
				.map(([name, count]) => ({ name, percent: Math.round((count / total) * 100) }));

			githubStats = { repos: user.public_repos, followers: user.followers, avatar: user.avatar_url, topLangs };
		}).catch(() => { githubStats = null; });
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
						class="social-link"
					>
						<span class="link-icon"><i class="fab fa-github"></i></span>
						<span class="link-text">{$t('github')}</span>
					</a>
					<a 
						href={$cvUrl}
						target="_blank"
						class="social-link"
					>
						<span class="link-icon"><i class="fas fa-file-pdf"></i></span>
						<span class="link-text">{$t($cvLabel)}</span>
					</a>
				</div>

				{#if githubStats}
				<div class="gh-card mt-5 {visible ? 'fade-in-right' : ''}">
					<div class="gh-header">
						<img src={githubStats.avatar} alt="GitHub avatar" class="gh-avatar" />
						<div class="gh-identity">
							<span class="gh-username">314dhan</span>
							<div class="gh-meta-row">
								<span class="gh-stat"><i class="fas fa-book-open"></i> {githubStats.repos} repos</span>
								<span class="gh-stat"><i class="fas fa-users"></i> {githubStats.followers} followers</span>
							</div>
						</div>
						<a href="https://github.com/314dhan" target="_blank" rel="noopener" class="gh-view-btn">
							View Profile <i class="fas fa-external-link-alt"></i>
						</a>
					</div>

					{#if githubStats.topLangs.length > 0}
					<div class="gh-langs">
						<div class="gh-bar">
							{#each githubStats.topLangs as lang}
								<div
									class="gh-bar-seg"
									style="width:{lang.percent}%;background:{LANG_COLORS[lang.name] ?? '#8b8b8b'}"
									title="{lang.name} {lang.percent}%"
								></div>
							{/each}
						</div>
						<div class="gh-legend">
							{#each githubStats.topLangs as lang}
								<div class="gh-legend-item">
									<span class="gh-dot" style="background:{LANG_COLORS[lang.name] ?? '#8b8b8b'}"></span>
									<span class="gh-lang-name">{lang.name}</span>
									<span class="gh-lang-pct">{lang.percent}%</span>
								</div>
							{/each}
						</div>
					</div>
					{/if}
				</div>
				{/if}
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

	.social-links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
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

	.gh-card {
		opacity: 0;
		border: 1px solid var(--border);
		background: var(--surface);
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.gh-header {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.gh-avatar {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: 2px solid var(--border);
		flex-shrink: 0;
	}

	.gh-identity {
		display: flex;
		flex-direction: column;
		gap: 4px;
		flex: 1;
	}

	.gh-username {
		font-family: 'Fraunces', serif;
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-main);
	}

	.gh-meta-row {
		display: flex;
		gap: var(--space-3);
	}

	.gh-stat {
		font-size: 0.75rem;
		color: var(--text-muted);
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.gh-stat i { font-size: 0.65rem; color: var(--text-dim); }

	.gh-view-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-decoration: none;
		color: var(--accent);
		border: 1px solid var(--accent);
		padding: 0.3rem 0.75rem;
		transition: all 0.2s ease;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.gh-view-btn:hover {
		background: var(--accent);
		color: white;
		text-decoration: none;
	}

	.gh-view-btn i { font-size: 0.6rem; }

	.gh-langs { display: flex; flex-direction: column; gap: var(--space-2); }

	.gh-bar {
		height: 8px;
		border-radius: 4px;
		display: flex;
		overflow: hidden;
		gap: 2px;
	}

	.gh-bar-seg {
		height: 100%;
		border-radius: 2px;
		transition: opacity 0.2s ease;
	}

	.gh-bar-seg:hover { opacity: 0.8; }

	.gh-legend {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2) var(--space-4);
	}

	.gh-legend-item {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.gh-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.gh-lang-name {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.gh-lang-pct {
		font-size: 0.7rem;
		color: var(--text-dim);
	}
</style>
