import { Transform } from 'planck-js'

export default function squashTransforms(value: Transform[], name: string) {
    if(name !== 'transform') {
        return value
    }
    return value.reduce(Transform.mul)
}
