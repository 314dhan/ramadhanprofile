<script lang="ts">
	import { t, locale } from '$lib/stores/i18n';
	import { onMount } from 'svelte';

	interface Role {
		company: string;
		role: string;
		period: string;
		bullets: string[];
	}

	// Sourced from the CV. Companies stay in Latin script across locales.
	const data: Record<string, Role[]> = {
		en: [
			{
				company: 'PT Koding Next',
				role: 'Advance Teacher (Programming Instructor)',
				period: 'Aug 2024 – Jul 2025',
				bullets: [
					'Taught Python, JavaScript, PHP, Lua (Roblox), HTML/CSS, and MySQL across multiple cohorts.',
					'Delivered a full-stack web curriculum: frontend (HTML/CSS/JS), backend (Node.js + MongoDB), and databases (MySQL).',
					'Integrated AI tools into lesson prep, using LLMs to generate exercises, debug student code live, and explain concepts at multiple difficulty levels.',
					'Consistently met monthly KPIs and maintained the classroom hardware and tech environment.'
				]
			},
			{
				company: 'Binance P2P',
				role: 'Verified Crypto Merchant (Self-Employed)',
				period: 'Jan 2025 – Present',
				bullets: [
					'Operate as a Verified Merchant facilitating IDR to USDT trades, processing around $200,000 per month in volume.',
					'Manage buy/sell listings with competitive spreads, KYC compliance, and limits up to IDR 100,000,000 per order.',
					'Built a Python bot to monitor competitor pricing and auto-adjust listings in real time.'
				]
			},
			{
				company: 'Primkobis',
				role: 'Operator Assistant',
				period: 'Feb 2019 – Nov 2023',
				bullets: [
					'Inspected hot-metal transport equipment and coordinated safe placement of molten steel reservoirs.',
					'Produced daily tonnage reports and introduced structured data logging that improved accuracy.',
					'Secured operational work areas in a high-risk industrial environment.'
				]
			},
			{
				company: 'PT Indorama Petrochemical',
				role: 'School Intern',
				period: 'Apr 2017',
				bullets: [
					'Measured and logged waste-sample parameters (viscosity, pH, DSS) and monitored demineralized-water pipe pressure.'
				]
			}
		],
		ja: [
			{
				company: 'PT Koding Next',
				role: 'プログラミング講師（Advance Teacher）',
				period: '2024年8月 – 2025年7月',
				bullets: [
					'Python・JavaScript・PHP・Lua（Roblox）・HTML/CSS・MySQL を複数コホートの生徒に指導。',
					'フルスタックWeb開発カリキュラム（フロントエンド・バックエンド・DB）を設計・実施。',
					'LLMを授業準備に活用し、問題生成・ライブデバッグ・難易度別の説明を効率化。',
					'月次KPIを継続達成し、教室のハードウェア・授業環境を維持。'
				]
			},
			{
				company: 'Binance P2P',
				role: '認定P2P暗号資産マーチャント（個人事業）',
				period: '2025年1月 – 現在',
				bullets: [
					'認定マーチャントとして IDR↔USDT の取引を仲介、月間取引量は約 200,000 米ドル規模。',
					'競争力ある価格設定・KYC準拠・1注文あたり上限1億ルピアで売買リストを管理。',
					'Pythonで競合価格を監視し、リアルタイムで自動調整するボットを開発。'
				]
			},
			{
				company: 'Primkobis',
				role: 'オペレーターアシスタント',
				period: '2019年2月 – 2023年11月',
				bullets: [
					'溶鋼搬送設備の点検、溶鋼容器の安全な配置を調整。',
					'日次トン数レポートを作成し、構造化データロギングで精度を改善。',
					'高リスク工業環境で作業エリアの安全を確保。'
				]
			},
			{
				company: 'PT Indorama Petrochemical',
				role: '学校インターン',
				period: '2017年4月',
				bullets: [
					'廃液サンプル（粘度・pH・DSS）の計測・記録、脱ミネラル水配管の圧力を監視。'
				]
			}
		]
	};

	// id and any unsupported locale fall back to English.
	const roles = $derived(data[$locale] ?? data.en);

	let dialogEl: HTMLDialogElement;
	let selected = $state<Role | null>(null);

	function openModal(role: Role) {
		selected = role;
		dialogEl.showModal();
	}

	function closeModal() {
		dialogEl.close();
	}

	// Click on the backdrop area (outside the inner card) closes the dialog.
	function onDialogClick(e: MouseEvent) {
		if (e.target === dialogEl) closeModal();
	}

	let visible = $state(false);
	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					visible = true;
					observer.disconnect();
				}
			},
			{ threshold: 0.1 }
		);
		const section = document.getElementById('experience');
		if (section) observer.observe(section);
		return () => observer.disconnect();
	});
