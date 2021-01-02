export default function isShape(node: any) {
    return [
        'circle',
        'ellipse',
        'line',
        'path',
        'polygon',
        'polyline',
        'rect'
    ].includes(node['#name'].toLowerCase())
}