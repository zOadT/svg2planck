export default function parseNumberList(value: string): number[] {
    // TODO validation (we currently accept invalid number lists)
    let result = value.match(/[\+\-]?\d*[\d\.](?:\d+)?/g)?.map(parseFloat)
    if(result === undefined) {
        return []
    }
    return result
}
