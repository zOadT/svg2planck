import { writable, derived, readable } from 'svelte/store'
import { World } from 'planck-js'
import * as planck from 'planck-js'
import Worker from 'worker-loader!./buildWorld'

export const svgContent = writable('<placeholder from store />')

export const scale = writable(0.1)

let worker = new Worker()

derived([svgContent, scale], ([$svgContent, $scale]) => ({
    svgContent: $svgContent,
    scale: $scale
})).subscribe(e => worker.postMessage(e))

export const world = readable(World(), set => {

    function updateValue({ data }) {
        if(data.error === null) {
            set({
                ...data.world,
                world: (<any>planck).Serializer.fromJson(data.world.world)
            })
        }
    }

    worker.addEventListener('message', updateValue)
    return () => {
        worker.removeEventListener('message', updateValue)
    }
})

export const error = readable(null, set => {

    function updateValue({ data }) {
        set(data.error)
    }

    worker.addEventListener('message', updateValue)
    return () => {
        worker.removeEventListener('message', updateValue)
    }
})
