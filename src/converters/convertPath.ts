import { Edge, Chain, Transform, Vec2 } from 'planck-js';
import { PathSegment, LineSegment, CubicBezierCurveSegment, QuadraticBezierCurveSegment, EllipticalArcCurveSegment } from '../parsers/interpretPath';

// TODO set ghost vertices

export default function(node: any, transform?: Transform): (Edge | Chain)[] {

    transform = ([transform, <Transform>node.$.transform, Transform.identity()]
        .filter(a => a) as Transform[])
        .reduce(Transform.mul)

    if(!node.$?.d) {
        return []
    }
    for(let segment of node.$.d as PathSegment[]) {
        
        segment.startingPoint = Transform.mul(transform, segment.startingPoint)
        segment.endPoint = Transform.mul(transform, segment.endPoint)
        
        switch(segment.type) {
            case 'CubicBezierCurve':
                segment.startControlPoint = Transform.mul(transform, segment.startControlPoint)
                segment.endControlPoint = Transform.mul(transform, segment.endControlPoint)
                break
            case 'QuadraticBezierCurve':
                segment.controlPoint = Transform.mul(transform, segment.controlPoint)
                break
            case 'EllipticalArcCurve':
                // TODO
                console.warn('Elliptical arc curves are not supported')
                break
        }
    }

    return (<PathSegment[]>node.$.d).map(segment => {
        switch(segment.type) {
            case 'Line':
                return convertLineSegment(segment)
            case 'QuadraticBezierCurve':
                return convertQuadraticBezierCurveSegment(segment)
            case 'CubicBezierCurve':
                return convertCubicBezierCurveSegment(segment)
            case 'EllipticalArcCurve':
                return convertEllipticalArcCurveSegment(segment)
        }
    })
}

function convertLineSegment(segment: LineSegment): Edge {
    return Edge(segment.startingPoint, segment.endPoint)
}

function convertQuadraticBezierCurveSegment(s: QuadraticBezierCurveSegment): Chain {
    const numberOfPoints = 7 // TODO as param
    // De-Casteljau-algorithm
    return Chain(Array(numberOfPoints).fill(0)
        .map((_, index) => index / (numberOfPoints - 1))
        .map(t => 
            Vec2.combine(
                1 - t, Vec2.combine(1 - t, s.startingPoint, t, s.controlPoint),
                t, Vec2.combine(1 - t, s.controlPoint, t, s.endPoint)
            )
        )
    )
}

function convertCubicBezierCurveSegment(s: CubicBezierCurveSegment): Chain {
    const numberOfPoints = 7 // TODO as param
    // De-Casteljau-algorithm
    return Chain(Array(numberOfPoints).fill(0)
        .map((_, index) => index / (numberOfPoints - 1))
        .map(t => 
            Vec2.combine(
                1 - t,
                Vec2.combine(
                    1 - t, Vec2.combine(1 - t, s.startingPoint, t, s.startControlPoint),
                    t, Vec2.combine(1 - t, s.startControlPoint, t, s.endControlPoint)
                ),
                t,
                Vec2.combine(
                    1 - t, Vec2.combine(1 - t, s.startControlPoint, t, s.endControlPoint),
                    t, Vec2.combine(1 - t, s.endControlPoint, t, s.endPoint)
                )
            )
        )
    )
}

function convertEllipticalArcCurveSegment(segment: EllipticalArcCurveSegment): Chain {
    // TODO
    return Chain([])
}