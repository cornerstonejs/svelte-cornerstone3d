<script lang="ts">
	import type { RenderingEngine } from '@cornerstonejs/core';
	import type { ViewportType } from '@cornerstonejs/core/enums';
	import type {
		IStackViewport,
		IViewport,
		IVolumeViewport,
		ViewportInputOptions
	} from '@cornerstonejs/core/types';

	let {
		viewportId,
		viewportType,
		engine,
		opts,
		onReady,
		class: classNames = ''
	}: {
		viewportId: string;
		viewportType: ViewportType;
		engine: RenderingEngine;
		opts?: ViewportInputOptions;
		onReady?: (viewport: IViewport | IVolumeViewport | IStackViewport) => () => void | undefined;
		class?: string;
	} = $props();

	let container = $state<HTMLDivElement>();

	$effect(() => {
		if (!container) return;
		engine.enableElement({
			element: container,
			viewportId: viewportId,
			type: viewportType,
			defaultOptions: opts
		});
		let viewport = engine.getViewport(viewportId);
		let destroyFn = onReady?.(viewport);
		return () => {
			engine.disableElement(viewportId);
			destroyFn?.();
		};
	});
</script>

<div bind:this={container} class={classNames}></div>
