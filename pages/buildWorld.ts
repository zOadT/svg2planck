import { World, Transform } from 'planck-js'
import { svg2planck, util, converters } from '../src'

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

export default async function buildWorld(svg: string, meterPerPixelRatio) {
    const rootNode = await svg2planck(svg, {
        meterPerPixelRatio,
        scaleY: 1
    })

    if(rootNode['#name'].toLowerCase() !== 'svg') {
        throw new Error('Root element is no svg element')
    }

    const world = transformTree(rootNode, World(), Transform.identity());

    let viewBox = rootNode.$?.viewBox?.match(/[\+\-]?\d+(?:\.\d+)?/g)?.map(parseFloat)

    return {
        viewBox,
        meterPerPixelRatio,
        world
    }
}
