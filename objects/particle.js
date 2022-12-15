import { renderer } from "../lib/renderer.js"

export class Particle {
    constructor(x, y, xVelocity, yVelocity) {
        this.name = 'particle'
        this.x = x
        this.y = y

        this.xVelocity = xVelocity
        this.yVelocity = yVelocity

        this.w = 1
        this.h = 1

        this.sprite = '-'

        this.deleter = () => { }
    }

    setDeleter(deleter) {
        this.deleter = deleter
    }

    tick() {
        this.x += this.xVelocity
        this.y += this.yVelocity


        if (this.x < 0) {
            this.deleter()
        }
    }

    draw() {
        renderer.drawObject(this.sprite, this.x, this.y)
    }
}