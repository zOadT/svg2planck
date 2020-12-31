import { Mat33 } from 'planck-js'
import { mat33mul, mat33ToTransform, applyMat33ToShape } from '.'
import { isShape } from '../util'

export default function wringOutMat33(node: any, overhang: Mat33 | null) {
  if(isShape(node)) {
    applyMat33ToShape(node, overhang)
  } else {
    if(node.$?.transform) {
        let transform = <Mat33>node.$.transform
        if(overhang) {
            transform = mat33mul(overhang, transform)
        }
        const res = mat33ToTransform(transform)
        node.$.transform = res.transform
        overhang = res.overhang
    }
    
    for(let child of node.$$) {
      wringOutMat33(child, overhang)
    }
  }
}