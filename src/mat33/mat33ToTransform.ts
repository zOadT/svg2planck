import { Vec2, Vec3, Transform, Mat33 } from 'planck-js'
import { getAngle } from '../util'
import mat33mul from './mat33mul'

const EPSILON = 1e-3

/**
 * Returns a Transform T and an overhang B such that A = T * B
 */
export default function mat33ToTransform(A: Mat33): { transform: Transform, overhang: Mat33 | null } {
    const {
        ex: {x: a, y: b},
        ey: {x: c, y: d},
        ez: {x: e, y: f}
    } = A

    const det = a * d - b * c
    if(Math.abs(det) < EPSILON) {
        throw new Error('Invalid transforma because the matrix does not have full rank')
    }

    // naively take first column to calcutate rotation angle
    const length = Math.hypot(a, b)
    const alpha = getAngle(Math.acos(a / length), Math.asin(b / length))

    const transform = Transform(Vec2(e, f), alpha)

    // B = T^{-1} * A
    const B = mat33mul(new Mat33(
        Vec3(Math.cos(alpha), -Math.sin(alpha), 0),
        Vec3(Math.sin(alpha),  Math.cos(alpha), 0),
        Vec3(-f * Math.sin(alpha) - e * Math.cos(alpha), -f * Math.cos(alpha) + e * Math.sin(alpha), 1)
    ), A)

    return {
        transform,
        overhang: isAlmostIdentity(B) ? null : B
    }
}

function isAlmostIdentity(A: Mat33): boolean {
    const {
        ex: {x: a, y: b},
        ey: {x: c, y: d},
        ez: {x: e, y: f}
    } = A

    return [a - 1, b, c, d - 1, e, f]
        .every(x => Math.abs(x) < EPSILON)
}