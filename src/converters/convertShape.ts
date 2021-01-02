import { Box, Chain, Circle, Edge, Polygon, Transform } from 'planck-js';
import convertCircle from './convertCircle';
import convertLine from './convertLine';
import convertPath from './convertPath';
import convertPolygon from './convertPolygon';
import convertPolyline from './convertPolyline';
import convertRect from './convertRect';

export default function(node: any, transform?: Transform): (Circle | Edge | Polygon | Chain | Box)[] {
    switch(node['#name'].toLowerCase()) {
        case 'circle':
            return convertCircle(node, transform)
        case 'ellipse':
            throw new Error('planck-js does not support ellipses')
        case 'line':
            return convertLine(node, transform)
        case 'path':
            return convertPath(node, transform)
        case 'polygon':
            return convertPolygon(node, transform)
        case 'polyline':
            return convertPolyline(node, transform)
        case 'rect':
            return convertRect(node, transform)
        default:
            throw new Error(`<${node['#name']}> tag can not be converted to a shape`)
    }
}