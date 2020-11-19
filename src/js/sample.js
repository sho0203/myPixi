import * as PIXI from 'pixi.js'
import Main from './main'
import Vector2 from './utils/vector2'
import AnimationDot from './utils/animationDot'
import Color from './utils/color'

export default class Sapmple extends Main {

    constructor() {
        super()

        this.texture = new PIXI.Texture.from('./assets/img/polygon.png')
        this.sprite = new PIXI.Sprite(this.texture)
        this.sprite.width = this.sprite.height = 100
        this.sprite.anchor.set(0.5)
        this.sprite.tint = 0xff0000
        this.addChild(this.sprite)

        //grid間隔
        this.grid_space_x = 30
        this.grid_space_y = 30
        this.grid_size = 15

        this.grids = []
        this.grids_position = []

        this.mouseOffset = new Vector2(0, 0)

        this.count = 0
    }

    onSetup() {
        window.addEventListener('click', function () {
            for (let i in this.grids) {
                let dist = Math.sqrt(Math.pow(this.grids[i].x - this.sw / 2, 2) + Math.pow(this.grids[i].y - this.sh / 2, 2))
                // let dist = Math.sqrt(Math.pow(this.mousePosition.x - this.grids[i].x / 2, 2) + Math.pow(this.mousePosition.y - this.grids[i].y / 2, 2))
                let delay = dist / 1000
                let duration = 1
                this.grids[i].goHome(duration, delay)
            }
        }.bind(this))
    }

    onUpdate() {
        this.sprite.position = this.mousePosition
        for (let i in this.grids) {
            this.grids[i].onUpdate()
            if (this.grids[i].isGoHome) {
                this.count++
                this.grids[i].isGoHome = false
            }
        }
        if (this.count == this.grids.length) {
            this.count = 0
            for (let i in this.grids) this.grids[i].slide()
        }
    }

    onResize() {
        if (this.grids.length > 0) {
            for (let i in this.grids) {
                this.removeChild(this.grids[i])
            }
            this.grids = []
            this.grids_position = []
        }

        const texture = new PIXI.Texture.from('./assets/img/polygon.png')
        //grid個数
        const grid_num_x = this.sw / this.grid_space_x
        const grid_num_y = this.sh / this.grid_space_y
        //少し画面外にはみ出すように並べる
        for (let i = -2; i < grid_num_x + 2; i++) {
            for (let j = -2; j < grid_num_y + 2; j++) {
                const x = i * this.grid_space_x
                const y = j * this.grid_space_y

                let position = new Vector2(x, y)
                let size = this.grid_size
                let tint = Color.clearBlue
                const grid = new AnimationDot(texture, position, size, tint)
                this.addChild(grid)
                this.grids.push(grid)
                grid.onSetup()
            }
        }
    }

}