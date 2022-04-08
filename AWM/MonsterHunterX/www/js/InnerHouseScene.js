class InnerHouseScene extends Phaser.Scene {
	constructor() {
		super('innerHouseScene')
	}

	preload() {
		this.cursors
		// this.cameras.main.setBackgroundColor('0x9900e3')
		// verchillende tiles loaden
		// this.load.image('tiles', 'assets/Tilemap/dungeon.png')
		this.load.image('house-tiles', 'assets/Tilemap/Tileset.png')
		//bullet loaden
		this.load.image('bullet', 'assets/items/bullet.png')
		//minimap loaden
		this.load.image('minimap', 'assets/minimap/innerVillageMap-minimap.png')
		//particle loaden
		this.load.image('particle', 'assets/items/particle.png')
		//map dat we in Tiled hebben gemaakt loaden
		this.load.tilemapTiledJSON('map-innerhouse', 'js/innerVillageMap.json')
		//characters loaden
		this.load.spritesheet('characters', 'assets/characters.png', {
			frameWidth: 16,
			frameHieght: 16
		})
		//player loaden
		this.load.spritesheet('player', 'assets/guy.png', {
			frameWidth: 32,
			frameHieght: 32
		})

	
		this.player
		this.keys
		this.enemy
		this.enemies
		this.healthbar
		this.projectiles
		this.keys
		this.lastFiredTime = 0
		this.emmiter
		this.minimap

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
			key: 'map-innerhouse'
		})
		this.cameras.main.zoom = 2;

		//verschillende layers aanmaken met gepaste key 
		const tileset = map.addTilesetImage('Tileset', 'house-tiles')
		const belowLayer = map.createStaticLayer('below player', tileset, 0, 0)
		const belowLayer2 = map.createStaticLayer('below player2', tileset, 0, 0)
		const worldLayer = map.createStaticLayer('world', tileset, 0, 0)
		const worldLayer2 = map.createStaticLayer('world2', tileset, 0, 0)
		const aboveLayer = map.createStaticLayer('above player', tileset, 0, 0)
		const exitHouse = map.createStaticLayer('exit house', tileset, 0, 0)

		// zorgt ervoor dat de player niet meer zichtbaar is op de abovelayer (z-index)
		aboveLayer.setDepth(100)
		// collision inschakelen voor onze wereld 
		worldLayer.setCollisionByProperty({
			collides: true
		})
		worldLayer2.setCollisionByProperty({
			collides: true
		})
		exitHouse.setCollisionByProperty({
			collides: true
		})
		exitHouse.setDepth(0)

		// worldLayer2.setCollisionByProperty({
		//     collides: true
		// })
		// lengte en hoogte van de map in een variabelen steken + camera bounds limiet gelijkstelen aan deze variabelen 
		this.physics.world.bounds.width = map.widthInPixels
		this.physics.world.bounds.height = map.heightInPixels
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
		this.cameras.main.shake(100, 3)
		this.cameras.main.flash();

		// /**
		//  * This is if you want to see the collission layer (world)
		//  */
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
		 * Minimap
		 */
		 this.minimap = this.add.image(340, 50, "minimap").setDepth(1).setScale(0.2);
		
		/**
		 * Player
		 */
		//Om een player aan te maken gebruiken we deze code => kies de x, y positie de atlas die je wilt, en de health
		this.player = new Player(this, 80, 100, 'player', 100).setScale(0.5)
		// collision tussen player en wereld inschakelen
		this.player.body.setCollideWorldBounds(true)
		this.physics.add.collider(this.player, worldLayer)
		this.physics.add.collider(this.player, worldLayer2)
		this.physics.add.collider(this.player, exitHouse, this.handleExitHouse, null, this)

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
		this.physics.add.collider(this.projectiles, worldLayer2, this.handleProjectileWorldCollision, null, this)
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

	handleExitHouse() {
        this.scene.start('houseScene')
	}

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