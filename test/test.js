const { getAngle } = require('../dist/util')
const { parseNumberList, parseTransform } = require('../dist/parsers')
const { parsePoints, parseTransforms, squashTransforms } = require('../dist/processors')
const { Transform, Vec2 } = require('planck-js')

const chai = require('chai');
const chaiAlmost = require('chai-almost');

chai.use(chaiAlmost(1e-4));
chai.should()

describe('util', () => {
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
            parseTransform('translate(35 74)').should.deep.be.equal([Transform(Vec2(35, 74), 0)])
        })
        it('second argument of translate should be optional', () => {
            parseTransform('translate(22.5)').should.deep.be.equal([Transform(Vec2(22.5, 0), 0)])
        })
        it('should parse rotations', () => {
            parseTransform('rotate(-130)').should.deep.be.almost([Transform(Vec2(), -130 * Math.PI / 180)])
        })
        it('should parse rotations with offset', () => {
            parseTransform('rotate(30, 100, 50)').should.deep.be.almost([Transform(Vec2(38.3974, -43.3012), Math.PI / 6)])
        })
        it('should parse matrices', () => {
            parseTransform('matrix(-0.64279 -0.76604 0.76604 -0.64279 40 20)').should.deep.be.almost([Transform(Vec2(40, 20), -130 * Math.PI / 180)])
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
