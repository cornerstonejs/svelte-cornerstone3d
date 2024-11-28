<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>Cornerstone3D - Svelte</title>
</svelte:head>

{@render children()}
