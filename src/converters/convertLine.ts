import { Edge, Transform, Vec2 } from 'planck-js';

export default function(node: any, transform?: Transform): Edge {

    let point1 = Vec2(node.$?.x1 ?? 0, node.$?.y1 ?? 0)
    let point2 = Vec2(node.$?.x2 ?? 0, node.$?.y2 ?? 0)

    point1 = [transform, node.$.transform, point1]
        .filter(a => a)
        .reduce(Transform.mul)
    point2 = [transform, node.$.transform, point2]
        .filter(a => a)
        .reduce(Transform.mul)

    return Edge(point1, point2)
}