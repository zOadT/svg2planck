<script lang="ts">
	import { onMount } from 'svelte';
	import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
	export let name: string;

	let editorContainer: HTMLDivElement

	onMount(() => {
		const editor = monaco.editor.create(editorContainer, {
			value: '<placeholder />',
			language: 'xml',
			theme: 'vs-dark',
		})
	})
</script>

<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>
<div id="editor" bind:this={editorContainer}></div>

<style>
	#editor {
		height: 300px;
	}
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
