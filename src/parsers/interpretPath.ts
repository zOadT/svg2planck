import { Vec2 } from 'planck-js'
import { Command } from './parsePath'

export type PathSegment = {
    type: 'Line',
    startingPoint: Vec2,
    endPoint: Vec2,
} | {
    type: 'CubicBezierCurve',
    startingPoint: Vec2,
    endPoint: Vec2,
    startControlPoint: Vec2,
    endControlPoint: Vec2,
} | {
    type: 'QuadraticBezierCurve',
    startingPoint: Vec2,
    endPoint: Vec2,
    controlPoint: Vec2,
} | {
    type: 'EllipticalArcCurve',
    startingPoint: Vec2,
    rx: number,
    ry: number,
    angle: number,
    largeArcFlag: 0 | 1,
    sweepFlag: 0 | 1,
    endPoint: Vec2,
}

export default function interpretPath(commands: Command[]): PathSegment[] {
    let result = [] as PathSegment[]
    
    let start = commands.shift()
    if(start?.letter !== 'M' && start?.letter !== 'm') {
        return []
    }

    let currentPoint = Vec2(start.parameters[0], start.parameters[1])
    let cubicStartControlPoint = currentPoint
    let quadraticControlPoint = currentPoint
    let initialPoint = currentPoint

    for(let command of commands) {
        let endPoint: Vec2
        let endControlPoint: Vec2
        switch(command.letter) {
            case 'M':
            case 'm':
                endPoint = Vec2(command.parameters[0], command.parameters[1])
                if(isLowerCase(command.letter)) {
                    endPoint.add(currentPoint)
                }
                currentPoint = endPoint
                cubicStartControlPoint = endPoint
                quadraticControlPoint = endPoint
                initialPoint = endPoint
                break

            case 'L':
            case 'l':
            case 'H':
            case 'h':
            case 'V':
            case 'v':
                endPoint = getAbsoluteLineEndPoint(command, currentPoint)
                result.push({
                    type: 'Line',
                    startingPoint: Vec2.clone(currentPoint),
                    endPoint
                })
                currentPoint = endPoint
                cubicStartControlPoint = endPoint
                quadraticControlPoint = endPoint
                break

            case 'C':
            case 'c':
                cubicStartControlPoint = Vec2(command.parameters[0], command.parameters[1])
                if(isLowerCase(command.letter)) {
                    cubicStartControlPoint.add(currentPoint)
                }
                command.parameters = command.parameters.slice(2)
                /* FALLTHROUGH */
            case 'S':
            case 's':
                endControlPoint = Vec2(command.parameters[0], command.parameters[1])
                endPoint = Vec2(command.parameters[2], command.parameters[3])
                if(isLowerCase(command.letter)) {
                    endControlPoint.add(currentPoint)
                    endPoint.add(currentPoint)
                }
                result.push({
                    type: 'CubicBezierCurve',
                    startingPoint: currentPoint,
                    startControlPoint: cubicStartControlPoint,
                    endControlPoint,
                    endPoint,
                })
                currentPoint = endPoint
                // reflection of cubicStartControlPoint as endPoint
                cubicStartControlPoint = Vec2.combine(2, endPoint, -1, cubicStartControlPoint)
                quadraticControlPoint = endPoint
                break

            case 'Q':
            case 'q':
                quadraticControlPoint = Vec2(command.parameters[0], command.parameters[1])
                if(isLowerCase(command.letter)) {
                    quadraticControlPoint.add(currentPoint)
                }
                command.parameters = command.parameters.slice(2)
                /* FALLTHROUGH */
            case 'T':
            case 't':
                endPoint = Vec2(command.parameters[0], command.parameters[1])
                if(isLowerCase(command.letter)) {
                    endPoint.add(currentPoint)
                }
                result.push({
                    type: 'QuadraticBezierCurve',
                    startingPoint: currentPoint,
                    controlPoint: quadraticControlPoint,
                    endPoint
                })
                currentPoint = endPoint
                cubicStartControlPoint = endPoint
                quadraticControlPoint = Vec2.combine(2, endPoint, -1, quadraticControlPoint)
                break

            case 'A':
            case 'a':
                endPoint = Vec2(command.parameters[5], command.parameters[6])
                if(isLowerCase(command.letter)) {
                    endPoint.add(currentPoint)
                }
                result.push({
                    type: 'EllipticalArcCurve',
                    startingPoint: currentPoint,
                    rx: command.parameters[0],
                    ry: command.parameters[1],
                    angle: command.parameters[2],
                    largeArcFlag: <0 | 1>command.parameters[3], // TODO check
                    sweepFlag: <0 | 1>command.parameters[4], // TODO check
                    endPoint,
                })
                currentPoint = endPoint
                cubicStartControlPoint = endPoint
                quadraticControlPoint = endPoint
                break

            case 'Z':
            case 'z':
                result.push({
                    type: 'Line',
                    startingPoint: Vec2.clone(currentPoint),
                    endPoint: initialPoint
                })
                currentPoint = initialPoint
                cubicStartControlPoint = initialPoint
                quadraticControlPoint = initialPoint
                break
        }
    }

    return result
}

function isLowerCase(letter: String) {
    return letter === letter.toLowerCase()
}

function getAbsoluteLineEndPoint(command: Command, currentPoint: Vec2): Vec2 {
    let point: Vec2
    switch(command.letter) {
        case 'L':
        case 'l':
            point = Vec2(command.parameters[0], command.parameters[0])
            break
        case 'H':
            point = Vec2(command.parameters[0], currentPoint.y)
            break
        case 'h':
            point = Vec2(command.parameters[0], 0)
            break
        case 'V':
            point = Vec2(currentPoint.x, command.parameters[0])
            break
        case 'v': 
            point = Vec2(0, command.parameters[0])
            break
    }
    if(isLowerCase(command.letter)) {
        point!.add(currentPoint)
    }
    return point!
}