<script lang="ts">
	import { init as initTools } from '@cornerstonejs/tools';
	import { init as initCore, isCornerstoneInitialized, RenderingEngine } from '@cornerstonejs/core';
	import { init as initDicomLoader } from '@cornerstonejs/dicom-image-loader';
	import { untrack, type Snippet } from 'svelte';

	type CornerstoneContextProps = {
		children: Snippet<[RenderingEngine]>;
		onReady?: () => () => void;
	};

	let { children, onReady }: CornerstoneContextProps = $props();

	let engine = $state<RenderingEngine>();

	// Cornerstone context initialization
	$effect(() => {
		const isInitialized = isCornerstoneInitialized();
		if (!isInitialized) {
			initCore();
			initTools();
			initDicomLoader({ maxWebWorkers: 2 });
		}
		if (!untrack(() => engine)) {
			engine = new RenderingEngine('rendering_engine_0');
		}
		let destroyFn = onReady?.();
		return () => {
			destroyFn?.();
			engine?.destroy();
		};
	});
</script>

{#if engine}
	{@render children(engine)}
{/if}
