import { Mat33, Vec3 } from 'planck-js'

export default function mat33mul(A: Mat33, B: Mat33): Mat33 {
    const {
        ex: {x: a, y: b},
        ey: {x: c, y: d},
        ez: {x: e, y: f}
    } = A

    const {
        ex: {x: a_, y: b_},
        ey: {x: c_, y: d_},
        ez: {x: e_, y: f_}
    } = B

    return new Mat33(
        Vec3(a * a_ + c * b_, b * a_ + d * b_, 0),
        Vec3(a * c_ + c * d_, b * c_ + d * d_, 0),
        Vec3(a * e_ + c * f_ + e, b * e_ + d * f_ + f, 1)
    )
}