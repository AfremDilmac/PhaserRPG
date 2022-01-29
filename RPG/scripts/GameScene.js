class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene')
    }

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

        this.player
        this.keys

    } //end preload

    create() {
        // this.cursors = this.input.keyboard.createCursorKeys()
		//controls definieëren
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
		//const debugGraphics = this.add.graphics().setAlpha(0.2)
        // worldLayer.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(0, 0, 255),
        //     faceColor: new Phaser.Display.Color(0, 255, 0, 255)
        // })

        /**
         * Player
         */
		// player instantieëren
        this.player = this.physics.add.sprite(200,120, 'characters')
		// collision tussen player en wereld inschakelen
		this.player.body.setCollideWorldBounds(true)
        this.physics.add.collider(this.player, worldLayer)
		// focus op player bij beweging
        this.cameras.main.startFollow(this.player, true, 0.8, 0.8)
        

        const animFrameRate = 8
		// hier gebeurt de animatie van onze character aan de hand van frames
		//player-left = frames nr 15 t.e.m 17 zie characters.png
		//player-right = frames nr 27 t.e.m 29 zie characters.png
		//player-up = frames nr 39 t.e.m 41 zie characters.png
		//player-down = frames nr 3 t.e.m 5 zie characters.png
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
		// startposities voor elke richting
        this.idleFrame = {
            down: 4,
            left: 16,
            right: 28,
            up: 40
        }
		//als de player niet beweegt willen we niet dat hij in walking position staat zie guy.png voor verschillende posities
        this.player.setFrame(this.idleFrame.down)
    } //end create

 
    update(time, delta) {
        const {keys} = this //output: this.keys
        const speed = 100
		//positie in een var steken, gebruikt voor idle animation (zie lijn 189 t.e.m 200 )
        const previousVelocity = this.player.body.velocity.clone()
		// player stopt als we op geen enekel arrow drukken
        this.player.body.setVelocity(0)
        //movement
		// drukken op linker pijl = positionX -100 (zie speed var, lijn 144 )
		// drukken op rechter pijl = positionX +100 (zie speed var, lijn 144 )
        if (keys.left.isDown || keys.a.isDown) {
            this.player.body.setVelocityX(-speed)
        } else if (keys.right.isDown || keys.d.isDown) {
            this.player.body.setVelocityX(speed)
        }

		// drukken op boven pijl = positionY -100 (zie speed var, lijn 144 )
		// drukken op rechter pijl = positionY +100 (zie speed var, lijn 144 )
        if (keys.up.isDown || keys.w.isDown) {
            this.player.body.setVelocityY(-speed)
        } else if (keys.down.isDown || keys.s.isDown) {
            this.player.body.setVelocityY(speed)
        }
		//dit zorgt ervoor dat de speed niet groter wordt bij een diagonale beweging 
        this.player.body.velocity.normalize().scale(speed)

        //animations
		//de player kijkt in een verschillende richting op basis van de controls en anims (zie lijn 88 t.e.m 117)
		//rechter pijl = player kijkt naar oven etc..
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
		//dit zorgt ervoor dat de player blijft kijken in de richting van de laatste gedrukte arrow  
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