# GitHub Stats & AI Repo Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a live GitHub stats strip to the About section and 3 AI repo cards to the Projects section.

**Architecture:** `About.svelte` fetches `https://api.github.com/users/314dhan` client-side in `onMount` for the repo count, and embeds a `github-readme-stats` image card. `Projects.svelte` adds a static `aiRepos` array rendered after the existing projects grid with an "AI Tools" subsection label.

**Tech Stack:** SvelteKit + Svelte 5 runes, GitHub REST API (public, no auth), github-readme-stats.vercel.app image embed.

---

## File Map

| Action | File | Change |
|--------|------|--------|
| Modify | `src/lib/components/About.svelte` | Add `githubRepos` state, fetch in `onMount`, stats strip HTML + CSS |
| Modify | `src/lib/components/Projects.svelte` | Add `aiRepos` array, AI Tools subsection HTML + CSS |

---

## Task 1: GitHub Stats Strip in About

**Files:**
- Modify: `src/lib/components/About.svelte`

- [ ] **Step 1: Add `githubRepos` state and fetch inside `onMount`**

In `About.svelte`, add the state variable after the existing `let visible` declaration, then add a fetch call inside the existing `onMount`:

```svelte
<script lang="ts">
	import { t, locale } from '$lib/stores/i18n';
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';

	const cvUrl = derived(locale, ($locale) =>
		$locale === 'ja' ? '/Ramadhan_CV_JP.pdf' : '/Ramadhan_CV_I.pdf'
	);

	const cvLabel = derived(locale, ($locale) =>
		$locale === 'ja' ? 'view_cv' : 'download_cv'
	);

	let visible = $state(false);
	let githubRepos = $state<number | null>(null);

	onMount(() => {
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				visible = true;
				observer.disconnect();
			}
		}, { threshold: 0.2 });

		const section = document.getElementById('about');
		if (section) observer.observe(section);

		fetch('https://api.github.com/users/314dhan')
			.then(r => r.json())
			.then(data => { githubRepos = data.public_repos; })
			.catch(() => { githubRepos = null; });
	});
</script>
```

- [ ] **Step 2: Add stats strip HTML after `.social-links` div**

In the template, after the closing `</div>` of `.social-links` and before the closing `</div>` of `col-lg-6`, add:

```svelte
				<div class="github-strip mt-5 {visible ? 'fade-in-right' : ''}">
					<div class="github-stats-row">
						<div class="stat-item">
							<span class="stat-value {githubRepos === null ? 'stat-loading' : ''}">{githubRepos ?? '—'}</span>
							<span class="stat-label">Repos</span>
						</div>
						<div class="stat-divider"></div>
						<div class="stat-item">
							<span class="stat-value">Python · JS · PHP</span>
							<span class="stat-label">Languages</span>
						</div>
						<a href="https://github.com/314dhan" target="_blank" rel="noopener" class="github-profile-link">
							<i class="fab fa-github"></i>
							View GitHub
							<i class="fas fa-external-link-alt github-ext-icon"></i>
						</a>
					</div>
					<div class="github-card-wrapper">
						<img
							src="https://github-readme-stats.vercel.app/api?username=314dhan&show_icons=true&hide_border=false&bg_color=111318&title_color=6b8af5&text_color=e8e9ed&icon_color=6b8af5&border_color=2a2d36&cache_seconds=86400"
							alt="GitHub contribution stats for 314dhan"
							loading="lazy"
							class="github-stats-img"
						/>
					</div>
				</div>
```

- [ ] **Step 3: Add CSS for the stats strip**

At the end of the `<style>` block (before the closing `</style>`), add:

```css
	.github-strip {
		opacity: 0;
	}

	.github-stats-row {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		flex-wrap: wrap;
		padding: var(--space-3) var(--space-4);
		border: 1px solid var(--border);
		background: var(--surface);
		margin-bottom: var(--space-3);
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.stat-value {
		font-family: 'Fraunces', serif;
		font-size: 1.1rem;
		color: var(--text-main);
		font-weight: 600;
	}

	.stat-value.stat-loading {
		color: var(--text-dim);
	}

	.stat-label {
		font-size: 0.6rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--text-dim);
	}

	.stat-divider {
		width: 1px;
		height: 32px;
		background: var(--border);
	}

	.github-profile-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-left: auto;
		font-size: 0.8rem;
		font-weight: 600;
		text-decoration: none;
		color: var(--accent);
		transition: color 0.2s ease;
	}

	.github-profile-link:hover {
		color: var(--accent-bright);
		text-decoration: none;
	}

	.github-ext-icon {
		font-size: 0.6rem;
	}

	.github-card-wrapper {
		border: 1px solid var(--border);
		overflow: hidden;
	}

	.github-stats-img {
		display: block;
		width: 100%;
		height: auto;
	}
```

- [ ] **Step 4: Verify TypeScript**

