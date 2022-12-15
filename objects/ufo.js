import { art } from "../art.js"
import { animations } from "../lib/animations.js"
import { colisions } from "../lib/colisions.js"
import { renderer } from "../lib/renderer.js"
import { randomInRange, randomInRangeFloat } from "../lib/util.js"

export class Ufo {
    constructor(x, y) {
        this.name = 'ufo'
        this.x = x
        this.y = y
        this.w = art.textures.ufo.w
        this.h = art.textures.ufo.h

        this.xVelocity = 0
        this.yVelocity = 0

        this.xAcceleration = 0.0025
        this.yAcceleration = 0.001

        this.invincibility = 400
        this.hp = 5

        this.asteroidHitCooldown = 0
        this.bulletHitCooldown = 0

        this.sprite = art.textures.ufo

        this.bullets = []
        this.shootCooldown = 0

        this.loss = 0.97
    }

    setDeleter(deleter) {
        this.deleter = () => {
            for (let i = 0; i < 10; i += 1) {
                animations.animate(art.animations.particle,
                    this.x + randomInRange(0, this.w),
                    this.y + randomInRange(0, this.h),
                    randomInRangeFloat(-1, 1) + this.xVelocity,
                    randomInRangeFloat(-1, 1) + this.yVelocity,
                    {
                        moveSpeed: 10,
                        tickSpeed: 30
                    }
                )
            }

            deleter()
        }
    }

    tick(player) {
        if (this.asteroidHitCooldown > 0) {
            this.asteroidHitCooldown -= 1
        }
        if (this.bulletHitCooldown > 0) {
            this.bulletHitCooldown -= 1
        }

        if (this.y < player.y) {
            this.yVelocity += this.yAcceleration
        }
        if (this.y > player.y) {
            this.yVelocity -= this.yAcceleration
        }

        if (this.x > player.x + window.w / 3 && this.x >= window.w / 3) {
            this.xVelocity -= this.xAcceleration
        }
        if (this.x < player.x + window.w / 3) {
            this.xVelocity += this.xAcceleration
        }

        this.x += this.xVelocity
        this.y += this.yVelocity

        this.xVelocity *= this.loss
        this.yVelocity *= this.loss

        if (this.hp <= 0) {
            this.deleter()
        }

        colisions.addRectangleColision(this, (object) => {
            if (!this.asteroidHitCooldown && !this.bulletHitCooldown)
                for (let i = 0; i < 10; i += 1) {
                    animations.animate(art.animations.particle,
                        this.x + randomInRange(0, this.w),
                        this.y + randomInRange(0, this.h),
                        randomInRangeFloat(-1, 1) + this.xVelocity,
                        randomInRangeFloat(-1, 1) + this.yVelocity,
                        {
                            moveSpeed: 10,
                            tickSpeed: 30
                        }
                    )
                }

            if (object.name === 'asteroid') {
                if (!this.asteroidHitCooldown) {
                    this.hp -= 1
                }

                this.yVelocity = -object.yVelocity
                this.asteroidHitCooldown = 10
            }
            if (object.name === 'bullet') {
                if (!this.bulletHitCooldown) {
                    this.hp -= 1
                }

                this.bulletHitCooldown = 10
            }
        })

        this.shoot()
        this.handleBullets()
    }

    shoot() {
        if (this.shootCooldown > 0) {
            this.shootCooldown -= 1
        }
        if (!this.shootCooldown) {
            this.shootCooldown = 500

            this.bullets.push({
                x: this.x - 1,
                y: this.y + this.h / 2,
                xVelocity: -0.5,
                yVelocity: this.yVelocity * 0.5
            })
        }
    }

    handleBullets() {
        this.bullets.map((bullet, i) => {
            renderer.drawObject('=', bullet.x, bullet.y)

            animations.animate(art.animations.smallParticle, bullet.x, bullet.y, bullet.xVelocity * 0.5 * 0, bullet.yVelocity + randomInRange(-0.1, 0.1), {
                tickSpeed: randomInRange(2, 3),
                moveSpeed: randomInRange(11, 21),
            })

            bullet.x += bullet.xVelocity
            bullet.y += bullet.yVelocity

            if (bullet.x > window.w + 10 || bullet.x < -10)
                this.bullets.splice(i, 1)

            colisions.addRectangleColision({ w: 1, h: 1, x: bullet.x, y: bullet.y, xVelocity: bullet.xVelocity, yVelocity: bullet.yVelocity, name: 'bullet' }, (object) => {
                if (object.name === 'bullet')
                    return

                animations.animate(art.animations.particle, bullet.x, bullet.y, bullet.xVelocity, bullet.yVelocity, {
                    tickSpeed: 20,
                    moveSpeed: 20
                })

                this.bullets.splice(i, 1)
            })
        })
    }

    draw() {
        const hp = ['-----', '#----', '##---', '###--', '####-', '#####']

        renderer.drawTransparentObject(this.sprite, this.x, this.y)
        renderer.drawObject(hp[this.hp], this.x + this.w / 2 - 3, this.y + this.h)
    }
}