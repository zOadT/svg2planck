<script lang="ts">
    import { svgContent, scale, error, world } from './stores'
    import * as planck from 'planck-js'

    function handleFileChange(e) {
        openSVG(e.target.files[0])
    }
    function openSVG(file: File | undefined) {
        if(!file) {
            return
        }
        var reader = new FileReader();
        reader.onload = async function (event) {
            if(!event?.target?.result) {
                return
            }
            svgContent.set(<string>event.target.result)
        }
        reader.readAsBinaryString(file)
    }

    function exportWorld() {
        window.parent.postMessage((<any>planck).Serializer.toJson($world.world), '*')
    }
</script>

<div id="toolbar">
    <input
        type="file"
        accept=".svg"
        on:change={handleFileChange}
    >
    <input
        type="number"
        step=0.01
        bind:value={$scale}
    >
    {#if $error !== null}
        <span style="color: red">
            { $error ?? '' }
        </span>
    {:else if window !== window.parent}
        <input
            type="button"
            value="export"
            on:click={exportWorld}
        >
    {/if}
</div>

<style>
    #toolbar {
		grid-area: t;
	}
</style>