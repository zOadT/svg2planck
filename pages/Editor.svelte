<script lang="ts">
	import { onMount } from 'svelte'
	import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

	export let value = ''

	let editorContainer: HTMLDivElement
	let editor: monaco.editor.IStandaloneCodeEditor

	$: if(editor) {
		if(value !== editor.getModel().getValue()) {
			editor.setValue(value)
		}
	}

	onMount(() => {
		editor = monaco.editor.create(editorContainer, {
			value,
			language: 'xml',
			theme: 'vs-dark',
		})
		editor.onDidChangeModelContent(() => {
			value = editor.getModel().getValue()
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
