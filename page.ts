import * as planck from 'planck-js'
import { svg2planck, util, converters } from './dist'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

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

const iframe = document.getElementById('view')! as HTMLIFrameElement

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

document.getElementById('input')!.addEventListener('change', (e: any) => openSVG(e.target.files[0]))

function openSVG(file: File | undefined) {
  if(!file) {
    return
  }
  var reader = new FileReader();
  reader.onload = async function (event) {
    if(!event?.target?.result) {
      return
    }
    editor.setValue(<string>event.target.result)
    iframe.contentWindow!.postMessage(await buildWorld(<string>event.target.result), '*')
  }
  reader.readAsBinaryString(file)
}

async function buildWorld(svg: string) {

  const meterPerPixelRatio = parseFloat((<any>document.getElementById('scale')).value) || 0.1
  console.log(`scale: ${meterPerPixelRatio}`)
  const rootNode = await svg2planck(svg, {
    meterPerPixelRatio,
    scaleY: 1
  })
  const world = transformTree(rootNode, planck.World(), planck.Transform.identity());

  let viewBox = rootNode.$.viewBox.match(/[\+\-]?\d+(?:\.\d+)?/g)?.map(parseFloat)

  return {
    viewBox,
    meterPerPixelRatio,
    worldJson: (planck as any).Serializer.toJson(world)
  }
}