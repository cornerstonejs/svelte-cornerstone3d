<script module lang="ts">
	import { init as initTools } from '@cornerstonejs/tools';
	import { init as initCore, RenderingEngine } from '@cornerstonejs/core';
	import { init as initDicomLoader } from '@cornerstonejs/dicom-image-loader';

	// By defining engine in a module block all instances of CornerstoneViewer
	// can share this reference
	let engine = $state<RenderingEngine>();

	if (typeof window !== 'undefined') {
		initCore();
		initTools();
		initDicomLoader({ maxWebWorkers: 2 });
		engine = new RenderingEngine('rendering_engine_0');
	}
</script>

<script lang="ts">
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
		opts,
		onReady,
		class: classNames = '',
	}: {
		viewportId: string;
		viewportType: ViewportType;
		opts?: ViewportInputOptions;
		onReady?: (viewport: IViewport | IVolumeViewport | IStackViewport) => Promise<void> | void;
		class?: string;
	} = $props();

	function createCornerstoneContext(
		node: HTMLDivElement,
		props: { viewportId: string; type: ViewportType; defaultOptions?: ViewportInputOptions }
	) {
		if (!engine) return;
		$effect(() => {
			engine.enableElement({
				element: node,
				viewportId: props.viewportId,
				type: props.type,
				defaultOptions: props.defaultOptions
			});
			let viewport = engine.getViewport(viewportId);
			if (viewport) {
				onReady?.(viewport);
			}
			return () => {
				engine.disableElement(viewportId);
			};
		});
	}
</script>

<div
	use:createCornerstoneContext={{
		viewportId: viewportId,
		type: viewportType,
		defaultOptions: opts
	}}
	class={classNames}
></div>
