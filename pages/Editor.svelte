<script lang="ts">
	import { onMount } from 'svelte'
	import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

	import { svgContent } from './stores'

	let editorContainer: HTMLDivElement

	onMount(() => {
		const editor = monaco.editor.create(editorContainer, {
			value: $svgContent,
			language: 'xml',
			theme: 'vs-dark',
			readOnly: true,
		})
		svgContent.subscribe(value => {
			editor.setValue(value)
		})
	})
</script>

<div id="editor" bind:this={editorContainer}></div>

<style>
	#editor {
		grid-area: e;

		/* background: #1e1e1e; */
		/* important for resizing; */
		overflow: hidden;
	}
</style>
