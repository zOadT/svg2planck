import { Polygon, Transform, Vec2 } from 'planck-js';

export default function(node: any, transform?: Transform): Polygon {

    let points = (node.$?.points ?? []) as Vec2[]

    points = points.map(point => [transform, node.$.transform, point]
        .filter(a => a)
        .reduce(Transform.mul))

    return Polygon(points)
}