<script lang="ts">
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores/theme';

	let { onstatus }: { onstatus?: (active: boolean) => void } = $props();

	let canvasEl: HTMLCanvasElement;

	const LINK_DIST = 120;
	const CURSOR_RADIUS = 150;
	const PARALLAX = 0.035;

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			onstatus?.(false);
			return;
		}

		let gl: WebGLRenderingContext | null = null;
		try {
			gl = canvasEl.getContext('webgl', { alpha: true, antialias: true });
		} catch {
			gl = null;
		}
		if (!gl) {
			onstatus?.(false);
			return;
		}

		// ── Shaders ──────────────────────────────────────────────
		const pointVert = `
			attribute vec3 a_pos;
			uniform vec2 u_res;
			uniform float u_dpr;
			varying float v_z;
			void main() {
				vec2 clip = (a_pos.xy / u_res) * 2.0 - 1.0;
				gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
				gl_PointSize = (1.4 + a_pos.z * 2.6) * u_dpr;
				v_z = a_pos.z;
			}`;
		const pointFrag = `
			precision mediump float;
			uniform vec3 u_color;
			varying float v_z;
			void main() {
				vec2 c = gl_PointCoord - 0.5;
				float d = length(c);
				if (d > 0.5) discard;
				float a = smoothstep(0.5, 0.3, d) * mix(0.25, 0.85, v_z);
				gl_FragColor = vec4(u_color, a);
			}`;
		const lineVert = `
			attribute vec2 a_pos;
			attribute float a_alpha;
			uniform vec2 u_res;
			varying float v_a;
			void main() {
				vec2 clip = (a_pos / u_res) * 2.0 - 1.0;
				gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
				v_a = a_alpha;
			}`;
		const lineFrag = `
			precision mediump float;
			uniform vec3 u_color;
			varying float v_a;
			void main() { gl_FragColor = vec4(u_color, v_a); }`;

		function compile(type: number, src: string): WebGLShader | null {
			const s = gl!.createShader(type);
			if (!s) return null;
			gl!.shaderSource(s, src);
			gl!.compileShader(s);
			if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) return null;
			return s;
		}

		function link(vsSrc: string, fsSrc: string): WebGLProgram | null {
			const vs = compile(gl!.VERTEX_SHADER, vsSrc);
			const fs = compile(gl!.FRAGMENT_SHADER, fsSrc);
			if (!vs || !fs) return null;
			const p = gl!.createProgram();
			if (!p) return null;
			gl!.attachShader(p, vs);
			gl!.attachShader(p, fs);
			gl!.linkProgram(p);
			if (!gl!.getProgramParameter(p, gl!.LINK_STATUS)) return null;
			return p;
		}

		const pointProg = link(pointVert, pointFrag);
		const lineProg = link(lineVert, lineFrag);
		if (!pointProg || !lineProg) {
			onstatus?.(false);
			return;
		}

		const pAttrPos = gl.getAttribLocation(pointProg, 'a_pos');
		const pUniRes = gl.getUniformLocation(pointProg, 'u_res');
		const pUniDpr = gl.getUniformLocation(pointProg, 'u_dpr');
		const pUniColor = gl.getUniformLocation(pointProg, 'u_color');
		const lAttrPos = gl.getAttribLocation(lineProg, 'a_pos');
		const lAttrAlpha = gl.getAttribLocation(lineProg, 'a_alpha');
		const lUniRes = gl.getUniformLocation(lineProg, 'u_res');
		const lUniColor = gl.getUniformLocation(lineProg, 'u_color');

		const pointBuf = gl.createBuffer();
		const lineBuf = gl.createBuffer();

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		// ── Theme-aware colors (resolve CSS oklch vars to rgb) ──
		let pointColor: [number, number, number] = [0.55, 0.6, 1];
		let lineColor: [number, number, number] = [0.55, 0.6, 1];

		function resolveCssColor(value: string): [number, number, number] | null {
			try {
				const c = document.createElement('canvas');
				c.width = c.height = 1;
				const ctx = c.getContext('2d');
				if (!ctx) return null;
				ctx.fillStyle = value;
				ctx.fillRect(0, 0, 1, 1);
				const d = ctx.getImageData(0, 0, 1, 1).data;
				return [d[0] / 255, d[1] / 255, d[2] / 255];
			} catch {
				return null;
			}
		}

		function refreshColors() {
			const root = getComputedStyle(document.documentElement);
			const accent = resolveCssColor(root.getPropertyValue('--accent').trim());
			const muted = resolveCssColor(root.getPropertyValue('--text-muted').trim());
			if (accent) pointColor = accent;
			if (muted) lineColor = muted;
		}
		refreshColors();
		const unsubTheme = theme.subscribe(() => refreshColors());

		// ── Particles ────────────────────────────────────────────
		let w = 0, h = 0, dpr = 1;
		let count = 0;
		let px: Float32Array = new Float32Array(0);
		let py: Float32Array = new Float32Array(0);
		let pz: Float32Array = new Float32Array(0);
		let vx: Float32Array = new Float32Array(0);
		let vy: Float32Array = new Float32Array(0);
		let sx: Float32Array = new Float32Array(0);
		let sy: Float32Array = new Float32Array(0);
		let pointData = new Float32Array(0);
		let lineData = new Float32Array(0);

		function rebuild() {
			const rect = canvasEl.parentElement!.getBoundingClientRect();
			w = Math.max(1, rect.width);
			h = Math.max(1, rect.height);
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvasEl.width = w * dpr;
			canvasEl.height = h * dpr;
			gl!.viewport(0, 0, canvasEl.width, canvasEl.height);

			count = Math.round(Math.min(170, Math.max(60, (w * h) / 11000)));
			px = new Float32Array(count);
			py = new Float32Array(count);
			pz = new Float32Array(count);
			vx = new Float32Array(count);
			vy = new Float32Array(count);
			sx = new Float32Array(count);
			sy = new Float32Array(count);
			pointData = new Float32Array(count * 3);
			lineData = new Float32Array(((count * (count - 1)) / 2) * 2 * 3);
			for (let i = 0; i < count; i++) {
				px[i] = Math.random() * w;
				py[i] = Math.random() * h;
				pz[i] = Math.random();
				const a = Math.random() * Math.PI * 2;
				const s = 0.1 + Math.random() * 0.2;
				vx[i] = Math.cos(a) * s;
				vy[i] = Math.sin(a) * s;
			}
		}
		rebuild();

		// ── Cursor ───────────────────────────────────────────────
		let mx = -9999, my = -9999;
		let hasMouse = false;
		function onMove(e: MouseEvent) {
			const r = canvasEl.getBoundingClientRect();
			mx = e.clientX - r.left;
			my = e.clientY - r.top;
			hasMouse = mx >= 0 && mx <= w && my >= 0 && my <= h;
		}
		window.addEventListener('mousemove', onMove, { passive: true });

		// ── Loop ─────────────────────────────────────────────────
		let rafId = 0;
		let running = false;
		let last = 0;

		function frame(t: number) {
			rafId = requestAnimationFrame(frame);
			const dt = Math.min((t - last) / 16.666 || 1, 3);
			last = t;

			const offX = hasMouse ? (mx - w / 2) * PARALLAX : 0;
			const offY = hasMouse ? (my - h / 2) * PARALLAX : 0;

			for (let i = 0; i < count; i++) {
				// gentle wander
				vx[i] += (Math.random() - 0.5) * 0.01;
				vy[i] += (Math.random() - 0.5) * 0.01;

				// cursor repulsion (depth-weighted)
				if (hasMouse) {
					const dx = px[i] - mx;
					const dy = py[i] - my;
					const d2 = dx * dx + dy * dy;
					if (d2 < CURSOR_RADIUS * CURSOR_RADIUS && d2 > 0.01) {
						const d = Math.sqrt(d2);
						const f = ((CURSOR_RADIUS - d) / CURSOR_RADIUS) * 0.5 * (0.4 + pz[i]);
						vx[i] += (dx / d) * f;
						vy[i] += (dy / d) * f;
					}
				}

				// speed cap + floor
				const sp = Math.hypot(vx[i], vy[i]);
				if (sp > 1.4) {
					vx[i] *= 1.4 / sp;
					vy[i] *= 1.4 / sp;
				}
				vx[i] *= 0.985;
				vy[i] *= 0.985;

				px[i] += vx[i] * dt;
				py[i] += vy[i] * dt;

				// wrap with margin
				if (px[i] < -30) px[i] = w + 29;
				else if (px[i] > w + 30) px[i] = -29;
				if (py[i] < -30) py[i] = h + 29;
				else if (py[i] > h + 30) py[i] = -29;

				// screen position with depth parallax
				sx[i] = px[i] + offX * pz[i];
				sy[i] = py[i] + offY * pz[i];
				pointData[i * 3] = sx[i];
				pointData[i * 3 + 1] = sy[i];
				pointData[i * 3 + 2] = pz[i];
			}

			// connections
			let li = 0;
			for (let i = 0; i < count; i++) {
				for (let j = i + 1; j < count; j++) {
					const dx = sx[i] - sx[j];
					const dy = sy[i] - sy[j];
					const d2 = dx * dx + dy * dy;
					if (d2 < LINK_DIST * LINK_DIST) {
						const a = (1 - Math.sqrt(d2) / LINK_DIST) * 0.16;
						lineData[li++] = sx[i];
						lineData[li++] = sy[i];
						lineData[li++] = a;
						lineData[li++] = sx[j];
						lineData[li++] = sy[j];
						lineData[li++] = a;
					}
				}
			}

			gl!.clearColor(0, 0, 0, 0);
			gl!.clear(gl!.COLOR_BUFFER_BIT);

			// lines
			gl!.useProgram(lineProg);
			gl!.uniform2f(lUniRes, w, h);
			gl!.uniform3f(lUniColor, lineColor[0], lineColor[1], lineColor[2]);
			gl!.bindBuffer(gl!.ARRAY_BUFFER, lineBuf);
			gl!.bufferData(gl!.ARRAY_BUFFER, lineData.subarray(0, li), gl!.DYNAMIC_DRAW);
			gl!.enableVertexAttribArray(lAttrPos);
			gl!.vertexAttribPointer(lAttrPos, 2, gl!.FLOAT, false, 12, 0);
			gl!.enableVertexAttribArray(lAttrAlpha);
			gl!.vertexAttribPointer(lAttrAlpha, 1, gl!.FLOAT, false, 12, 8);
			gl!.drawArrays(gl!.LINES, 0, li / 3);

			// points
			gl!.useProgram(pointProg);
			gl!.uniform2f(pUniRes, w, h);
			gl!.uniform1f(pUniDpr, dpr);
			gl!.uniform3f(pUniColor, pointColor[0], pointColor[1], pointColor[2]);
			gl!.bindBuffer(gl!.ARRAY_BUFFER, pointBuf);
			gl!.bufferData(gl!.ARRAY_BUFFER, pointData, gl!.DYNAMIC_DRAW);
			gl!.enableVertexAttribArray(pAttrPos);
			gl!.vertexAttribPointer(pAttrPos, 3, gl!.FLOAT, false, 12, 0);
			gl!.drawArrays(gl!.POINTS, 0, count);
		}

		function start() {
			if (running) return;
			running = true;
			last = performance.now();
			rafId = requestAnimationFrame(frame);
		}
		function stop() {
			if (!running) return;
			running = false;
			cancelAnimationFrame(rafId);
		}

		// pause off-screen and on hidden tab
		const io = new IntersectionObserver(
			(entries) => (entries[0].isIntersecting ? start() : stop()),
			{ threshold: 0 }
		);
		io.observe(canvasEl);
		function onVisibility() {
			if (document.hidden) stop();
			else if (canvasEl.getBoundingClientRect().bottom > 0) start();
		}
		document.addEventListener('visibilitychange', onVisibility);

		let resizeTimer: ReturnType<typeof setTimeout>;
		function onResize() {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(rebuild, 200);
		}
		window.addEventListener('resize', onResize);

		onstatus?.(true);
		start();

		return () => {
			stop();
			io.disconnect();
			unsubTheme();
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('resize', onResize);
			document.removeEventListener('visibilitychange', onVisibility);
			clearTimeout(resizeTimer);
		};
	});
</script>

<canvas bind:this={canvasEl} class="particle-field" aria-hidden="true"></canvas>

<style>
	.particle-field {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 0;
	}
</style>
