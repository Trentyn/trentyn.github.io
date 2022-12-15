import { animations } from '../lib/animations.js'
import { kb } from '../lib/keyboard.js'
import { mouse } from '../lib/mouse.js'
import { randomInRange } from '../lib/util.js'
import { Block } from '../objects/block.js'
import { colisions } from '../lib/colisions.js'
import { renderer } from '../lib/renderer.js'
import { art } from '../art.js'
import { ui } from '../lib/ui.js'
import { gamepad } from '../lib/gamepad.js'
import { getBestScores, getScores, submitScore } from '../firebase/scoreboard.js'

let id = 0

export async function initScores() {

}

export function scores() {
    const pointer = mouse.info()
    const keyboard = kb.info()
    const pad = gamepad.info()

    if (keyboard.new['d']) {
        id += 1
    }
    if (keyboard.new['a']) {
        id -= 1
    }

    renderer.drawObject(art.textures.planets[id].img, 10, 10)

    tick()
    mouse.showCursor()
}

function tick() {
    colisions.check()

    animations.move()
    animations.tick()
    animations.render()
}