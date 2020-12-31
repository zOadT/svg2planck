const { getAngle } = require('../dist/util')
const { mat33ToTransform } = require('../dist/mat33')
const { parseNumberList, parseTransform } = require('../dist/parsers')
const { parsePoints, parseTransforms, squashTransforms } = require('../dist/processors')
const { convertCircle, convertRect } = require('../dist/converters')
const { Transform, Vec2, Vec3, Mat33, Circle, Box } = require('planck-js')

const chai = require('chai');
const chaiAlmost = require('chai-almost');

chai.use(chaiAlmost(1e-4));
const should = chai.should()

describe('util', () => {
    describe('mat33ToTransform', () => {
        it('should convert valid transforms', () => {
            const A = new Mat33(
                Vec3(-0.64279, -0.76604, 0),
                Vec3(0.76604, -0.64279, 0),
                Vec3(40, 20, 0)
            )
            let result = mat33ToTransform(A)
            result.transform.should.deep.be.almost(Transform(Vec2(40, 20), -130 * Math.PI / 180))
            should.not.exist(result.overhang)
        })
    })
    describe('getAngle', () => {
        it('should map whole circle', () => {
            const angles = Array(36).fill(0).map((_, i) => 10 * i).map(deg => deg * Math.PI / 180)
            const result = angles.map(angle => getAngle(Math.acos(Math.cos(angle)), Math.asin(Math.sin(angle))))
            result.should.deep.be.almost(angles)
        })
    })
})

describe('parsers', () => {
    describe('parseNumberList', () => {
        it('should split at \'-\' sign', () => {
            parseNumberList('36-7').should.deep.be.equal([36, -7])
        })
    })

    describe('parseTransform', () => {
        it('should parse translations', () => {
            mat33ToTransform(parseTransform('translate(35 74)')[0]).transform.should.deep.be.equal(Transform(Vec2(35, 74), 0))
        })
        it('second argument of translate should be optional', () => {
            mat33ToTransform(parseTransform('translate(22.5)')[0]).transform.should.deep.be.equal(Transform(Vec2(22.5, 0), 0))
        })
        it('should parse rotations', () => {
            mat33ToTransform(parseTransform('rotate(-130)')[0]).transform.should.deep.be.almost(Transform(Vec2(), -130 * Math.PI / 180))
        })
        it('should parse rotations with offset', () => {
            mat33ToTransform(parseTransform('rotate(30, 100, 50)')[0]).transform.should.deep.be.almost(Transform(Vec2(38.3974, -43.3012), Math.PI / 6))
        })
        it('should parse matrices', () => {
            mat33ToTransform(parseTransform('matrix(-0.64279 -0.76604 0.76604 -0.64279 40 20)')[0]).transform.should.deep.be.almost(Transform(Vec2(40, 20), -130 * Math.PI / 180))
        })
    })
})

describe('processors', () => {
    describe('parsePoints', () => {
        it('should ignore unpaired values', () => {
            parsePoints('35,64 3.7,477,23', 'points').should.have.lengthOf(2);
        })
    })
    describe('squashTransforms', () => {
        it('should multiply transforms in right order', () => {
            let a = squashTransforms(parseTransforms('translate(100, 100)rotate(-130)', 'transform'), 'transform')
            let b = squashTransforms(parseTransforms('matrix(-0.64279 -0.76604 0.76604 -0.64279 100 100)', 'transform'), 'transform')
            a.should.deep.be.almost(b)
        })
    })
})

describe('converters', () => {
    describe('parseCircle', () => {
        it('should apply transformations in right order', () => {
            convertCircle({
                $: {
                    cx: 50,
                    cy: 70,
                    r: 50,
                    transform: Transform(Vec2(38.3974, -43.3012), Math.PI / 6)
                },
            }, Transform(Vec2(40, 20), -130 * Math.PI / 180)).should.deep.be.almost(Circle(Vec2(42.402117222946615, -42.97640014295341), 50))
        })
    })
    describe('parseRect', () => {
        it('should apply correct rotation', () => {
            convertRect({
                $: {
                    x: 10,
                    y: -20,
                    width: 50,
                    height: 40,
                    transform: Transform(Vec2(38.3974, -43.3012), Math.PI / 6)
                },
            }, Transform(Vec2(40, 20), -130 * Math.PI / 180)).should.deep.be.almost(Box(50, 40, Vec2(-23.929702822903984, -16.04891141108515), 260 * Math.PI / 180))
        })
    })
    // TODO
})