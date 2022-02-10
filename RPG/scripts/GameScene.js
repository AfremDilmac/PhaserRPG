class GameScene extends Phaser.Scene {
    constructor() {
        super('gameScene')
    }

    //class GameScene extends Phaser.Scene {


    preload() {
        this.cursors
        // this.cameras.main.setBackgroundColor('0x9900e3')
        // verchillende tiles loaden
        // this.load.image('tiles', '../assets/Tilemap/dungeon.png')
        this.load.image('tiles', '../assets/Tilemap/dungeon.png')
        //bullet loaden
        this.load.image('bullet', 'assets/bullet.png')
        //particle loaden
        this.load.image('particle', '../assets/particle.png')
        //map dat we in Tiled hebben gemaakt loaden
        this.load.tilemapTiledJSON('map', '../scripts/dungeonMap.json')
        //characters loaden
        this.load.spritesheet('characters', '../assets/characters.png', {
            frameWidth: 16,
            frameHieght: 16
        })
        // vijanden loaden
        // we gebruiken atlas omdat we zowel de .png als de .json file loaden
        this.load.atlas('skeleton', 'assets/skeleton.png', 'assets/skeleton.json')
        this.load.atlas('ghost', 'assets/ghost.png', 'assets/ghost.json')


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
        // lengte en hoogte van de map in een variabelen steken + camera bounds limiet gelijkstelen aan deze variabelen 
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
        //Om een player aan te maken gebruiken we deze code => kies de x, y positie de atlas die je wilt, en de health
        this.player = new Player(this, 40, 35, 'characters', 100)
        // collision tussen player en wereld inschakelen
        this.player.body.setCollideWorldBounds(true)
        this.physics.add.collider(this.player, worldLayer)

        // focus op player bij beweging
        this.cameras.main.startFollow(this.player, true, 0.8, 0.8)

        /**
         * Enemy
         */
        //Om een enemy aan te maken gebruiken we deze code => kies de x, y positie de atlas die je wilt, en de damage
        // this.enemy = new Enemy(this, 250, 242, 'skeleton', 25, 'wandering50')
        // // collision tussen enemy en map
        // this.physics.add.collider(this.enemy, worldLayer)
        // this.enemy.body.setCollideWorldBounds(true)

        // //Om een enemy aan te maken gebruiken we deze code => kies de x, y positie de atlas die je wilt, en de damage
        // //Hier kan men een type/classe geven aan de enemy en hier is het follow zodat hij ons character volgt
        // this.enemy2 = new EnemyFollow(this, 250, 242, 'skeleton', 25, 'follow').setTint(0x00ff00)
        // // collision tussen enemy en map
        // this.physics.add.collider(this.enemy2, worldLayer)
        // this.enemy2.body.setCollideWorldBounds(true)

        /** 
         * Group of ennemys
         */
        //Groep enemies aanmaken op verchillende plaatsen (zie berekening) a.d.h van de group functie
        //Colider inschakelen
        //enemies een blauwe kleur geven 
        //elements (enemies) in de group steken 
        this.enemies = this.add.group()
       
        for (let i = 0; i < 8; i++) {
            const element = new Enemy(this, 220 + 20 * i, 100 + 10 * i, 'skeleton', 10, 'wandering10')
            element.body.setCollideWorldBounds(true)
            element.setTint(0x9999ff)
            this.enemies.add(element)
        }
        //colision tussen enemie en map
        this.physics.add.collider(this.enemies, worldLayer)

        /**
         * collisions
         */
        //Hier gebruiken we overlap omdat het er beter uitziet, met colider is het niet altijd duidelijk dat er een colision is
        // met de functie handlePlayerEnemyCollision gaan we wat effect geven aan de overlpa van p (player) en e (enemy)
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this)
        this.physics.add.overlap(this.player, this.enemy, this.handlePlayerEnemyCollision, null, this)
        this.physics.add.overlap(this.player, this.enemy2, this.handlePlayerEnemyCollision, null, this)


        /**
         * Healthbar
         */
        //healthbar aanmaken
        this.healthbar = new HealthBar(this, 20, 20, 100)


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

    } //end create

    //projectielen zijn niet meer actief en verdwijnen dankzij deze functie
    handleProjectileWorldCollision(proj) {
        this.projectiles.killAndHide(proj) // is hetzelfde als this.setActive(false) (KILL) + this.setVisible(false) (HIDE)
    }
    //deze functie zorgd ervoor dat als een enemy geraakt wordt het volgende gebeurt:
    //enemy wordt rood
    //enemy explodes 
    //projectile wordt inactief en invisible
    //callbackScope om te zegen in welke scene het gebeurt 
    // loop: false om iteratie te vermeiden
    handleProjectileEnemyCollision(enemy, projectile) {
        if (projectile.active) {
            enemy.setTint(0xff0000)
            this.time.addEvent({
                delay: 0,
                callback: () => {
                    enemy.explode()
                    projectile.recycle()
                },
                callbackScope: this,
                loop: false
            })
            this.emmiter.active = true
            this.emmiter.setPosition(enemy.x, enemy.y)
            this.emmiter.explode()
        }
    }

    //Collision player enemy
    // De player word voor 0.5 secoden rood na botsing, en er is een klein shake effect 
    // als de player botst tegen enemy dan verliest hij health
    // als de player zijn health verliest => camera shake
    // als de player al zijn health verliest => black screen en we restarten de scene
    handlePlayerEnemyCollision(p, e) {
        p.health -= e.damage
        this.healthbar.updateHealth(p.health)
        if (p.health <= 0) {
            this.cameras.main.shake(100, 0.05)
            this.cameras.main.fade(250, 0, 0, 0)
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.restart()
            })
        }
        this.cameras.main.shake(40, 0.02)
        p.setTint(0xff0000) //red
        this.time.addEvent({
            delay: 350,
            callback: () => {
                p.clearTint() // get rid of red tint
            },
            callbackScope: this,
            loop: false
        })
        e.explode()
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

        this.enemies.children.iterate((child) => {
            if (!child.isDead) {
                child.update()
            }
        })
        //All enemies are dead
        if (this.enemies.children.entries.length === 0) {
            console.log("All enemies are dead")
        }
       
        
    } //end update


}; //end gameScene