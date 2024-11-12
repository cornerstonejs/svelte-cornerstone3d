<script module lang="ts">
	import { init as initTools } from '@cornerstonejs/tools';
	import {
		init as initCore,
		RenderingEngine,
	} from '@cornerstonejs/core';
	import { init as initDicomLoader } from '@cornerstonejs/dicom-image-loader'
	

	let engine = $state<RenderingEngine>();
	if (typeof window !== 'undefined') {
		initCore();
		initTools();
		initDicomLoader({maxWebWorkers: 2});
		engine = new RenderingEngine('rendering_engine_0');
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import type { ViewportType } from '@cornerstonejs/core/enums';
	import type { IStackViewport, IViewport, IVolumeViewport, ViewportInputOptions } from '@cornerstonejs/core/types';

	let {
		viewportId,
		viewportType,
		opts,
		class: classNames = '',
		onReady,
	}: {
		imageId: string;
		viewportId: string;
		viewportType: ViewportType;
		opts?: ViewportInputOptions;
		onReady?: (viewport: IViewport | IVolumeViewport | IStackViewport) => Promise<void> | void;
		class?: string;
	} = $props();

	function createCornerstoneContext(node: HTMLDivElement) {
		let viewport: IViewport | undefined;
		$effect(() => {
			untrack(() => {
				engine?.enableElement({
					element: node,
					viewportId: viewportId,
					type: viewportType,
					defaultOptions: opts
				});
			});
			viewport = engine?.getViewport(viewportId);
			if (viewport) {
				onReady?.(viewport);
			}
			return () => {
				engine?.disableElement(viewportId);
			};
		});
	}
</script>


<div use:createCornerstoneContext class={classNames}>

</div>