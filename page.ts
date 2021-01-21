import * as planck from 'planck-js'
import { svg2planck, Options, util, converters } from './dist'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

const editorContainer = document.getElementById('editor')!
const editor = monaco.editor.create(editorContainer, {
  value: '<placeholder />',
  language: 'xml',
  theme: 'vs-dark',
})
window.addEventListener('resize', function updateLayout() {
	editor.layout({
		width: editorContainer.clientWidth,
		height: editorContainer.clientHeight,
	})
})

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
    editor.setValue(<string>event.target.result)
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

  const meterPerPixelRatio = parseFloat((<any>document.getElementById('scale')).value) || 0.1
  console.log(`scale: ${meterPerPixelRatio}`)
  const rootNode = await svg2planck(svg, {
    meterPerPixelRatio,
    scaleY: 1
  })
  const world = transformTree(rootNode, planck.World(), planck.Transform.identity());

  const viewBox = rootNode.$.viewBox.match(/[\+\-]?\d+(?:\.\d+)?/g)?.map(parseFloat)
  
  // ok for a quick demo
  ;(<any>window).planck.testbed('svg2planck', (testbed: any) => {
    testbed.scaleY=1

    if(viewBox && viewBox.length === 4) {
      testbed.x = (viewBox[0] + viewBox[2] / 2) * meterPerPixelRatio
      testbed.y = (viewBox[1] + viewBox[3] / 2) * meterPerPixelRatio
      testbed.width = viewBox[2] * meterPerPixelRatio
      testbed.heidth = viewBox[3] * meterPerPixelRatio
    }
    return world
  })
}