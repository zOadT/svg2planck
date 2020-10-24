import { parseTransform } from '../parsers'
import { Transform } from 'planck-js'

export default function parseTransforms(value: string, name: string) {
    if(name !== 'transform') {
        return value
    }
    try {
        return parseTransform(value)
    } catch(e) {
        console.warn(e.message) // TODO ok?
        return Transform.identity()
    }
}
