# svg2planck

DISCLAIMER: The current API is not stable and my change in the future.

## About

This library utilizes [node-xml2js](https://www.npmjs.com/package/xml2js) to enable converting SVG files to [Planck.js](https://github.com/shakiba/planck.js) objects. It therefore provides functions to convert SVG shapes and transforms to corresponding Planck.js objects.

## Usage

The exported function `svg2planck` wraps the function `parseStringPromise` from xml2js. Its API is similar to the original function but fixes some options and applies value processors to replace transform values by Planck's transform objects.

Currently there is no exported function to convert a SVG to a Planck.js world directy. But one can use the following code to do so:

```typescript
import { svg2planck, Options, util, converters } from 'svg2planck'
import { World, Transform } from 'planck-js'

export async function simpleConverter(svg: string, options: Options) {
  const rootNode = await svg2planck(svg, options)
  return transformTree(rootNode, World(), Transform.identity())
}

function transformTree(node: any, world: World, transform: Transform) {
  if(util.isShape(node)) {
    world.createBody({
      position: transform.p,
      angle: transform.q.getAngle()
    }).createFixture(<any>converters.convertShape(node))
  } else {
    if(node.$.transform) {
      transform = Transform.mul(transform, <Transform>node.$.transform)
    }
    for(let child of node.$$) {
      transformTree(child, world, transform)
    }
  }
  return world
}
```

The function can then be used this way:

```javascript
simpleConverter(svg, {
  meterPerPixelRatio: 0.1
}).then(world => {
  // ...
})
```