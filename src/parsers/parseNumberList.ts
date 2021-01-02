export default function parseNumberList(value: string): number[] {
    let result = value.match(/[\+\-]?\d+(?:\.\d+)?/g)?.map(parseFloat)
    if(result === undefined) {
        return []
    }
    return result
}
