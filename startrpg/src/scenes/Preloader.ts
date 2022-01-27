import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {

    constructor() {
        super('preloader')
    }

    preload()
    {
        this.load.image('tiles', 'test.png')
        this.load.tilemapTiledJSON('dungeon', 'dungeon.json')
        
    }

    create()
    {
        this.scene.run('hello-world')
    }

}