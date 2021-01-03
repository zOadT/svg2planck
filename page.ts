import * as planck from 'planck-js'
import { svg2planck, Options, util, converters } from './dist'

async function simpleConverter(svg: string, options: Options) {
  const rootNode = await svg2planck(svg, options)
  return transformTree(rootNode, planck.World(), planck.Transform.identity())
}

function transformTree(node: any, world: planck.World, transform: planck.Transform) {
  if(util.isShape(node)) {
    let body = world.createBody({
      position: transform.p,
      angle: transform.q.getAngle()
    })
    for(let shape of converters.convertShape(node)) {
      body.createFixture(<any>shape)
    }
  } else if(node.$$) {
    if(node.$?.transform) {
      transform = planck.Transform.mul(transform, <planck.Transform>node.$.transform)
    }
    for(let child of node.$$) {
      transformTree(child, world, transform)
    }
  }
  return world
}

// const el = document.getElementById('drop_zone')!
// el.addEventListener('dragover', dragOverHandler)
// el.addEventListener('drop', dropHandler)
document.getElementById('input')!.addEventListener('change', (e: any) => openSVG(e.target.files[0]))

function openSVG(file: File | undefined) {
  if(!file) {
    return
  }
  var reader = new FileReader();
  reader.onload = function (event) {
    if(!event?.target?.result) {
      return
    }
    buildWorld(<string>event.target.result)
  }
  reader.readAsBinaryString(file)
}

function dragOverHandler(ev: DragEvent) {
  ev.preventDefault()
}
function dropHandler(ev: DragEvent) {
  ev.preventDefault()
  openSVG(ev.dataTransfer?.files[0])
}

async function buildWorld(svg: string) {

  let world = await simpleConverter(svg, {
    meterPerPixelRatio: 0.02,
    scaleY: 1
  });
  
  // ok for a quick demo
  (<any>window).planck.testbed('svg2planck', (testbed: any) => {
    testbed.scaleY=1
    return world
  })
}