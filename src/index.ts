import { parseStringPromise, processors, OptionsV2 } from 'xml2js'
import { parseTransforms, squashTransforms, parsePoints, scale } from './processors'

type Options = {
    meterPerPixelRatio?: number,
} & Omit<Omit<Omit<OptionsV2, 'attrkey'>, 'explicitChildren'>, 'preserveChildrenOrder'>

export default function svg2planck(svg: string, options: Options) {
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