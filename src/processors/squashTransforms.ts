import { Mat33 } from 'planck-js'
import mat33mul from '../mat33/mat33mul'

export default function squashTransforms(value: Mat33[], name: string) {
    if(name !== 'transform') {
        return value
    }
    return value.reduce(mat33mul)
}
