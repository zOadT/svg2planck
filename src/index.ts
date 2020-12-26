export * as processors from "./processors"
export * as parsers from "./parsers"
export * as util from "./util"
export * as converters from "./converters"

import { parseStringPromise, processors, OptionsV2 } from 'xml2js'
import { parseTransforms, squashTransforms, parsePoints, scale } from './processors'

export type Options = {
    meterPerPixelRatio?: number,
} & Omit<Omit<Omit<OptionsV2, 'attrkey'>, 'explicitChildren'>, 'preserveChildrenOrder'>

export function svg2planck(svg: string, options: Options) {
    return parseStringPromise(svg, {
        ...options,
        attrkey: '$',
        explicitChildren: true,
        preserveChildrenOrder: true,
        attrValueProcessors: [
            parseTransforms,
            <any>squashTransforms,
            parsePoints,
            processors.parseNumbers,
            scale(options.meterPerPixelRatio ?? 1),
            ...(options.attrNameProcessors ?? [])
        ]
    })
}