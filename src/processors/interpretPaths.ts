import { interpretPath } from '../parsers'

export default function interpretPaths(value: any, name: string) {
    if(name !== 'd') {
        return value
    }
    try {
        return interpretPath(value)
    } catch(e) {
        console.warn(e.message) // TODO ok?
        return []
    }
}
