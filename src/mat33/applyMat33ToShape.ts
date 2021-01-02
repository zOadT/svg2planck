import { Mat33, Vec2, Vec3, Transform } from 'planck-js'
import { mat33mul, mat33ToTransform } from '.'
import { PathSegment } from '../parsers/interpretPath'

const EPSILON = 1e-3

export default function applyMat33ToShape(node: any, A: Mat33 | null) {

    if(!A) {
        return
    }
    if(!node.$) {
        node.$ = {}
    }
    if(node.$.transform) {
        A = mat33mul(A, node.$.transform)
    }
    const { transform, overhang } = mat33ToTransform(A)

    node.$.transform = transform
    if(!overhang) {
        return
    }

    switch(node['#name'].toLowerCase()) {
        case 'rect':
            rect2polygon(node)
            /* FALLTHROUGH */
        case 'polygon':
        case 'polyline':
            if(node.$.points) {
                node.$.points = node.$.points.map((point: Vec2) => {
                    return matt33mulVec2(overhang, point)
                });
            }
            break
        
        case 'circle':
            circle2ellipse(node)
            /* FALLTHROUGH */
        case 'ellipse':
            applyMat33ToEllipse(node, overhang)
            ellipse2circle(node)
            break
        
        case 'line':
            applyMat33ToLine(node, overhang)
            break
        
        case 'path':
            applyMat33ToPath(node, overhang)
            break
        
        default:
            throw new Error(`<${node['#name']}> tag is not supported`)
    }
}

function rect2polygon(node: any) {
    node['#name'] = 'polygon'

    const hx = node.$.width / 2
    const hy = node.$.height / 2
    const cx = (node.$.x ?? 0) + hx
    const cy = (node.$.y ?? 0) + hy

    node.$.points = [
        Vec2(cx + hx, cy - hy),
        Vec2(cx + hx, cy + hy),
        Vec2(cx - hx, cy + hy),
        Vec2(cx - hx, cy - hy)
    ]
}

function matt33mulVec2(A: Mat33, point: Vec2) {
    const p = Mat33.mulVec3(A, Vec3(point.x, point.y, 1))
    return Vec2(p.x, p.y)
}

function circle2ellipse(node: any) {
    node['#name'] = 'ellipse'

    node.$.rx = node.$.r
    node.$.ry = node.$.r
}

function applyMat33ToEllipse(node: any, A: Mat33) {
    // see https://en.wikipedia.org/wiki/Ellipse#General_ellipse_2

    const center = Mat33.mulVec3(A, Vec3(node.$.cx ?? 0, node.$.cy ?? 0, 1))

    A.ex.mul(node.$.rx ?? node.$.ry ?? 0)
    A.ey.mul(node.$.ry ?? node.$.rx ?? 0)

    const x = 2 * Vec3.dot(A.ex, A.ey) / (Vec3.dot(A.ex, A.ex) - Vec3.dot(A.ey, A.ey))
    const t_0 = Number.isNaN(x) ? 0 : Math.atan(x) / 2

    const p = (t: number) => Vec3.add(Vec3.mul(A.ex, Math.cos(t)), Vec3.mul(A.ey, Math.sin(t)))
    
    const verticeA = p(t_0)
    node.$.rx = Math.hypot(verticeA.x, verticeA.y)
    
    const verticeB = p(t_0 + Math.PI / 2)
    node.$.ry = Math.hypot(verticeB.x, verticeB.y)
    
    node.$.transform = Transform.mul(node.$.transform, Transform(Vec2(center.x, center.y), t_0))
    node.$.cx = 0
    node.$.cy = 0
}

function ellipse2circle(node: any) {
    if(Math.abs(node.$.rx - node.$.ry) < EPSILON) {
        node['#name'] = 'circle'
        node.$.r = node.$.rx
    }
}

function applyMat33ToLine(node: any, A: Mat33) {
    const point1 = Mat33.mul(A, Vec2(node.$.x1 ?? 0, node.$.y1 ?? 0))
    const point2 = Mat33.mul(A, Vec2(node.$.x2 ?? 0, node.$.y2 ?? 0))

    node.$.x1 = point1.x
    node.$.y1 = point1.y
    node.$.x2 = point2.x
    node.$.y2 = point2.y
}

function applyMat33ToPath(node: any, A: Mat33) {
    if(!node.$.d) {
        return
    }
    for(let segment of node.$.d as PathSegment[]) {
        segment.startingPoint = matt33mulVec2(A, segment.startingPoint)
        segment.endPoint = matt33mulVec2(A, segment.endPoint)
        
        switch(segment.type) {
            case 'CubicBezierCurve':
                segment.startControlPoint = matt33mulVec2(A, segment.startControlPoint)
                segment.endControlPoint = matt33mulVec2(A, segment.endControlPoint)
                break
            case 'QuadraticBezierCurve':
                segment.controlPoint = matt33mulVec2(A, segment.controlPoint)
                break
            case 'EllipticalArcCurve':
                // TODO
                console.warn('Elliptical arc curves are not supported')
                break
        }
    }
}