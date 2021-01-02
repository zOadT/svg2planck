import { parsePath } from '../parsers'

export default function parsePaths(value: string, name: string) {
    if(name !== 'd') {
        return value
    }
    try {
        return parsePath(value)
    } catch(e) {
        console.warn(e.message) // TODO ok?
        return []
    }
}
