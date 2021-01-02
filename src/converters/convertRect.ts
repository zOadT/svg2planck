import { Box, Transform, Vec2 } from 'planck-js';
import { getAngle } from '../util';

export default function (node: any, transform?: Transform): Box[] {

    let center = Vec2(
        (node.$.x ?? 0) + node.$.width / 2,
        (node.$.y ?? 0) + node.$.height / 2
    )

    const transformProduct = [transform, node.$.transform]
        .filter(a => a)
        .reduce(Transform.mul, Transform.identity())

    center = Transform.mul(transformProduct, center)
    let angle = getAngle(
        Math.acos(transformProduct.q.c),
        Math.asin(transformProduct.q.s)
    )

    return [Box(node.$.width, node.$.height, center, angle)]
}