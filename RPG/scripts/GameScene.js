class GameScene extends Phaser.Scene {
    constructor() {
        super('gameScene')
    }

    //class GameScene extends Phaser.Scene {


    preload() {
        this.cursors
        // this.cameras.main.setBackgroundColor('0x9900e3')
        // verchillende tiles loaden
        this.load.image('tiles', '../assets/Tilemap/dungeon.png')
        //map dat we in Tiled hebben gemaakt loaden
        this.load.tilemapTiledJSON('map', '../scripts/dungeonMap.json')
        //characters loaden
        this.load.spritesheet('characters', '../assets/characters.png', {
            frameWidth: 16,
            frameHieght: 16
        })
        // we gebruiken atlas omdat we zowel de .png als de .json file loaden
        this.load.atlas('skeleton', 'assets/skeleton.png', 'assets/skeleton.json')
        this.load.atlas('ghost', 'assets/ghost.png', 'assets/ghost.json')

        this.player
        this.keys
        this.enemy
        this.enemies

    } //end preload

    create() {

        //map object aanmaken met key 'map'
        const map = this.make.tilemap({
            key: 'map'
        })

        //verschillende layers aanmaken met gepaste key 
        const tileset = map.addTilesetImage('dungeon', 'tiles')
        const belowLayer = map.createStaticLayer('below player', tileset, 0, 0)
        const worldLayer = map.createStaticLayer('world', tileset, 0, 0)
        const aboveLayer = map.createStaticLayer('above player', tileset, 0, 0)
        // zorgt ervoor dat de player niet meer zichtbaar is op de abovelayer (z-index)
        aboveLayer.setDepth(100)
        // collision inschakelen voor onze wereld 
        worldLayer.setCollisionByProperty({
            collides: true
        })
        // ??????????????????????????
        this.physics.world.bounds.width = map.widthInPixels
        this.physics.world.bounds.height = map.heightInPixels
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)


        /**
         * This is if you want to see the collission layer (world)
         */
        // const debugGraphics = this.add.graphics().setAlpha(0.2)
        // worldLayer.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(0, 0, 255),
        //     faceColor: new Phaser.Display.Color(0, 255, 0, 255)
        // })

        /**
         * Player
         */
        // player instantieëren
        this.player = new Player(this, 40, 35, 'characters')
        // collision tussen player en wereld inschakelen
        this.player.body.setCollideWorldBounds(true)
        this.physics.add.collider(this.player, worldLayer)
        // focus op player bij beweging
        this.cameras.main.startFollow(this.player, true, 0.8, 0.8)

        /**
         * Enemy
         */
        //Om een enemy te kiezen gebruik het commando hieronder, kies de x, y positie en de atlas die je wilt
        this.enemy = new Enemy(this, 250, 242, 'skeleton')
        this.physics.add.collider(this.enemy, worldLayer)
        this.enemy.body.setCollideWorldBounds(true)

        /** 
         * Group of ennemys
         */
        this.enemies = this.add.group()
        for (let i = 0; i < 8; i++) {
            const element = new Enemy(this, 220 + 20 * i, 250, 'skeleton')
            element.body.setCollideWorldBounds(true)
            this.enemies.add(element)
        }
        this.physics.add.collider(this.enemies, worldLayer)

        /**
         * collisions
         */
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this)
        this.physics.add.overlap(this.player, this.enemy, this.handlePlayerEnemyCollision, null, this)

    } //end create
    //Collision player enemy
    handlePlayerEnemyCollision(p, e){
        this.cameras.main.shake(40, 0.02)
        p.setTint(0xff0000)//red
        this.time.addEvent({
            delay: 500,
            callback: ()=>{
                p.clearTint()// get rid of red tint
            }, 
            callbackScope: this,
            loop: false
        })
        e.explode()
    }

    update(time, delta) {
        this.player.update()

        if(!this.enemy.isDead){
            this.enemy.update()
        }
        this.enemies.children.iterate((child) => {
            if(!child.isDead){
                child.update()
            }
        })
    } //end update


}; //end gameScene