<script lang="ts">
	import CornerstoneContext from '$lib/components/CornerstoneContext.svelte';
	import CornerstoneViewer from '$lib/components/CornerstoneViewer.svelte';
	import { createImageIdsAndCacheMetaData } from '$lib/util/createImageIdsAndCacheMetaData';
	import { cache, volumeLoader } from '@cornerstonejs/core';
	import { OrientationAxis, ViewportType } from '@cornerstonejs/core/enums';
	import type { IStackViewport, IViewport, IVolumeViewport } from '@cornerstonejs/core/types';
	import {
		addTool,
		PanTool,
		removeTool,
		StackScrollTool,
		ToolGroupManager
	} from '@cornerstonejs/tools';
	import { MouseBindings } from '@cornerstonejs/tools/enums';

	const volumeId = 'streamingImageVolume';
	const viewportId = 'viewport-1';
	const toolGroupId = 'tool-group-1';
	const engineId = 'my-rendering-engine';

	function loadImages(viewport: IViewport | IVolumeViewport | IStackViewport) {
		createImageIdsAndCacheMetaData({
			StudyInstanceUID: '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
			SeriesInstanceUID: '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
			wadoRsRoot: 'https://d3t6nz73ql33tx.cloudfront.net/dicomweb'
		}).then(async (imageIds) => {
			const vp = <IVolumeViewport>viewport;
			const volumeLoaderOpts = { imageIds };
			const volume = await volumeLoader.createAndCacheVolume(volumeId, volumeLoaderOpts);
			volume.load();
			vp.setVolumes([{ volumeId }]);
			vp.render();
			let toolGroup = ToolGroupManager.getToolGroup(toolGroupId);
			if (toolGroup) {
				toolGroup.addViewport(viewportId, viewport.getRenderingEngine().id);
			}
		});
		// Cleanup function
		return () => {
			cache.removeVolumeLoadObject(volumeId);
		};
	}

	function registerTools() {
		addTool(StackScrollTool);
		addTool(PanTool);
		const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
		if (toolGroup !== undefined) {
			toolGroup.addTool(StackScrollTool.toolName);
			toolGroup.addTool(PanTool.toolName);
			toolGroup.setToolActive(StackScrollTool.toolName, {
				bindings: [
					{
						mouseButton: MouseBindings.Wheel
					}
				]
			});
			toolGroup.setToolActive(PanTool.toolName, {
				bindings: [
					{
						mouseButton: MouseBindings.Primary
					}
				]
			});
		}
		// Cleanup function
		return () => {
			ToolGroupManager.destroyToolGroup(toolGroupId);
			removeTool(StackScrollTool);
			removeTool(PanTool);
		};
	}
</script>

<div class="mx-auto h-screen w-full space-y-2">
	<div class="text-center text-4xl font-bold">
		<h1>Cornerstone3D x SvelteKit Demo</h1>
	</div>
	<CornerstoneContext {engineId} onReady={registerTools}>
		{#snippet children(engine)}
			<CornerstoneViewer
				class="mx-auto h-80 w-80 sm:h-96 sm:w-96 md:h-[32rem] md:w-[32rem] lg:h-[40rem] lg:w-[40rem]"
				{viewportId}
				{engine}
				viewportType={ViewportType.ORTHOGRAPHIC}
				opts={{
					orientation: OrientationAxis.AXIAL
				}}
				onReady={loadImages}
			/>
		{/snippet}
	</CornerstoneContext>
</div>
