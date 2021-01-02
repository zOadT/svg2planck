export * as processors from './processors'
export * as parsers from './parsers'
export * as util from './util'
export * as converters from './converters'

import { Mat33, Vec3 } from 'planck-js'
import { parseStringPromise, processors, OptionsV2 } from 'xml2js'
import { parseTransforms, squashTransforms, parsePoints, parsePaths, interpretPaths } from './processors'
import { wringOutMat33 } from './mat33'

export type Options = {
    meterPerPixelRatio?: number,
    scaleY?: number,
} & Omit<Omit<Omit<Omit<OptionsV2, 'attrkey'>, 'explicitChildren'>, 'preserveChildrenOrder'>, 'explicitRoot'>

export async function svg2planck(svg: string, options: Options) {
    let rootNode = await parseStringPromise(svg, {
        ...options,
        attrkey: '$',
        explicitChildren: true,
        preserveChildrenOrder: true,
        explicitRoot: false,
        attrValueProcessors: [
            parseTransforms,
            <any>squashTransforms,
            parsePoints,
            parsePaths,
            interpretPaths,
            processors.parseNumbers,
            ...(options.attrNameProcessors ?? [])
        ]
    })

    const scale = options.meterPerPixelRatio ?? 1
    const scaleY = options.scaleY ?? 1
    const A = (scale !== 1 || scaleY !== 1)
      ? new Mat33(
          Vec3(scale, 0, 0),
          Vec3(0, scale * scaleY, 0),
          Vec3(0, 0, 1)
        )
      : null

    wringOutMat33(rootNode, A)

    return rootNode
}