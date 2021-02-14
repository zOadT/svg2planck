<script lang="ts">
    import { svgContent, scale, error } from './stores'

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
    <span style="color: red">
        { $error ?? '' }
    </span>
</div>

<style>
    #toolbar {
		grid-area: t;
	}
</style>