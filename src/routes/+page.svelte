<script lang="ts">
	import { createImageIdsAndCacheMetaData } from '$lib/util/createImageIdsAndCacheMetaData';
	import { volumeLoader } from '@cornerstonejs/core';
	import { OrientationAxis, ViewportType } from '@cornerstonejs/core/enums';
	import type { IStackViewport, IViewport, IVolumeViewport } from '@cornerstonejs/core/types';
	import { onMount } from 'svelte';

	// Cornerstone has references to document/window/etc so we have to wait to import
	// until mounted
	let viewer = import('$lib/components/CornerstoneViewer.svelte');
	let imageIds = $state<string[]>([]);
	let volumeId = 'streamingImageVolume';

	onMount(async () => {
		imageIds = await createImageIdsAndCacheMetaData({
			StudyInstanceUID: '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
			SeriesInstanceUID: '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
			wadoRsRoot: 'https://d3t6nz73ql33tx.cloudfront.net/dicomweb'
		});
	});

	async function loadImages(viewport: IViewport | IVolumeViewport | IStackViewport) {
		let volume = await volumeLoader.createAndCacheVolume(volumeId, {
			imageIds
		});
		volume.load();
		(viewport as IVolumeViewport).setVolumes([{ volumeId }]);
		viewport.render();
	}
</script>

<div class="mx-auto h-screen w-full space-y-2">
	<div class="w-full text-center text-4xl font-bold">
		<h1>Cornerstone3D x SvelteKit Demo</h1>
	</div>
	<div
		class="mx-auto h-80 w-80 sm:h-96 sm:w-96 md:h-[32rem] md:w-[32rem] lg:h-[40rem] lg:w-[40rem]"
	>
		<p class="text-xl font-medium">Volume Viewport</p>
		{#await viewer then { default: Viewer }}
			<Viewer
				class="h-full w-full"
				imageId="test"
				viewportId="viewport-1"
				viewportType={ViewportType.ORTHOGRAPHIC}
				opts={{
					orientation: OrientationAxis.AXIAL
				}}
				onReady={loadImages}
			/>
		{/await}
	</div>
</div>
