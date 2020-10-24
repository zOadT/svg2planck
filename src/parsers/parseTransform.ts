import { Transform, Vec2 } from 'planck-js';
import { getAngle } from '../util';
import parseNumberList from './parseNumberList';

export default function parseTransform(value: string): Transform[] {

    const errorMsg = `Unexpected value '${value}' for transform attribute`

    // TODO validation (we currently accept invalid transforms)
    let transformDefinitions = value.match(/([a-zA-Z]+\s*\([^\)]+\))/g)
    if(transformDefinitions === null) {
        throw new Error(errorMsg)
    }

    return transformDefinitions.map(transformDefinition => {
        let strings = transformDefinition.match(/([a-zA-Z]+)\s*\(([^\)]+)\)/)
        if(strings === null) {
            throw new Error(errorMsg)
        }
        const [_, name, paramsString] = strings

        return {
            name,
            params: parseNumberList(paramsString)
        }
    }).map(({name, params}) => {
        switch(name) {
            case 'matrix':
                return parseMatrixTransform(params)
            case 'translate':
                return parseTranslationTransform(params)
            case 'rotate':
                return parseRotationTransform(params)
            case 'scale':
            case 'screwX':
            case 'screwY':
                console.warn(`Transform definiton '${name}' is not supported and gets ignored`)
                return Transform.identity()
            default:
                throw new Error(errorMsg)
        }
    })

    function parseMatrixTransform(params: number[]): Transform {
        if(params.length !== 6) {
            throw new Error(errorMsg)
        }
        const [a, b, c, d, e, f] = [...params]

        const EPSILON = e-2

        const arccos1 = Math.acos(a)
        const arccos2 = Math.acos(d)
        const arcsin1 = Math.asin(b)
        const arcsin2 = Math.asin(-c)

        const arccos = (arccos1 + arccos2) / 2
        const arcsin = (arcsin1 + arcsin2) / 2

        if(Math.abs(Math.hypot(arccos, arcsin) - 1) > EPSILON ||
            Math.abs(arccos1 - arccos2) > EPSILON ||
            Math.abs(arcsin1 - arcsin2) > EPSILON) {
                console.warn('TODO') // TODO
        }

        return Transform(Vec2(e, f), getAngle(arccos, arcsin))
    }
    
    function parseTranslationTransform(params: number[]): Transform {
        if(params.length !== 1 && params.length !== 2) {
            throw new Error(errorMsg)
        }
        return Transform(Vec2(params[0], params[1] ?? 0), 0)
    }
    
    function parseRotationTransform(params: number[]): Transform {
        if(params.length !== 1 && params.length !== 3) {
            throw new Error(errorMsg)
        }
        const [rotationInDegrees, x, y] = [...params]
        const rotation = rotationInDegrees * Math.PI / 180
        if(x !== undefined) {
            return Transform.mul(Transform(Vec2(x, y), rotation), Transform(Vec2(-x, -y), 0))
        }
        return Transform(Vec2(), rotation)
    }

}
