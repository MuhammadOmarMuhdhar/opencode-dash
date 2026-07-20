<script>
	import { toPng } from 'html-to-image';

	export let title = 'Section';
	export let sectionId = 'share-section';

	let capturing = false;

	function isCanvasBlank(canvas) {
		const dataUrl = canvas.toDataURL();
		return dataUrl === 'data:,';
	}

	function isSvgPopulated(svg) {
		return svg.querySelectorAll('*').length > 0;
	}

	async function waitForCharts(node) {
		const canvases = node.querySelectorAll('canvas');
		const svgs = node.querySelectorAll('svg');

		if (canvases.length === 0 && svgs.length === 0) return;

		await new Promise(resolve => setTimeout(resolve, 300));

		const maxAttempts = 30;
		const interval = 500;

		for (let attempt = 0; attempt < maxAttempts; attempt++) {
			const canvasBlank = Array.from(canvases).some(isCanvasBlank);
			const svgEmpty = Array.from(svgs).some(svg => !isSvgPopulated(svg));
			if (!canvasBlank && !svgEmpty) return;
			await new Promise(resolve => setTimeout(resolve, interval));
		}
	}

	async function captureNode() {
		const node = document.getElementById(sectionId);
		if (!node) return null;

		await waitForCharts(node);

		const opts = {
			cacheBust: true,
			pixelRatio: 2,
			backgroundColor: '#ffffff'
		};

		await toPng(node, opts);
		const dataUrl = await toPng(node, opts);

		return dataUrl;
	}

	async function downloadImage() {
		if (capturing) return;
		capturing = true;
		const dataUrl = await captureNode();
		capturing = false;
		if (!dataUrl) return;

		const link = document.createElement('a');
		link.download = `opencode-${title.toLowerCase().replace(/\s+/g, '-')}.png`;
		link.href = dataUrl;
		link.click();
	}
</script>

<div class="share-section-wrapper">
	<div id={sectionId} class="capture-wrapper">
		<div class="share-capture-target">
			<slot />
		</div>
	</div>

	<button
		class="download-icon"
		on:click={downloadImage}
		disabled={capturing}
		title="Download image"
	>
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
			<polyline points="7 10 12 15 17 10"/>
			<line x1="12" y1="15" x2="12" y2="3"/>
		</svg>
	</button>
</div>

<style>
	.share-section-wrapper {
		position: relative;
	}

	.capture-wrapper {
		padding: 24px;
		background-color: #ffffff;
	}

	.share-capture-target {
		position: relative;
	}

	.download-icon {
		position: absolute;
		top: 36px;
		right: 8px;
		z-index: 10;
		background: rgba(255, 255, 255, 0.9);

		padding: 6px;
		cursor: pointer;
		color: #6b7280;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: inherit;
		transition: all 0.15s ease;
	}

	.download-icon:hover {
		color: #3b82f6;
	}

	.download-icon:disabled {
		opacity: 0.5;
		cursor: wait;
	}
</style>
