<script lang="ts">
	import Toolbar from './Toolbar.svelte'
	import Editor from './Editor.svelte'
	import View from './View.svelte'

	import { svgContent } from './stores'
</script>

<Toolbar/>
<Editor bind:value={$svgContent}/>
<View/>
