import { writable, derived } from 'svelte/store'
import { World } from 'planck-js'
import buildWorld from './buildWorld'

export const svgContent = writable('<placeholder from store />')

export const scale = writable(0.1)

const intermediate = derived([svgContent, scale], ([$svgContent, $scale], set) => {
    buildWorld($svgContent, $scale).then(world => {
        set({
            world,
            error: null,
        })
    }).catch(error => {
        set({
            world: null,
            error
        })
    })
}, {
    world: {
        viewBox: [],
        meterPerPixelRatio: 0.1,
        world: World(),
    },
    error: null
})

export const world = derived(intermediate, ($intermediate, set) => {
    if($intermediate.error === null) {
        set($intermediate.world)
    }
}, {
    viewBox: [],
    meterPerPixelRatio: 0.1,
    world: World(),
})

export const error = derived(intermediate, $intermediate => $intermediate.error)
