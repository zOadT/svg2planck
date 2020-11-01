import { Circle, Transform, Vec2 } from 'planck-js';

export default function(node: any, transform?: Transform): Circle {

    let position = Vec2(node.$?.cx ?? 0, node.$?.cy ?? 0)

    position = [transform, node.$.transform, position]
        .filter(a => a)
        .reduce(Transform.mul)

    return Circle(position, node.$?.r ?? 0)
}