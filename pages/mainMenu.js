import { animations } from '../lib/animations.js'
import { kb } from '../lib/keyboard.js'
import { mouse } from '../lib/mouse.js'
import { randomInRange } from '../lib/util.js'
import { colisions } from '../lib/colisions.js'
import { renderer } from '../lib/renderer.js'
import { art } from '../art.js'
import { ui } from '../lib/ui.js'
import { gamepad } from '../lib/gamepad.js'

window.username = `player${randomInRange(0, 10_000)}`

export function initMainMenu() {
    window.username = localStorage.getItem('username')

    if (!window.username) {
        window.username = `player${randomInRange(0, 10_000)}`
        localStorage.setItem('username', window.username)
    }
}

export function mainMenu() {
    const pointer = mouse.info()
    const keyboard = kb.info()
    const pad = gamepad.info()

    const logo = art.textures.logo
    renderer.drawObject(logo.img, window.w / 2 - logo.w / 2, window.h / 3)

    const start = () => {
        window.page = 'game'
    }

    const changeName = () => {
        window.username = prompt("Please enter your name", window.username)

        localStorage.setItem('username', window.username)
    }

    if (pad?.buttons.cross || keyboard.new['Enter'] || keyboard.new[' ']) {
        start()
    }


    ui.button({
        content: 'Play',
        x: window.w / 2 - 3,
        y: window.h / 3 + 8,
        pointer: pointer,
        onClick: start
    })

    renderer.drawObject(window.username, 5, 5)

    ui.button({
        content: 'Change name',
        x: 5 + window.username.length + 2,
        y: 4,
        pointer: pointer,
        onClick: changeName
    })

    tick()
    mouse.showCursor()
}

function tick() {
    colisions.check()

    animations.move()
    animations.tick()
    animations.render()
}