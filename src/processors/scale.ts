import type { Transform, Vec2 } from 'planck-js'

export default function scale(factor: number) {
    return (value: any, name: string) => {
        switch (name) {
            case "transform":
                (<Transform>value).p.mul(factor)
                return value
            case "points":
                return (<Vec2[]>value).map(point => point.mul(factor))
            case "cx":
            case "cy":
            case "r":
            case "rx":
            case "ry":
            case "x":
            case "x1":
            case "x2":
            case "y":
            case "y1":
            case "y2":
            case "width":
            case "height":
            case "pathLength":
                return value * factor
            case "d":
                // TODO
                break
            default:
                return value
        }
    }
}