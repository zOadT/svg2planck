export default function parseNumberList(value: string): number[] {
    let result = value.match(/[\+\-]?\d+(?:\.\d+)?/g)?.map(parseFloat)
    if(result === undefined) {
        throw new Error(`Could not parse '${value}' to a list of numbers`)
    }
    return result
}
