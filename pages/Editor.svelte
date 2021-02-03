<script lang="ts">
	import { onMount } from 'svelte'
	import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

	import { svgContent } from './stores'

	let editorContainer: HTMLDivElement

	let editor: monaco.editor.IStandaloneCodeEditor

	onMount(() => {
		editor = monaco.editor.create(editorContainer, {
			value: $svgContent,
			language: 'xml',
			theme: 'vs-dark',
			readOnly: true,
		})
		svgContent.subscribe(value => {
			editor.setValue(value)
		})
	})

	function resizeEditor() {
		if(editor) {
			editor.layout({
				width: editorContainer.clientWidth,
				height: editorContainer.clientHeight,
			})
		}
	}
</script>

<svelte:window on:resize={resizeEditor}/>

<div id="editor" bind:this={editorContainer}></div>

<style>
	#editor {
		grid-area: e;

		/* background: #1e1e1e; */
		/* important for resizing; */
		overflow: hidden;
	}
</style>
