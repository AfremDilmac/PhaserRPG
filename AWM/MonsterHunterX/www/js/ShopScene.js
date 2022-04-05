class ShopScene extends Phaser.Scene {
	constructor() {
		super('shopScene')
	}


	preload() {
		
		this.cursors
		// verchillende tiles loaden
		this.load.image('tiles', 'assets/Tilemap/Overworld.png')
		//bullet loaden
		this.load.image('bullet', 'assets/items/bullet.png')
		//particle loaden
		this.load.image('particle', 'assets/items/particle.png')
		//map dat we in Tiled hebben gemaakt loaden
		this.load.tilemapTiledJSON('map', 'js/shopMap.json')
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
		// coin loaden
		this.load.spritesheet('coin', 'assets/pickup/FullCoins.png', {
			frameWidth: 16,
			frameHieght: 16
		})
		// salad loaden
		this.load.spritesheet('salad', 'assets/pickup/salad.png', {
			frameWidth: 16,
			frameHieght: 16
		})
		// vijanden loaden
		// we gebruiken atlas omdat we zowel de .png als de .json file loaden
		// this.load.atlas('skeleton', 'assets/skeleton/skeleton.png', 'assets/skeleton/skeleton.json')
		this.load.atlas('monsters', 'assets/monsters.png', 'assets/monsters.json')


		this.player
		this.keys
		this.enemy
		this.enemies
		this.healthbar
		this.projectiles
		this.keys
		this.lastFiredTime = 0
		this.emmiter
		this.salad
		this.coins
		this.coinAmount = 0
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
		this.cameras.main.zoom = 2;

		//verschillende layers aanmaken met gepaste key 
		const tileset = map.addTilesetImage('Overworld', 'tiles')
		const belowLayer = map.createStaticLayer('below player', tileset, 0, 0)
        const belowLayer2 = map.createStaticLayer('below player2', tileset, 0, 0)
		const worldLayer = map.createStaticLayer('world', tileset, 0, 0)
		const aboveLayer = map.createStaticLayer('above player', tileset, 0, 0)
		const aboveMap = map.createStaticLayer('above map', tileset, 0, 0)

		// zorgt ervoor dat de player niet meer zichtbaar is op de abovelayer (z-index)
		aboveLayer.setDepth(100)
        aboveMap.setDepth(-1)
		// collision inschakelen voor onze wereld 
		worldLayer.setCollisionByProperty({
			collides: true
		})
        aboveMap.setCollisionByProperty({
			collides: true
		})
		// lengte en hoogte van de map in een variabelen steken + camera bounds limiet gelijkstelen aan deze variabelen 
		this.physics.world.bounds.width = map.widthInPixels
		this.physics.world.bounds.height = map.heightInPixels
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)


		/**
		 * Player
		 */
		//Om een player aan te maken gebruiken we deze code => kies de x, y positie de atlas die je wilt, en de health
		this.player = new Player(this, 40, 35, 'player', 100).setScale(0.5)
		// collision tussen player en wereld inschakelen
		this.player.body.setCollideWorldBounds(true)
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
        this.physics.add.collider(this.player, aboveMap, this.handleAboveMapCollission, null, this)
		this.physics.add.collider(this.player, worldLayer)
		/**
		 * Healthbar
		 */
		//healthbar aanmaken
		this.healthbar = new HealthBar(this, 20, 20, 100)
		
		//////////////////////:
		// coint text
		this.coinText = this.add.text(20, 40, 'Gold: ' + this.coinAmount, {
			font: '12px',
			fill: '#ffffff'
		})

	} //end create


	////////////////////////////////
	//collisions
	//projectielen zijn niet meer actief en verdwijnen dankzij deze functie
	handleProjectileWorldCollision(proj) {
		this.projectiles.killAndHide(proj) // is hetzelfde als this.setActive(false) (KILL) + this.setVisible(false) (HIDE)
	}

    handleAboveMapCollission() {
        this.scene.start('houseScene')
	}


	//time = tijd dat het programma gerund is in ms
	//delta = tijd tussen laatste update en nieuwe update 
	update(time, delta) {
		// als er op space gedrukto wordt schieten we een bullet met een interval van 200 ms
		// en we houden rekening met de positie van de player en de richting waar naar hij kijkt 
		if (this.keys.space.isDown || this.player.isShooting) {
			if (time > this.lastFiredTime) {
				this.lastFiredTime = time + 200
				this.projectiles.fireProjectile(this.player.x, this.player.y, this.player.facing)

			}
		}
       
		this.player.update()

	} //end update


}; //end gameScene