</script>

<section id="experience" class:visible>
	<span class="ghost-num ghost-num--left" aria-hidden="true">02</span>
	<div class="container">
		<div class="row mb-5 align-items-end">
			<div class="col-lg-8">
				<h2 class="mt-0">{$t('experience_title')}</h2>
			</div>
			<div class="col-lg-4 text-lg-right">
				<p class="text-muted exp-hint">{$t('experience_subtitle')}</p>
			</div>
		</div>

		<div class="exp-list {visible ? 'exp-list--visible' : ''}">
			{#each roles as role, i}
				<button class="exp-row" style="--d: {i * 0.08}s" onclick={() => openModal(role)}>
					<span class="exp-index">{String(i + 1).padStart(2, '0')}</span>
					<span class="exp-titles">
						<span class="exp-role">{role.role}</span>
						<span class="exp-company">{role.company}</span>
					</span>
					<span class="exp-period">{role.period}</span>
					<span class="exp-open" aria-hidden="true">
						<i class="fas fa-arrow-right"></i>
					</span>
				</button>
			{/each}
		</div>
	</div>
</section>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialogEl}
	class="exp-modal"
	onclick={onDialogClick}
	onclose={() => (selected = null)}
	aria-labelledby="exp-modal-role"
>
	{#if selected}
		<div class="modal-card">
			<button class="modal-close" onclick={closeModal} aria-label="Close">
				<i class="fas fa-times"></i>
			</button>

			<span class="modal-company">{selected.company}</span>
			<h3 id="exp-modal-role" class="modal-role">{selected.role}</h3>
			<span class="modal-period">{selected.period}</span>

			<ul class="modal-bullets">
				{#each selected.bullets as bullet}
					<li>{bullet}</li>
				{/each}
			</ul>
		</div>
	{/if}
</dialog>

<style>
	#experience {
		background: var(--bg);
	}

	.exp-hint {
		font-size: 0.9375rem;
	}

	.exp-list {
		border-top: 1px solid var(--border);
	}

	/* Subtle staggered entrance; default state is fully visible (no gating) */
	.exp-list--visible .exp-row {
		animation: exp-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
		animation-delay: var(--d);
	}

	@keyframes exp-in {
		from { opacity: 0; transform: translateY(16px); }
		to { opacity: 1; transform: translateY(0); }
	}

	/* ── List row (opens modal) ──────────────── */
	.exp-row {
		width: 100%;
		display: grid;
		grid-template-columns: auto 1fr auto auto;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4) 0;
		background: none;
		border: none;
		border-bottom: 1px solid var(--border);
		text-align: left;
		cursor: pointer;
		color: var(--text-main);
		transition: border-color 0.4s ease;
	}

	.exp-row:hover {
		border-bottom-color: var(--accent);
	}

	.exp-index {
		font-family: 'Barlow Condensed', sans-serif;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		color: var(--text-dim);
		font-variant-numeric: tabular-nums;
	}

	.exp-titles {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
	}

	.exp-role {
		font-family: 'Barlow Condensed', sans-serif;
		font-size: clamp(1.25rem, 2.4vw, 1.6rem);
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.01em;
		transition: color 0.3s ease;
	}

	.exp-row:hover .exp-role {
		color: var(--accent);
	}

	.exp-company {
		font-size: 0.8125rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--text-muted);
	}

	.exp-period {
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--text-dim);
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}

	.exp-open {
		width: 34px;
		height: 34px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border);
		border-radius: 50%;
		color: var(--text-muted);
		font-size: 0.7rem;
		transform: rotate(-45deg);
		transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
			border-color 0.3s ease, color 0.3s ease;
	}

	.exp-row:hover .exp-open {
		transform: rotate(0deg);
		border-color: var(--accent);
		color: var(--accent);
	}

	/* ── Modal (native dialog) ───────────────── */
	.exp-modal {
		width: min(560px, calc(100vw - var(--space-4)));
		max-height: calc(100vh - var(--space-8));
		padding: 0;
		border: 1px solid var(--border-bright);
		border-radius: 18px;
		background: var(--surface);
		color: var(--text-main);
		box-shadow: 0 30px 80px -20px oklch(0% 0 0 / 0.6);
		overflow: hidden;
	}

	.exp-modal::backdrop {
		background: oklch(0% 0 0 / 0.55);
		backdrop-filter: blur(4px);
	}

	/* The dialog renders in the top layer, above the custom cursor, so the
	   global `cursor: none` would leave it with no pointer. Restore one. */
	:global(.exp-modal), :global(.exp-modal *) { cursor: auto !important; }
	:global(.exp-modal button) { cursor: pointer !important; }

	.exp-modal[open] {
		animation: modal-in 0.32s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.exp-modal[open]::backdrop {
		animation: backdrop-in 0.32s ease;
	}

	@keyframes modal-in {
		from { opacity: 0; transform: translateY(12px) scale(0.97); }
		to { opacity: 1; transform: translateY(0) scale(1); }
	}

	@keyframes backdrop-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.modal-card {
		position: relative;
		padding: var(--space-6) var(--space-4) var(--space-4);
		overflow-y: auto;
		max-height: calc(100vh - var(--space-8));
	}

	.modal-close {
		position: absolute;
		top: var(--space-3);
		right: var(--space-3);
		width: 34px;
		height: 34px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: 1px solid var(--border);
		border-radius: 50%;
		color: var(--text-muted);
		cursor: pointer;
		transition: all 0.25s ease;
	}

	.modal-close:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	.modal-company {
		display: block;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.16em;
		color: var(--accent);
		margin-bottom: 0.5rem;
	}

	.modal-role {
		font-family: 'Barlow Condensed', sans-serif;
		font-size: clamp(1.5rem, 4vw, 2rem);
		font-weight: 700;
		line-height: 1.05;
		letter-spacing: -0.01em;
		margin: 0 0 0.5rem;
		padding-right: var(--space-6);
	}

	.modal-period {
		display: block;
		font-size: 0.8125rem;
		color: var(--text-dim);
		font-variant-numeric: tabular-nums;
		margin-bottom: var(--space-4);
	}

	.modal-bullets {
		list-style: none;
		margin: 0;
		padding: var(--space-4) 0 0;
		border-top: 1px solid var(--border);
	}

	.modal-bullets li {
		position: relative;
		color: var(--text-muted);
		line-height: 1.7;
		padding-left: 1.35rem;
		margin-bottom: 0.85rem;
	}

	.modal-bullets li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.65em;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent);
	}

	.modal-bullets li:last-child {
		margin-bottom: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.exp-list--visible .exp-row { animation: none; }
		.exp-modal[open],
		.exp-modal[open]::backdrop { animation: none; }
		.exp-open { transition: none; }
	}

	/* ── Mobile ──────────────────────────────── */
	@media (max-width: 768px) {
		.exp-row {
			grid-template-columns: auto 1fr auto;
			gap: var(--space-3);
			row-gap: 0.35rem;
		}
		.exp-period {
			grid-column: 2 / 3;
			grid-row: 2;
		}
		.exp-open {
			grid-column: 3;
			grid-row: 1 / 3;
		}
	}
</style>
