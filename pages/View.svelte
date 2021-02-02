<script lang="ts">
    import { derived } from 'svelte/store'
    import { svgContent, scale } from './stores'
    import { World, Transform } from 'planck-js'
    import { testbed } from 'planck-js/testbed'
    import { svg2planck, util, converters } from '../dist'

    function transformTree(node, world, transform) {
        if(util.isShape(node)) {
            let body = world.createBody({
                position: transform.p,
                angle: transform.q.getAngle()
            })
            for(let shape of converters.convertShape(node)) {
                body.createFixture(shape)
            }
        } else if(node.$$) {
            if(node.$?.transform) {
                transform = Transform.mul(transform, node.$.transform)
            }
            for(let child of node.$$) {
                transformTree(child, world, transform)
            }
        }
        return world
    }

    async function buildWorld(svg: string, meterPerPixelRatio) {
        const rootNode = await svg2planck(svg, {
            meterPerPixelRatio,
            scaleY: 1
        })
        const world = transformTree(rootNode, World(), Transform.identity());

        let viewBox = rootNode.$.viewBox.match(/[\+\-]?\d+(?:\.\d+)?/g)?.map(parseFloat)

        return {
            viewBox,
            meterPerPixelRatio,
            world
        }
    }

    export const world = derived([svgContent, scale], ([$svgContent, $scale], set) => {
        buildWorld($svgContent, $scale).then(world => set(world))
    }, {
        viewBox: [],
        meterPerPixelRatio: 0.1,
        world: World()
    })

    const currentWorld = World()
    let view
    testbed('svg2planck', _testbed => {
        view = _testbed
        view.scaleY = 1
        return currentWorld
    })

    world.subscribe(({viewBox, meterPerPixelRatio, world}) => {
        if(viewBox && viewBox.length === 4) {
            view.x = (viewBox[0] + viewBox[2] / 2) * meterPerPixelRatio
            view.y = (viewBox[1] + viewBox[3] / 2) * meterPerPixelRatio
            view.width = viewBox[2] * meterPerPixelRatio
            view.height = viewBox[3] * meterPerPixelRatio
        }
        
        for(let b = currentWorld.getBodyList(); b; b = b.getNext()) {
            currentWorld.destroyBody(b)
        }
        Object.assign(currentWorld, world)
    })
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