import { renderer } from "../lib/renderer.js"
import { cropImg, randomInRange, randomInRangeFloat } from "../lib/util.js"
import { art } from "../art.js"
import { animations } from "../lib/animations.js"
import { colisions } from "../lib/colisions.js"

export class Asteroid {
    constructor(x, y, xVelocity, yVelocity) {
        this.name = 'asteroid'
        this.x = x
        this.y = y

        this.maxHp = 3
        this.hp = this.maxHp
        this.dead = false

        this.asteroidHitCooldown = 10
        this.bulletHitCooldown = 10

        const randomAsteroid = randomInRange(0, art.textures.asteroids.length - 1)
        this.sprite = art.textures.asteroids[randomAsteroid]

        this.w = this.sprite.w
        this.h = this.sprite.h
        this.m = this.sprite.m
        // this.m = 3

        this.xVelocity = xVelocity
        this.yVelocity = yVelocity

        this.deleter = () => { }
    }

    setDeleter(deleter) {
        this.deleter = () => {

            for (let i = 0; i < 10; i += 1) {
                animations.animate(art.animations.particle, this.x + randomInRange(0, this.w), this.y + randomInRange(0, this.h), this.xVelocity, this.yVelocity, {
                    tickSpeed: 10,
                    moveSpeed: 1,
                })
            }

            for (let i = 0; i < 15; i += 1) {
                animations.animate(art.animations.particle,
                    this.x + randomInRange(0, this.w),
                    this.y + randomInRange(0, this.h),
                    randomInRangeFloat(-0.6, 0.6) + this.xVelocity,
                    randomInRangeFloat(-0.6, 0.6) + this.yVelocity,
                    {
                        moveSpeed: 10,
                        tickSpeed: 30
                    }
                )
            }

            deleter()
        }
    }

    hitAnimation() {
        animations.animate(art.animations.particle,
            this.x + randomInRange(0, this.w),
            this.y + randomInRange(0, this.h),
            randomInRangeFloat(-0.6, 0.6) + this.xVelocity,
            randomInRangeFloat(-0.6, 0.6) + this.yVelocity,
            {
                moveSpeed: 10,
                tickSpeed: 30
            }
        )
    }

    tick() {
        if (this.asteroidHitCooldown > 0) {
            this.asteroidHitCooldown -= 1
        }
        if (this.bulletHitCooldown > 0) {
            this.bulletHitCooldown -= 1
        }

        this.x += this.xVelocity
        this.y += this.yVelocity

        if (this.x < -this.w - 10 || this.x > window.w + 20 || this.dead) {
            this.deleter()
        }

        const onColision = (object) => {
            if (!this.asteroidHitCooldown) {
                this.asteroidHitCooldown = 100

                if (object.name === 'player') {
                    this.hp -= 1
                    this.hitAnimation()
                    this.xVelocity *= -0.4
                }

                if (object.name === 'asteroid') {
                    this.hp -= 1

                    let signX = 1
                    let signY = 1
                    // if opposite directions
                    if (this.xVelocity > 0 && object.xVelocity < 0 || this.xVelocity < 0 && object.xVelocity > 0) {
                        signX = -1
                    }
                    if (this.yVelocity > 0 && object.yVelocity < 0 || this.yVelocity < 0 && object.yVelocity > 0) {
                        signY = -1
                    }

                    this.xVelocity = signX * (this.m * this.xVelocity + object.m * object.xVelocity) / (2 * (this.m + object.m))
                    this.yVelocity = signY * (this.m * this.yVelocity + object.m * object.yVelocity) / (2 * (this.m + object.m))

                    this.hitAnimation()
                }

                const objectCentre = object.y + object.h / 2
                const thisCentre = this.y + this.h / 2
                let yDistortion = objectCentre < thisCentre ? 0.02 : -0.02

                if (Math.abs(objectCentre - thisCentre) < 1.5) {
                    yDistortion = 0
                }

                this.yVelocity += yDistortion
            }

            if (object.name == 'bullet' && !this.bulletHitCooldown) {
                this.hitAnimation()
                this.xVelocity += object.xVelocity * 0.2
                this.hp -= 1
                this.bulletHitCooldown = 10
            }
        }

        if (this.hp <= 0 && !this.dead) {
            this.dead = true
        }

        colisions.addRectangleColision(this, onColision)
    }

    draw() {
        const hp = ['- - -', '# - -', '# # -', '# # #']

        if (this.hp !== this.maxHp) {
            renderer.drawObject(hp[Math.floor(this.hp)], this.x, this.y + this.h)
        }

        renderer.drawTransparentObject(this.sprite, this.x, this.y)
    }
}