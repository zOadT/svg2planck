import { Mat33, Vec3 } from 'planck-js';
import parseNumberList from './parseNumberList';

export default function parseTransform(value: string): Mat33[] {

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
                return parseScale(params)
            case 'screwX':
                // TODO
            case 'screwY':
                // TODO
                throw new Error(`Transform definiton '${name}' is not supported and gets ignored`)
            default:
                throw new Error(errorMsg)
        }
    })

    function parseMatrixTransform(params: number[]): Mat33 {
        if(params.length !== 6) {
            throw new Error(errorMsg)
        }
        const [a, b, c, d, e, f] = [...params]

        return new Mat33(
            Vec3(a, b, 0),
            Vec3(c, d, 0),
            Vec3(e, f, 1)
        )
    }
    
    function parseTranslationTransform(params: number[]): Mat33 {
        if(params.length !== 1 && params.length !== 2) {
            throw new Error(errorMsg)
        }
        return new Mat33(
            Vec3(1, 0, 0),
            Vec3(0, 1, 0),
            Vec3(params[0], params[1] ?? 0, 1)
        )
    }
    
    function parseRotationTransform(params: number[]): Mat33 {
        if(params.length !== 1 && params.length !== 3) {
            throw new Error(errorMsg)
        }
        const [rotationInDegrees, x, y] = [...params]
        const alpha = rotationInDegrees * Math.PI / 180

        return new Mat33(
            Vec3( Math.cos(alpha), Math.sin(alpha), 0),
            Vec3(-Math.sin(alpha), Math.cos(alpha), 0),
            x === undefined
                ? Vec3(0, 0, 1)
                : Vec3(
                    -x * Math.cos(alpha) + y * Math.sin(alpha) + x,
                    -x * Math.sin(alpha) - y * Math.cos(alpha) + y,
                    1
                )
        )
    }

    function parseScale(params: number[]): Mat33 {
        if(params.length !== 1 && params.length !== 2) {
            throw new Error(errorMsg)
        }
        return new Mat33(
            Vec3(params[0], 0, 0),
            Vec3(0, params[1] ?? params[0], 0),
            Vec3(0, 0, 1)
        )
    }

}
