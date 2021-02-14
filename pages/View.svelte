<script lang="ts">
    import { World } from 'planck-js'
    import { testbed } from 'planck-js/testbed'

    const currentWorld = World()
    let view
    testbed('svg2planck', _testbed => {
        view = _testbed
        view.scaleY = 1
        return currentWorld
    })

    export let world

    $: {
        const { viewBox, meterPerPixelRatio, world: nextWorld } = world

        if(viewBox && viewBox.length === 4) {
            view.x = (viewBox[0] + viewBox[2] / 2) * meterPerPixelRatio
            view.y = (viewBox[1] + viewBox[3] / 2) * meterPerPixelRatio
            view.width = viewBox[2] * meterPerPixelRatio
            view.height = viewBox[3] * meterPerPixelRatio
        }
        
        for(let b = currentWorld.getBodyList(); b; b = b.getNext()) {
            currentWorld.destroyBody(b)
        }
        Object.assign(currentWorld, nextWorld)
    }
</script>

<canvas id="stage"></canvas>

<style>
    #stage {
		grid-area: v;

		width: 100%;
		height: 100%;

		background: #222222;
		border: none;
	}
</style>