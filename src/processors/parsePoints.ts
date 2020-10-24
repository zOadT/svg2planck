import { Vec2 } from 'planck-js'
import { parseNumberList } from '../parsers'

export default function parsePoints(value: string, name: string) {
    if(name !== 'points') {
        return value
    }
    const coordinates = parseNumberList(value)
    const points = [] as Vec2[]

    for(let i = 1; i < coordinates.length; i += 2) {
        points.push(Vec2(coordinates[i - 1], coordinates[i]))
    }

    return points
}
