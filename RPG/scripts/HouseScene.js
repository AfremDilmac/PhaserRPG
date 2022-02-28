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
		this.load.image("apple", "assets/items/item1/Item__64.png")
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
		//player loaden
		this.load.spritesheet('player', '../assets/guy.png', {
			frameWidth: 32,
			frameHieght: 32
		})

		/**
		 * Dialog text
		 */
		this.load.image("hello", "assets/text/hello.png")
		this.load.image("who", "assets/text/who.png")
		this.load.image("box", "assets/text/textbox.png")
		this.load.image("exit", "assets/menu/exit.png")
		this.load.image("next", "assets/menu/next.png")
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
		this.questStarted
		this.apple
		this.exit
		this.txtbox
		this.textDialog
		this.titleDialog
		this.line
		this.questProcess = 0
		this.exclamationMark
		this.next
		this.questStarted = false;

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
		 * Player
		 */
		//Om een player aan te maken gebruiken we deze code => kies de x, y positie de atlas die je wilt, en de health
		this.player = new Player(this, 200, 200, 'player', 100).setScale(0.5)
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


		/**
		 * Butcher
		 */
		let butcher = this.add.image(355, 40, "butcher").setDepth(1);
		this.exclamationMark = this.add.image(355, 30, "exclemote").setDepth(1);

		butcher.setInteractive()
		butcher.flipX = true
		//https://rexrainbow.github.io/phaser3-rex-notes/docs/site/shape-rectangle/
		butcher.on('pointerdown', () => {
			if (this.questProcess == 0) {
				// textDialog = this.add.rectangle(200, 150, 148, 148, 0x282725).setDepth(100);
				this.txtBox = this.add.image(200, 250, "box").setDepth(1).setScale(0.3);
				this.exit = this.add.image(290, 229, "exit").setDepth(1).setScale(0.2);
				this.exit.setInteractive()
				this.next = this.add.image(290, 270, "next").setDepth(1).setScale(0.2);
				this.apple = this.add.image(375, 95, "apple").setDepth(50).setScale(0.6);
				this.apple.setInteractive()
				this.questStarted = true
				this.questProcess = 1
				this.titleDialog = this.add.text(180, 220, 'Simon', {
					fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
					fontSize: '14px',
					color: 'white'
				}).setDepth(101);
				this.line = this.add.line(25, 0, 280, 238, 170, 238, 0xD3D3D3).setDepth(102);
				this.textDialog = this.add.text(160, 250, 'Welcome villager', {
					fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
					fontSize: '8px',
					color: 'white'
				}).setDepth(101);
				this.next.setInteractive()
			} else {
				this.txtBox = this.add.image(200, 250, "box").setDepth(1).setScale(0.3);
				this.exit = this.add.image(290, 229, "exit").setDepth(1).setScale(0.2);
				this.exit.setInteractive()
				this.titleDialog = this.add.text(180, 220, 'Simon', {
					fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
					fontSize: '14px',
					color: 'white'
				}).setDepth(101);
				this.line = this.add.line(25, 0, 280, 238, 170, 238, 0xD3D3D3).setDepth(102);
				this.textDialog = this.add.text(130, 250, 'Thank you ! (playername) here 5 coins', {
					fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
					fontSize: '8px',
					color: 'white'
				}).setDepth(101);
			}
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

		if (this.questStarted) {
			this.next.on('pointerdown', () => {
				this.textDialog.destroy()
				this.questProcess = 1
				this.textDialog = this.add.text(115, 250, "I'm really hungry, can you find me an apple please?", {
					fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
					fontSize: '8px',
					color: 'white'
				}).setDepth(101);
				this.next.destroy();
			})
			this.apple.on('pointerdown', () => {
				if (this.questProcess == 1) {
					this.apple.destroy()
					this.questProcess = 2
					this.exclamationMark = this.add.image(355, 30, "questemote").setDepth(1);
				}
			})
			this.exit.on('pointerdown', () => {
				this.txtBox.destroy()
				this.textDialog.destroy()
				this.titleDialog.destroy()
				this.line.destroy()
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