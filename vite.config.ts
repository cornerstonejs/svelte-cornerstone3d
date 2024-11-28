import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';

export default defineConfig({
	plugins: [sveltekit(), viteCommonjs()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	build: {
		target: 'esnext',
		rollupOptions: {
			treeshake: true
		}
	},
	ssr: {
		noExternal: [
			'@cornerstonejs/core',
			'@cornerstonejs/tools',
			'@cornerstonejs/dicom-image-loader',
			'@kitware/vtk.js'
		]
	},
	optimizeDeps: {
		exclude: ['@cornerstonejs/dicom-image-loader'],
		include: ['dicom-parser', 'jpeg-lossless-decoder-js']
	},
	worker: {
		format: 'es',
		rollupOptions: {
			external: ['@icr/polyseg-wasm']
		}
	}
});
