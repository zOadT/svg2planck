import { Circle, Polygon, Transform, Vec2 } from 'planck-js';

export default function(node: any, transform?: Transform): Polygon[] {
    const numberOfPoints = 12 // TODO as param

    let position = Vec2(node.$?.cx ?? 0, node.$?.cy ?? 0)

    let transformation = position = [transform, node.$.transform, Transform(position, 0)]
        .filter(a => a)
        .reduce(Transform.mul)

    let vertices = Array(numberOfPoints).fill(0)
        .map((_, index) => index / numberOfPoints * 2 * Math.PI)
        .map(alpha => 
            Vec2(
                Math.cos(alpha) * (node.$?.rx ?? node.$?.ry ?? 0),
                Math.sin(alpha) * (node.$?.ry ?? node.$?.rx ?? 0)
            )
        )
        .map(p =>
            Transform.mul(transformation, p)
        )

    return [Polygon(vertices)]
}