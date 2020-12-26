export default function isShape(node: any) {
    return [
        'circle',
        'ellipse',
        'line',
        'polygon',
        'polyline',
        'rect'
    ].includes(node['#name'].toLowerCase())
}