class HouseScene extends Phaser.Scene {
    constructor() {
        super('houseScene')
    }

    //class GameScene extends Phaser.Scene {


    preload() {
        this.cursors
        // this.cameras.main.setBackgroundColor('0x9900e3')
        // verchillende tiles loaden
        // this.load.image('tiles', '../assets/Tilemap/dungeon.png')
        this.load.image('house-tiles', '../assets/Tilemap/Overworld.png')
        this.load.image("butcher", "assets/npc/butcher.png")
        this.load.image("exclemote", "assets/npc/emotes/exclamation-mark.png")
        this.load.image("questemote", "assets/npc/emotes/question-mark.png")
        //bullet loaden
        this.load.image('bullet', 'assets/bullet.png')
        //particle loaden
        this.load.image('particle', '../assets/particle.png')
        //map dat we in Tiled hebben gemaakt loaden
        this.load.tilemapTiledJSON('map-house', '../scripts/houseMap.json')
        //characters loaden
        this.load.spritesheet('characters', '../assets/characters.png', {
            frameWidth: 16,
            frameHieght: 16
        })

        /**
         * Dialog text
         */
        this.load.image("hello", "assets/text/hello.png")
        this.load.image("who", "assets/text/who.png")
        this.load.image("box", "assets/text/textbox.png")
        this.load.image("exit", "assets/menu/exit.png")
        // vijanden loaden
        // we gebruiken atlas omdat we zowel de .png als de .json file loaden

        this.player
        this.keys
        this.enemy
        this.enemies
        this.healthbar
        this.projectiles
        this.keys
        this.lastFiredTime = 0
        this.emmiter

        /**
         * Virtual joystick
         */
        var url;

        url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
        this.load.plugin('rexvirtualjoystickplugin', url, true);


    } //end preload

    create() {

        //map object aanmaken met key 'map'
        const map = this.make.tilemap({
            key: 'map-house'
        })

        //verschillende layers aanmaken met gepaste key 
        const tileset = map.addTilesetImage('House', 'house-tiles')
        const belowLayer = map.createStaticLayer('below player', tileset, 0, 0)
        const belowLayer2 = map.createStaticLayer('below player2', tileset, 0, 0)
        const worldLayer = map.createStaticLayer('world', tileset, 0, 0)
        const worldLayer2 = map.createStaticLayer('world2', tileset, 0, 0)
        const aboveLayer = map.createStaticLayer('above player', tileset, 0, 0)
        // zorgt ervoor dat de player niet meer zichtbaar is op de abovelayer (z-index)
        aboveLayer.setDepth(100)
        // collision inschakelen voor onze wereld 
        worldLayer.setCollisionByProperty({
            collides: true
        })
        worldLayer2.setCollisionByProperty({
            collides: true
        })
        // worldLayer2.setCollisionByProperty({
        //     collides: true
        // })
        // lengte en hoogte van de map in een variabelen steken + camera bounds limiet gelijkstelen aan deze variabelen 
        this.physics.world.bounds.width = map.widthInPixels
        this.physics.world.bounds.height = map.heightInPixels
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        /**
         * Butcher
         */
        let butcher = this.add.image(355, 40, "butcher").setDepth(1);
        let exclamationMark = this.add.image(355, 30, "exclemote").setDepth(1);

        butcher.setInteractive()
        butcher.flipX = true






        /**
         * This is if you want to see the collission layer (world)
         */
        // const debugGraphics = this.add.graphics().setAlpha(0.2)
        // worldLayer.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(0, 0, 255),
        //     faceColor: new Phaser.Display.Color(0, 255, 0, 255)
        // })

        // worldLayer2.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(0, 0, 255),
        //     faceColor: new Phaser.Display.Color(0, 255, 0, 255)
        // })

        /**
         * Player
         */
        //Om een player aan te maken gebruiken we deze code => kies de x, y positie de atlas die je wilt, en de health
        this.player = new Player(this, 200, 200, 'characters', 100)
        // collision tussen player en wereld inschakelen
        this.player.body.setCollideWorldBounds(true)
        this.physics.add.collider(this.player, worldLayer)

        // focus op player bij beweging
        this.cameras.main.startFollow(this.player, true, 0.8, 0.8)


        /**
         * Projectiles
         */
        //Key om projectiles te schieten definieëren
        this.keys = this.input.keyboard.addKeys({
            space: 'SPACE'
        })
        //projectile aanmaken + collision tussen projectile-enemy en projectile-world inschakelen
        this.projectiles = new Projectiles(this)
        this.physics.add.collider(this.projectiles, worldLayer, this.handleProjectileWorldCollision, null, this)
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileEnemyCollision, null, this)
        this.physics.add.overlap(this.projectiles, this.enemy, this.handleProjectileEnemyCollision, null, this)

        /** 
         * Particles
         */
        //Aanmaken van emitter dat we straks gaan gebruiken voor de handleProjectileEnemyCollision
        this.emmiter = this.add.particles('particle').createEmitter({
            x: 0,
            y: 0,
            quantity: 15,
            speed: {
                min: -100,
                max: 100
            },
            angle: {
                min: 0,
                max: 360
            },
            scale: {
                start: 0.7,
                end: 0
            },
            lifespan: 300,
            active: false

        })
        var textDialog = ''
        let exit = ''
        //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/shape-rectangle/
        butcher.on('pointerdown', () => {

            exclamationMark = this.add.image(355, 30, "questemote").setDepth(1);
            // textDialog = this.add.rectangle(200, 150, 148, 148, 0x282725).setDepth(100);
            let txtBox = this.add.image(200, 250, "box").setDepth(1).setScale(0.3);
            exit = this.add.image(290, 229, "exit").setDepth(1).setScale(0.2);
            exit.setInteractive()
            // textDialog.setStrokeStyle(4, 0x106162);

            textDialog = this.add.text(180, 220, 'Simon', {
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
                fontSize: '14px',
                color: 'white'
            }).setDepth(101);
            this.add.line(25, 0, 280, 238, 170, 238, 0xD3D3D3).setDepth(102);
            textDialog = this.add.text(170, 250, 'Welcome villager...', {
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
                fontSize: '8px',
                color: 'white'
            }).setDepth(101);
            textDialog.setInteractive()

        })

    } //end create

    //projectielen zijn niet meer actief en verdwijnen dankzij deze functie
    handleProjectileWorldCollision(proj) {
        this.projectiles.killAndHide(proj) // is hetzelfde als this.setActive(false) (KILL) + this.setVisible(false) (HIDE)
    }

    //time = tijd dat het programma gerund is in ms
    //delta = tijd tussen laatste update en nieuwe update 
    update(time, delta) {
        // als er op space gedrukt wordt schieten we een bullet met een interval van 200 ms
        // en we houden rekening met de positie van de player en de richting waar naar hij kijkt 
        if (this.keys.space.isDown || this.player.isShooting) {
            if (time > this.lastFiredTime) {
                this.lastFiredTime = time + 200
                this.projectiles.fireProjectile(this.player.x, this.player.y, this.player.facing)

            }
        }
        this.player.update()

        // if (!this.enemy.isDead) {
        //     this.enemy.update()
        // }
        // if (!this.enemy2.isDead) {
        //     this.enemy2.update(this.player.body.position)
        // }

    } //end update


}; //end gameScene