import { art } from "../art.js"
import { renderer } from "../lib/renderer.js"
import { randomInRange, randomInRangeFloat } from "../lib/util.js"

export class Planet {
    constructor(x, y) {
        this.name = 'planet'
        this.x = x

        this.xVelocity = randomInRangeFloat(-0.09, -0.03)
        this.yVelocity = 0

        const max = art.textures.planets.length - 1

        let sprite = art.textures.planets[randomInRange(0, max)]

        this.sprite = sprite
        this.w = sprite.w
        this.h = sprite.h

        if (y !== 'auto')
            this.y = y
        else
            this.y = randomInRange(5, window.h - this.h - 20)
    }

    setDeleter(deleter) {
        this.deleter = () => {
            deleter()
        }
    }

    tick() {
        this.x += this.xVelocity

        if (this.x < -this.w) {
            this.deleter()
        }
    }

    draw() {
        renderer.drawTransparentObject(this.sprite, this.x, this.y)
    }
}