class HouseScene extends Phaser.Scene {
	constructor() {
		super('houseScene')
	}

	//class GameScene extends Phaser.Scene {


	preload() {
		this.cursors
		// this.cameras.main.setBackgroundColor('0x9900e3')
		// verchillende tiles loaden
		// this.load.image('tiles', 'assets/Tilemap/dungeon.png')
		this.load.image('house-tiles', 'assets/Tilemap/Tileset.png')
		this.load.image("butcher", "assets/npc/butcher.png")
		this.load.image("exclemote", "assets/npc/emotes/exclamation-mark.png")
		this.load.image("questemote", "assets/npc/emotes/question-mark.png")
		this.load.image("speakemote", "assets/npc/emotes/speach.png")
		this.load.image("apple", "assets/items/item1/Item__64.png")
		//bullet loaden
		this.load.image('bullet', 'assets/items/bullet.png')
		//particle loaden
		this.load.image('particle', 'assets/items/particle.png')
		//map dat we in Tiled hebben gemaakt loaden
		this.load.tilemapTiledJSON('map-house', 'js/VillageMap.json')
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
		this.load.spritesheet('salad', 'assets/Tilemap/Tileset.png', {
			frameWidth: 16,
			frameHieght: 16
		})

		/**
		 * Dialog text
		 */
		this.load.image("hello", "assets/text/hello.png")
		this.load.image("who", "assets/text/who.png")
		this.load.image("hasbulla-welcome", "assets/text/hasbulla-welcome.png")
		this.load.image("hasbulla2", "assets/text/hasbulla-welcome-2.png")
		this.load.image("hasbulla3", "assets/text/hasbulla-welcome-3.png")
		this.load.image("lblwelcome", "assets/text/welcome.png")
		this.load.image("exit", "assets/menu/exit.png")
		this.load.image("next", "assets/menu/next.png")
		// vijanden loaden
		// we gebruiken atlas omdat we zowel de .png als de .json file loaden

		this.player
		this.keys
		this.enemy
		this.enemies
		this.healthbar
		this.keys
		this.lastFiredTime = 0
		this.emmiter
		this.questStarted
		this.apple
		this.exit
		this.textDialog
		this.titleDialog
		this.line
		this.salad
		this.questProcess = 0
		this.exclamationMark
		this.next
		this.questStarted = false;
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
			key: 'map-house'
		})
		this.cameras.main.zoom = 2;

		//verschillende layers aanmaken met gepaste key
		const tileset = map.addTilesetImage('Tileset', 'house-tiles')
		const belowLayer = map.createStaticLayer('below player', tileset, 0, 0)
		const belowLayer2 = map.createStaticLayer('below player2', tileset, 0, 0)
		const worldLayer = map.createStaticLayer('world', tileset, 0, 0)
		const worldLayer2 = map.createStaticLayer('world2', tileset, 0, 0)
		const aboveLayer = map.createStaticLayer('above player', tileset, 0, 0)
		const pickupLayer = map.createStaticLayer('pickup', tileset, 0, 0)
		const enterHouseMap = map.createStaticLayer('house map', tileset, 0, 0)
		const enterDungeonMap = map.createStaticLayer('dungeon map', tileset, 0, 0)
		const enterAboveMap = map.createStaticLayer('above map', tileset, 0, 0)
		const enterBelowMap = map.createStaticLayer('below map', tileset, 0, 0)

		// zorgt ervoor dat de player niet meer zichtbaar is op de abovelayer (z-index)
		aboveLayer.setDepth(100)
		enterHouseMap.setDepth(101)
		pickupLayer.setDepth(-1)
		enterAboveMap.setDepth(-1)
		enterBelowMap.setDepth(-1)
		// collision inschakelen voor onze wereld
		worldLayer.setCollisionByProperty({
			collides: true
		})
		worldLayer2.setCollisionByProperty({
			collides: true
		})

		enterHouseMap.setCollisionByProperty({
			collides: true
		})

		enterDungeonMap.setCollisionByProperty({
			collides: true
		})

		enterAboveMap.setCollisionByProperty({
			collides: true
		})

		enterBelowMap.setCollisionByProperty({
			collides: true
		})

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

		this.anims.create({
			key: 'saladAnim',
			frames: this.anims.generateFrameNumbers('salad', {
				start: 167,
				end: 167,

			}),
			frameRate: 12,
			repeat: -1
		})

		this.salad = this.physics.add.group()
		pickupLayer.forEachTile(tile => {
			if (tile.index != -1) {
				//console.log(tile);
				let pickup
				const x = tile.getCenterX()
				const y = tile.getCenterY()

				if (tile.properties.CP_coin == 'gold') {
					pickup = this.coins.create(x, y, 'coin')
					pickup.anims.play('coinAnim', true)
				} else if (tile.properties.CP_salad == 'salad') {
					pickup = this.salad.create(x, y, 'salad')
					pickup.anims.play('saladAnim', true)
				}
				pickup.body.width = 16
				pickup.body.height = 16
			}

		})

		/**
		 * Player
		 */
		//Om een player aan te maken gebruiken we deze code => kies de x, y positie de atlas die je wilt, en de health
		this.player = new Player(this, 230, 135, 'player', 80).setScale(0.5)
		// collision tussen player en wereld inschakelen
		this.player.body.setCollideWorldBounds(true)
		this.physics.add.collider(this.player, worldLayer)
		this.physics.add.collider(this.player, enterHouseMap, this.handleEnterHouseMapCollission, null, this)
		this.physics.add.collider(this.player, this.salad, this.handlePlayerSaladCollision, null, this)
		this.physics.add.collider(this.player, enterDungeonMap, this.handleEnterDungeonMapCollission, null, this)
		this.physics.add.collider(this.player, enterAboveMap, this.handleAboveMapCollission, null, this)
		this.physics.add.collider(this.player, enterBelowMap, this.handleEnterBelowMapCollission, null, this)

		// focus op player bij beweging
		this.cameras.main.startFollow(this.player, true, 0.8, 0.8)

		/**
		 * Butcher
		 */
		let butcher = this.add.image(335, 85, "butcher").setDepth(1);
		this.exclamationMark = this.add.image(335, 72, "exclemote").setDepth(1);
		console.log(this.player.y)

		butcher.setInteractive()
		butcher.flipX = true
		//https://rexrainbow.github.io/phaser3-rex-notes/docs/site/shape-rectangle/
		butcher.on('pointerdown', () => {
			if (this.player.y <= 104) {
				if (this.questProcess == 0) {
				this.txtBox = this.add.image(504, 180, "hasbulla-welcome").setDepth(1000).setScale(0.15);
				// this.txtWelcome = this.add.image(503, 180, "lblwelcome").setDepth(12).setScale(0.38)
				this.exit = this.add.image(552, 165, "exit").setDepth(2000).setScale(0.15);
				this.exit.setInteractive()
				this.next = this.add.image(552, 192, "next").setDepth(2000).setScale(0.14);
				this.next.setInteractive()
				this.apple = this.add.image(375, 95, "apple").setDepth(50).setScale(0.6);
				this.apple.setInteractive()
				this.questStarted = true
				this.questProcess = 1
				// this.line = this.add.line(25, 0, 280, 238, 170, 238, 0xD3D3D3).setDepth(102);
				this.txtBox.setScrollFactor(0)
				// this.txtWelcome.setScrollFactor(0)
				this.exit.setScrollFactor(0)
				this.next.setScrollFactor(0)
				}
				if (this.questProcess > 1) {
					this.txtBox.destroy();
					this.txtBox = this.add.image(504, 180, "hasbulla3").setDepth(1000).setScale(0.15);
					this.exit = this.add.image(552, 165, "exit").setDepth(2000).setScale(0.15);
					this.exit.setInteractive()
					this.exclamationMark.destroy();
					this.txtBox.setScrollFactor(0)
					this.exit.setScrollFactor(0)

					this.coinAmount += 5;
					this.coinText.setText('Gold: ' + this.coinAmount)
				}
			}
			
		})
	} //end create

	handleEnterHouseMapCollission() {
        this.scene.start('innerHouseScene')
	}

	handleAboveMapCollission() {
        console.log('start above map')
	}

	handleEnterDungeonMapCollission() {
        this.scene.start('gameScene')
	}

	handleEnterBelowMapCollission() {
		this.scene.start('shopScene')
	}

	handlePlayerSaladCollision(p, s) {
		s.destroy()
		if (p.health < 95) {
			p.health += 10
		}
		this.healthbar.updateHealth(p.health)
	}

	//time = tijd dat het programma gerund is in ms
	//delta = tijd tussen laatste update en nieuwe update
	update(time, delta) {

		if (this.questStarted) {
			this.next.on('pointerdown', () => {
				this.txtBox.destroy();
				this.txtBox = this.add.image(504, 180, "hasbulla2").setDepth(1000).setScale(0.15);
				this.txtBox.setScrollFactor(0)
				this.questProcess = 1
				this.next.destroy();
			})
			this.apple.on('pointerdown', () => {
				if (this.questProcess == 1) {
					this.apple.destroy()
					this.questProcess = 2
					this.exclamationMark.destroy();
					this.exclamationMark = this.add.image(335, 75, "questemote").setDepth(1);
				}
			})
			this.exit.on('pointerdown', () => {
				this.txtBox.destroy()
				this.exit.destroy()
				this.next.destroy()
			})
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