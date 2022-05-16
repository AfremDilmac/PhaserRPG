class InnerShopScene extends Phaser.Scene {
	constructor() {
		super('Shop')
	}


	preload() {
		
		this.cursors
		// verchillende tiles loaden
		this.load.image('tiles', 'assets/Tilemap/Tileset.png')
		//Shop npc
		this.load.image("merchant", "assets/npc/merchant.png")
		this.load.image("exclemote", "assets/npc/emotes/exclamation-mark.png")
		this.load.image("questemote", "assets/npc/emotes/question-mark.png")
		this.load.image("speakemote", "assets/npc/emotes/speach.png")
		//bullet loaden
		this.load.image('bullet', 'assets/items/bullet.png')
		//particle loaden
		this.load.image('particle', 'assets/items/particle.png')
	
		//map dat we in Tiled hebben gemaakt loaden
		this.load.tilemapTiledJSON('shop-map', 'js/Shop.json')
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
		this.load.image("merchant-welcome", "assets/text/merchant-welcome.png")
		this.load.image("merchant-shop", "assets/text/merchant-shop.png")
		this.load.image("exit", "assets/menu/exit.png")
		this.load.image("next", "assets/menu/next.png")

		this.player
		this.keys
		this.enemy
		this.enemies
		this.healthbar
		this.projectiles
		this.keys
		this.lastFiredTime = 0
		this.npcStart = false;
		this.shopProcess = 0
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
			key: 'shop-map'
		})
		this.cameras.main.zoom = 2;

		//verschillende layers aanmaken met gepaste key 
		const tileset = map.addTilesetImage('Tileset', 'tiles')
		const belowLayer = map.createStaticLayer('below player', tileset, 0, 0)
		const worldLayer = map.createStaticLayer('world', tileset, 0, 0)
		const worldLayer2 = map.createStaticLayer('world2', tileset, 0, 0)
		const aboveLayer = map.createStaticLayer('above player', tileset, 0, 0)
		const shopDoor = map.createStaticLayer('exit shop', tileset, 0, 0)

		// zorgt ervoor dat de player niet meer zichtbaar is op de abovelayer (z-index)
		aboveLayer.setDepth(100)
		// collision inschakelen voor onze wereld 
		worldLayer.setCollisionByProperty({
			collides: true
		})
        worldLayer2.setCollisionByProperty({
			collides: true
		})
		shopDoor.setCollisionByProperty({
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
		this.player = new Player(this, 210, 270, 'player', 100).setScale(0.5)
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
        this.physics.add.collider(this.projectiles, worldLayer2, this.handleProjectileWorldCollision, null, this)
		this.physics.add.collider(this.player, shopDoor, this.handleShopDoorCollission, null, this)

		this.physics.add.collider(this.player, worldLayer)
        this.physics.add.collider(this.player, worldLayer2)
		/**
		 * Healthbar
		 */
		//healthbar aanmaken
		this.healthbar = new HealthBar(this, this.player.x - 27, this.player.y - 19, 50)
		
		//////////////////////:
		// coint text
		this.coinText = this.add.text(20, 40, 'Gold: ' + this.coinAmount, {
			font: '12px',
			fill: '#ffffff'
		})

		let merchant = this.add.image(160, 62, "merchant").setDepth(1);
	

		merchant.setInteractive()
		merchant.flipX = true
		merchant.on('pointerdown', () =>{
			console.log(this.player.y)
			if (this.player.y <= 104) {
				if (this.shopProcess == 0) {
				this.txtBox = this.add.image(129, 38, "merchant-welcome").setDepth(1000).setScale(0.15);
				this.exit = this.add.image(180, 20, "exit").setDepth(2000).setScale(0.15);
				this.exit.setInteractive()
				this.next = this.add.image(180, 50, "next").setDepth(2000).setScale(0.14);
				this.next.setInteractive()
				this.npcStart = true;
			}}
		})
	} //end create


	////////////////////////////////
	//collisions
	//projectielen zijn niet meer actief en verdwijnen dankzij deze functie
	handleProjectileWorldCollision(proj) {
		this.projectiles.killAndHide(proj) // is hetzelfde als this.setActive(false) (KILL) + this.setVisible(false) (HIDE)
	}

	handleShopDoorCollission() {
        this.scene.start('innerHouseScene')
	}


	//time = tijd dat het programma gerund is in ms
	//delta = tijd tussen laatste update en nieuwe update 
	update(time, delta) {
		this.healthbar.x = this.player.x - 25
		this.healthbar.y = this.player.y - 19
		this.healthbar.updateHealth(this.player.health)
		// als er op space gedrukto wordt schieten we een bullet met een interval van 200 ms
		// en we houden rekening met de positie van de player en de richting waar naar hij kijkt 
		this.player.update()

	} //end update


}; //end gameScene