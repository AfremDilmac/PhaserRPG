class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene')
    }

    preload() {
        this.cursors
        // this.cameras.main.setBackgroundColor('0x9900e3')
        this.load.image('tiles', '../assets/Tilemap/dungeon.png')
        this.load.tilemapTiledJSON('map', '../scripts/dungeonMap.json')

        this.load.spritesheet('characters', '../assets/characters.png', {
            frameWidth: 16,
            frameHieght: 16
        })

        this.player
        this.keys

    } //end preload

    create() {
        // this.cursors = this.input.keyboard.createCursorKeys()
        const {LEFT,RIGHT,UP,DOWN,W,A,S,D} = Phaser.Input.Keyboard.KeyCodes
        this.keys = this.input.keyboard.addKeys({
            left: LEFT,
            right: RIGHT,
            up: UP,
            down: DOWN,
            w: W,
            a: A,
            s: S,
            d: D
        })
       const map = this.make.tilemap({
            key: 'map'
        })

        const tileset = map.addTilesetImage('dungeon', 'tiles')
        const belowLayer = map.createStaticLayer('below player', tileset, 0, 0)
        const worldLayer = map.createStaticLayer('world', tileset, 0, 0)
        const aboveLayer = map.createStaticLayer('above player', tileset, 0, 0)

        aboveLayer.setDepth(100)

        worldLayer.setCollisionByProperty({
            collides: true
        })

        this.physics.world.bounds.width = map.widthInPixels
        this.physics.world.bounds.height = map.heightInPixels
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        const debugGraphics = this.add.graphics().setAlpha(0.2)
        /**
         * This is if you want to see the collission layer (world)
         */
        // worldLayer.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(0, 0, 255),
        //     faceColor: new Phaser.Display.Color(0, 255, 0, 255)
        // })

        /**
         * Player
         */
        this.player = this.physics.add.sprite(200,120, 'characters')
        this.physics.add.collider(this.player, worldLayer)
        this.cameras.main.startFollow(this.player, true, 0.8, 0.8)
        this.player.body.setCollideWorldBounds(true)

        const animFrameRate = 8
        this.anims.create({
            key: 'player-left',
            frames: this.anims.generateFrameNumbers('characters', {
                // start: 3,
                // end: 5
                start: 15,
                end: 17
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        this.anims.create({
            key: 'player-right',
            frames: this.anims.generateFrameNumbers('characters', {
                // start: 6,
                // end: 8
                start: 27,
                end: 29
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        this.anims.create({
            key: 'player-up',
            frames: this.anims.generateFrameNumbers('characters', {
                // start: 9,
                // end: 11
                start: 39,
                end: 41
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        this.anims.create({
            key: 'player-down',
            frames: this.anims.generateFrameNumbers('characters', {
                // start: 0,
                // end: 2
                start: 3,
                end: 5
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        this.idleFrame = {
            down: 4,
            left: 16,
            right: 28,
            up: 40
        }
        this.player.setFrame(this.idleFrame.down)
    } //end create

 
    update(time, delta) {
        const {keys} = this //output: this.keys
        const speed = 100
        const previousVelocity = this.player.body.velocity.clone()

        this.player.body.setVelocity(0)
        //movement
        if (keys.left.isDown || keys.a.isDown) {
            this.player.body.setVelocityX(-speed)
        } else if (keys.right.isDown || keys.d.isDown) {
            this.player.body.setVelocityX(speed)
        }

        if (keys.up.isDown || keys.w.isDown) {
            this.player.body.setVelocityY(-speed)
        } else if (keys.down.isDown || keys.s.isDown) {
            this.player.body.setVelocityY(speed)
        }

        this.player.body.velocity.normalize().scale(speed)

        //animations
        if (keys.up.isDown || keys.w.isDown) {
            this.player.anims.play('player-up', true)
        } else if (keys.down.isDown || keys.s.isDown) {
            this.player.anims.play('player-down', true)
        } else
        if (keys.left.isDown || keys.a.isDown) {
            this.player.anims.play('player-left', true)
        } else if (keys.right.isDown || keys.d.isDown) {
            this.player.anims.play('player-right', true)
        } else {
            this.player.anims.stop()
        }
 

        //set idle animations
        if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
            //show idle anims
            if (previousVelocity.x < 0) {
                this.player.setFrame(this.idleFrame.left)
            } else if (previousVelocity.x > 0) {
                this.player.setFrame(this.idleFrame.right)
            } else if (previousVelocity.y < 0) {
                this.player.setFrame(this.idleFrame.up)
            } else if (previousVelocity.y > 0) {
                this.player.setFrame(this.idleFrame.down)
            }
        }


    } //end update


} //end gameScene