Run: `npm run check`
Expected: `0 ERRORS`

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/About.svelte
git commit -m "feat: add GitHub live stats strip to About section"
```

---

## Task 2: AI Repo Cards in Projects

**Files:**
- Modify: `src/lib/components/Projects.svelte`

- [ ] **Step 1: Add `aiRepos` array to the script block**

In `Projects.svelte`, after the existing `const projects = [...]` array, add:

```typescript
	const aiRepos = [
		{
			name: 'coding-llm-local',
			description: 'Local LLM coding assistant — run AI code suggestions offline',
			language: 'Python',
			url: 'https://github.com/314dhan/coding-llm-local',
		},
		{
			name: 'compress-video-python',
			description: 'Batch video compression script with configurable quality settings',
			language: 'Python',
			url: 'https://github.com/314dhan/compress-video-python',
		},
		{
			name: 'download-manager',
			description: 'Python download manager with queue and progress tracking',
			language: 'Python',
			url: 'https://github.com/314dhan/download-manager',
		},
	];
```

- [ ] **Step 2: Add AI Tools subsection after the existing `</div>` closing the `projects-grid`**

In the template, after the closing `</div>` of `projects-grid` and before the closing `</div>` of `container`, add:

```svelte
		<div class="ai-section {visible ? 'fade-in-up' : ''}" style="animation-delay: 0.4s">
			<div class="row mb-4 align-items-end">
				<div class="col-lg-8">
					<span class="section-label">AI Tools</span>
					<h3 class="ai-section-title mt-2">Python tools built with Claude AI</h3>
				</div>
			</div>
			<div class="repos-grid">
				{#each aiRepos as repo, i}
					<a
						href={repo.url}
						class="repo-item {visible ? 'fade-in-up' : ''}"
						style="animation-delay: {(projects.length + i) * 0.1}s"
						target="_blank"
						rel="noopener"
					>
						<div class="repo-icon-wrapper">
							<i class="fab fa-github repo-icon"></i>
						</div>
						<div class="repo-info">
							<div class="d-flex justify-content-between align-items-start">
								<h3 class="project-title repo-name">{repo.name}</h3>
								<i class="fas fa-arrow-right arrow-icon"></i>
							</div>
							<p class="project-desc">{repo.description}</p>
							<div class="project-tags">
								<span class="tag">{repo.language}</span>
								<span class="tag tag--claude">Built with Claude</span>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
```

- [ ] **Step 3: Add CSS for AI repos section**

At the end of the `<style>` block (before `</style>`), add:

```css
	.ai-section {
		opacity: 0;
		border-top: 1px solid var(--border);
		padding-top: var(--space-8);
		margin-top: var(--space-8);
	}

	.ai-section-title {
		font-family: 'Fraunces', serif;
		font-size: 1.5rem;
		color: var(--text-muted);
		font-weight: 400;
	}

	.repos-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-4);
	}

	.repo-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		text-decoration: none;
		color: inherit;
		opacity: 0;
		padding: var(--space-4);
		border: 1px solid var(--border);
		background: var(--surface);
		transition: border-color 0.3s ease, background 0.3s ease;
	}

	.repo-item:hover {
		text-decoration: none;
		color: inherit;
		border-color: var(--accent);
		background: var(--surface-bright);
	}

	.repo-icon-wrapper {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border);
		color: var(--text-dim);
		transition: all 0.3s ease;
	}

	.repo-item:hover .repo-icon-wrapper {
		border-color: var(--accent);
		color: var(--accent);
	}

	.repo-icon {
		font-size: 1.1rem;
	}

	.repo-name {
		font-size: 0.9rem !important;
		letter-spacing: 0.02em;
	}

	.tag--claude {
		border-color: var(--accent);
		color: var(--accent);
	}

	@media (max-width: 991px) {
		.repos-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 576px) {
		.repos-grid {
			grid-template-columns: 1fr;
		}
	}
```

- [ ] **Step 4: Verify TypeScript**

Run: `npm run check`
Expected: `0 ERRORS`

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/Projects.svelte
git commit -m "feat: add AI repo cards to Projects section"
```

---

## Task 3: Push

- [ ] **Step 1: Push to origin**

```bash
git push origin master
```

- [ ] **Step 2: Manual test checklist**

Run `npm run dev` and verify at `http://localhost:5173`:

- [ ] Scroll to About → GitHub stats strip appears below social links
- [ ] Repo count loads (shows a number, not `—`)
- [ ] `github-readme-stats` image card renders (shows commits/PRs/stars)
- [ ] "View GitHub →" link opens `https://github.com/314dhan` in new tab
- [ ] Scroll to Projects → "AI Tools" subsection appears below existing projects
- [ ] 3 repo cards show with correct names, descriptions, tags
- [ ] Each card links to correct GitHub repo in new tab
- [ ] `Built with Claude` tag has accent color border
- [ ] Hover states work on both stats strip link and repo cards
- [ ] On mobile (or narrow viewport): stats row wraps, repos stack to 1 column
