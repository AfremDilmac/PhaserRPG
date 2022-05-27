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
		this.load.image("butcher", "assets/npc/butcher.png")
		this.load.image("exclemote", "assets/npc/emotes/exclamation-mark.png")
		this.load.image("questemote", "assets/npc/emotes/question-mark.png")
		this.load.image("speakemote", "assets/npc/emotes/speach.png")
		this.load.image("wall", "assets/items/wall.jpg")
		//bullet loaden
		this.load.image('bullet', 'assets/items/bullet.png')
		//minimap loaden
		this.load.image('minimap', 'assets/minimap/innerVillageMap-minimap.png')
		//particle loaden
		this.load.image('particle', 'assets/items/particle.png')
		//map dat we in Tiled hebben gemaakt loaden
		this.load.tilemapTiledJSON('map', 'js/UltimeMap.json')
		//characters loaden
		this.load.spritesheet('characters', 'assets/monsters.png', {
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
		this.load.atlas('monsters', 'assets/monsters.png', 'assets/monsters.json')

		/**
		 * Text
		 */
		this.load.image("exit", "assets/menu/exit.png")
		this.load.image("next", "assets/menu/next.png")
		this.load.image("hasbulla-welcome", "assets/text/intro.png")
		this.load.image("hasbulla-wonder-forest", "assets/text/wonder-forest.png")
		this.load.image("hasbulla-good-job", "assets/text/good-job.png")
		this.load.image("hasbulla-desert", "assets/text/start-desert.png")
		this.load.image("shop", "assets/text/shop.png")
		this.load.image("yes", "assets/text/yes.png")
		this.load.image("no", "assets/text/no.png")
		this.player
		this.keys
		this.enemy
		this.enemies
		this.enemies2
		this.healthbar
		this.projectiles
		this.keys
		this.lastFiredTime = 0
		this.emmiter
		this.minimap
		this.questStarted = false;
		this.questProcess = "start"
		this.exit
		this.next
		this.yes
		this.no
		this.butcher
		this.wall
		this.coins
		this.coinAmount = 0
		this.score = 0
		this.score1 
		this.score2  
		this.totalScore

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
		const tileset = map.addTilesetImage('Tileset', 'house-tiles')
		const floor = map.createStaticLayer('floor', tileset, 0, 0)
		const floor2 = map.createStaticLayer('floor2', tileset, 0, 0)
		const worldLayer = map.createStaticLayer('world', tileset, 0, 0)
		const monsterLayer = map.createStaticLayer('monster', tileset, 0, 0)
		const pickupLayer = map.createStaticLayer('pickup', tileset, 0, 0)


		// zorgt ervoor dat de player niet meer zichtbaar is op de abovelayer (z-index)
		// aboveLayer.setDepth(100)
		// // collision inschakelen voor onze wereld 
		worldLayer.setCollisionByProperty({
			collides: true
		})

		// lengte en hoogte van de map in een variabelen steken + camera bounds limiet gelijkstelen aan deze variabelen 
		this.physics.world.bounds.width = map.widthInPixels
		this.physics.world.bounds.height = map.heightInPixels
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
		this.cameras.main.shake(100, 3)
		this.cameras.main.flash();

		/**
		 * Minimap
		 */
		//  this.minimap = this.add.image(340, 50, "minimap").setDepth(1).setScale(0.2);

		////////////////////////////////////:
		//collectable animaties 
		this.anims.create({
			key: 'coinAnim',
			frames: this.anims.generateFrameNumbers('coin', {
				start: 0,
				end: 7,

			}),
			frameRate: 12,
			repeat: -1
		})

		this.coins = this.physics.add.group()

		pickupLayer.forEachTile(tile => {
			if (tile.index != -1) {
				// console.log(tile);

				let pickup
				const x = tile.getCenterX()
				const y = tile.getCenterY()


				pickup = this.coins.create(x, y, 'coin').setScale(0.7)
				pickup.anims.play('coinAnim', true)
				pickup.body.width = 16
				pickup.body.height = 16
			}

		})


		/**
		 * Player
		 */
		//Om een player aan te maken gebruiken we deze code => kies de x, y positie de atlas die je wilt, en de health
		this.player = new Player(this, 90, 3159, 'player', 50).setScale(0.5)
		// collision tussen player en wereld inschakelen
		this.player.body.setCollideWorldBounds(true)
		// this.physics.add.collider(this.player, worldLayer)
		// this.physics.add.collider(this.player, worldLayer2)
		// this.physics.add.collider(this.player, exitHouse, this.handleExitHouse, null, this)


		// focus op player bij beweging
		this.cameras.main.startFollow(this.player, true, 0.8, 0.8)


		/** 
		 * Group of ennemys
		 */
		// Groep enemies aanmaken op verchillende plaatsen (zie berekening) a.d.h van de group functie
		// Colider inschakelen
		// enemies een blauwe kleur geven 
		// elements (enemies) in de group steken 
		this.enemies = this.add.group()
		this.enemies2 = this.add.group()
		this.enemies3 = this.add.group()
		// this.enemies.add(this.enemy)
		// this.enemies.add(this.enemy2)

		/**
		 * Wonder forest
		 */
		// if (this.questProcess == "start") {
		// 	for (let i = 0; i < 1; i++) {
		// 		const element = new Enemy(this, 180 , 2500 , 'monsters', 5, 'bat')
		// 		element.body.setCollideWorldBounds(true)
		// 		element.setTint(0x999999)
		// 		this.enemies.add(element)
		// 	}

		// 	for (let i = 0; i < 1; i++) {
		// 		const element = new Enemy(this, 550 , 2500 , 'monsters', 5, 'bat')
		// 		element.body.setCollideWorldBounds(true)
		// 		element.setTint(0x999999)
		// 		this.enemies.add(element)
		// 	}
		// }
////////////////////////////////////////////////////////////////////////////////
		// if (this.questProcess == "dessert") {
		// 	for (let i = 0; i < 5; i++) {
		// 		const element = new Enemy(this, 180 , 1400 , 'monsters', 5, 'ghost')
		// 		element.body.setCollideWorldBounds(true)
		// 		element.setTint(0x999999)
		// 		this.enemies2.add(element)
		// 	}

		// 	for (let i = 0; i < 5; i++) {
		// 		const element = new Enemy(this, 550 , 1300 , 'monsters', 5, 'ghost')
		// 		element.body.setCollideWorldBounds(true)
		// 		element.setTint(0x999999)
		// 		this.enemies2.add(element)
		// 	}
		// }
////////////////////////////////////////////////////////////////////////////////
		// if (this.questProcess == "cave") {
		// 	for (let i = 0; i < 5; i++) {
		// 		const element = new Enemy(this, 180 , 600 , 'monsters', 5, 'skeleton')
		// 		element.body.setCollideWorldBounds(true)
		// 		element.setTint(0x999999)
		// 		this.enemies3.add(element)
		// 	}

		// 	for (let i = 0; i < 5; i++) {
		// 		const element = new Enemy(this, 550 , 600 , 'monsters', 5, 'skeleton')
		// 		element.body.setCollideWorldBounds(true)
		// 		element.setTint(0x999999)
		// 		this.enemies3.add(element)
		// 	}
		// }


		//healthbar aanmaken
		this.healthbar = new HealthBar(this, this.player.x - 27, this.player.y - 19, 50)

		/**
		 * Enemy
		 */

		monsterLayer.forEachTile(tile => {
			if (tile.properties.CP_monster !== undefined) {

				const x = tile.getCenterX()
				const y = tile.getCenterY()
				const e = new Enemy(this, x, y, 'monsters', 5, tile.properties.CP_monster, 50)
				this.enemies.add(e)
				e.body.setCollideWorldBounds(true)
				e.setTint(0x09fc65)
				e.active = false;
				e.isPlaying = false;
			}

		})
		console.log(this.enemies);
		// this.enemy = new Enemy(this, 300, 200, 'monsters', 5, 'slime', 10).setTint(0xffffff)
		// this.physics.add.collider(this.enemy, this.worldLayer) // collision tussen enemy en map
		// this.enemy.body.setCollideWorldBounds(true)

		// //Om een enemy aan te maken gebruiken we deze code => kies de x, y positie de atlas die je wilt, en de damage
		// //Hier kan men een type/classe geven aan de enemy en hier is het follow zodat hij ons character volgt
		// this.enemy2 = new Enemy(this, 250, 242, 'monsters', 150, 'bat', 10).setTint(0x990005)
		// this.physics.add.collider(this.enemy2, worldLayer) // collision tussen enemy en map
		// // this.physics.add.collider(this.enemy2, worldLayer2) // collision tussen enemy en map
		// this.enemy2.body.setCollideWorldBounds(true)




		/**
		 * Projectiles
		 */
		//Key om projectiles te schieten definieëren
		this.keys = this.input.keyboard.addKeys({
			space: 'SPACE'
		})
		//projectile aanmaken + collision tussen projectile-enemy en projectile-world inschakelen
		this.projectiles = new Projectiles(this)
		this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this)
		this.physics.add.overlap(this.player, this.enemies2, this.handlePlayerEnemyCollision, null, this)
		this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileEnemyCollision, null, this)
		this.physics.add.overlap(this.projectiles, this.enemies2, this.handleProjectileEnemyCollision, null, this)
		this.physics.add.collider(this.projectiles, worldLayer, this.handleProjectileWorldCollision, null, this)
		this.physics.add.collider(this.enemies, worldLayer)
		this.physics.add.collider(this.enemies2, worldLayer)
		// this.physics.add.collider(this.player, worldLayer)
		this.physics.add.overlap(this.projectiles, this.enemy, this.handleProjectileEnemyCollision, null, this)
		this.physics.add.collider(this.player, this.coins, this.handlePlayerCoinCollision, null, this)


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

		// wall
		this.wall = this.physics.add.sprite(144, 2180, "wall").setScale(0.08)
		this.wall.setImmovable()
		this.wall.visible = false;
		this.physics.add.collider(this.player, this.wall)
		this.physics.add.collider(this.enemies, this.wall)


		// /**
		//  * Butcher
		//  */
		// this.butcher = this.add.image(110, 3080, "butcher").setDepth(1);
		// this.exclamationMark = this.add.image(110, 3070, "exclemote").setDepth(1);

		// this.butcher.on('pointerdown', () => {
		// 	if (this.player.y >= 3060 && this.player.y <= 3107) {
		// 		if (this.questProcess == "start") {
		// 			console.log('quest start');
		// 			this.txtBox = this.add.image(80, 3055, "hasbulla-welcome").setDepth(1000).setScale(0.15);
		// 			// this.txtWelcome = this.add.image(503, 180, "lblwelcome").setDepth(12).setScale(0.38)
		// 			this.exit = this.add.image(125, 3040, "exit").setDepth(2000).setScale(0.15);
		// 			this.exit.setInteractive()
		// 			this.next = this.add.image(125, 3063, "next").setDepth(2000).setScale(0.14);
		// 			this.next.setInteractive()
		// 			this.questStarted = true
		// 			this.questProcess = "wonder";
		// 			//update fields localstorage
		// 			//@TODO: pas aan

		// 			//update in firestore
		// 			// updatePlayer();
					

		// 		}
		// 	}
		// })

		// this.butcher.setInteractive()
		// this.butcher.flipX = true
	} //end create

	// handleExitHouse() {
	//     this.scene.start('houseScene')
	// }

	//COLLISION HANDLING

	handlePlayerCoinCollision(p, c) {
		c.destroy()
		this.coinAmount += 1

		localStorage.setItem('gold', this.coinAmount)
	}

	//projectielen zijn niet meer actief en verdwijnen dankzij deze functie
	handleProjectileWorldCollision(proj) {
		this.projectiles.killAndHide(proj) // is hetzelfde als this.setActive(false) (KILL) + this.setVisible(false) (HIDE)
	}

	handleProjectileEnemyCollision(enemy, projectile) {
		if (projectile.active) {

			enemy.setTint(0xff0000)

			this.time.addEvent({
				delay: 100,
				callback: () => {
					enemy.destroy()
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

	
	////UPDATE

	update(time, delta) {

	//time = tijd dat het programma gerund is in ms
	//delta = tijd tussen laatste update en nieuwe update 

		// als er op space gedrukt wordt schieten we een bullet met een interval van 200 ms
		// en we houden rekening met de positie van de player en de richting waar naar hij kijkt 
		if (this.input.x < 500) {
			if (this.keys.space.isDown || this.player.isShooting) {
				console.log(this.enemies)
				if (time > this.lastFiredTime) {
					console.log('y:' + this.player.y + 'x: ' + this.player.x)
					console.log(this.score)
					console.log(this.enemies.children.entries.length)
					this.lastFiredTime = time + 200
					this.projectiles.fireProjectile(this.player.x, this.player.y, this.player.facing)
				}
			}
		}


//////////////////////////////////////////////////////////////////////////////////


		if (this.enemies.children.entries.length == 116 && this.questProcess == "start") {
			this.wall.destroy();
		}


		if (this.player.y <= 2180 && this.player.y >= 2175) {
			console.log('enter dessert');
			this.questProcess = "dessert"
			localStorage.setItem('health', this.player.health);
			localStorage.setItem('positionX', this.player.x);
			localStorage.setItem('positionY', this.player.y);
		
		}

		if (this.player.y <= 2175) {
			// wall
			this.wall = this.physics.add.sprite(144, 2195, "wall").setScale(0.08)
			this.wall.setImmovable()
			this.wall.visible = false;
			this.physics.add.collider(this.enemies2, this.wall);
			this.physics.add.collider(this.enemies, this.wall);
			this.physics.add.collider(this.player, this.wall);

			// updatePlayer();
		}




////////////////////////////////////////////////////////////////////////////////////


		if (this.coinAmount == 10 && this.questProcess == "dessert") {
			this.wall.destroy();
		}

		if (this.player.y <= 1450 && this.player.y >= 1445) {
			console.log('enter cave');
			this.questProcess = "cave"
			localStorage.setItem('health', this.player.health);
			localStorage.setItem('positionX', this.player.x);
			localStorage.setItem('positionY', this.player.y);

			
		}

		if (this.player.y <= 1445 ) {
			// wall
			this.wall = this.physics.add.sprite(135, 1460, "wall").setScale(0.08)
			this.wall.setImmovable()
			this.wall.visible = false;
			this.physics.add.collider(this.enemies2, this.wall);
			this.physics.add.collider(this.enemies, this.wall);
			this.physics.add.collider(this.player, this.wall);

			// updatePlayer();
		}


// // //////////////////////////////////////////////////////////////////////////////////////


		if (this.coinAmount == 15 && this.questProcess == "cave") {
			this.wall.destroy();
		}

		if (this.player.y <= 691 && this.player.y >= 690) {
			console.log('enter ice');
			this.questProcess = "ice";
			localStorage.setItem('health', this.player.health);
			localStorage.setItem('positionX', this.player.x);
			localStorage.setItem('positionY', this.player.y);

			
		}

		if (this.player.y <= 685) {
			// wall
			this.wall = this.physics.add.sprite(875, 710, "wall").setScale(0.08)
			this.wall.setImmovable()
			this.wall.visible = false;
			this.physics.add.collider(this.enemies2, this.wall);
			this.physics.add.collider(this.enemies, this.wall);
			this.physics.add.collider(this.player, this.wall);

			// updatePlayer();
		}




//////////////////////////////////////////////////////////////////////////////////////




		// //Text npc
		// //Welcome game -> start wonder forest
		// if (this.questStarted) {
		// 	if (this.questProcess == 3) {
		// 		console.log('wonderToDessert');
		// 		this.next.on('pointerdown', () => {
		// 			this.txtBox.destroy();
		// 			this.txtBox = this.add.image(115, 2180, "shop").setDepth(1000).setScale(0.15);
		// 			this.yes = this.add.image(80, 2190, "yes").setDepth(2000).setScale(0.15);
		// 			this.no = this.add.image(150, 2190, "no").setDepth(2000).setScale(0.14);
		// 			this.yes.setInteractive()
		// 			this.no.setInteractive()
		// 			this.next.destroy();
		// 			this.exit.destroy();
		// 			this.wall.destroy();
		// 			localStorage.setItem('health', this.player.health)
		// 			localStorage.setItem('positionX', this.player.x)
		// 			localStorage.setItem('positionY', this.player.y)
		// 			this.yes.on('pointerdown', () => {
		// 				this.scene.start('Shop')
		// 			})
		// 			this.no.on('pointerdown', () => {
		// 				this.yes.destroy()
		// 				this.no.destroy()
		// 				this.txtBox.destroy()
		// 				this.exit.destroy()
		// 				this.next.destroy()
		// 				this.exclamationMark.destroy()
		// 				this.txtBox = this.add.image(115, 2180, "hasbulla-desert").setDepth(1000).setScale(0.15);
		// 				this.exit = this.add.image(155, 2165, "exit").setDepth(2000).setScale(0.15);
		// 				this.exit.setInteractive()

		// 				for (let i = 0; i < 1; i++) {
		// 					const element = new Enemy(this, 128, 1810, 'monsters', 5, 'bat')
		// 					element.body.setCollideWorldBounds(true)
		// 					element.setTint(0x999999)
		// 					this.enemies2.add(element)
		// 				}

		// 				for (let i = 0; i < 1; i++) {
		// 					const element = new Enemy(this, 395, 1829, 'monsters', 5, 'spider')
		// 					element.body.setCollideWorldBounds(true)
		// 					element.setTint(0x999999)
		// 					this.enemies2.add(element)
		// 				}

		// 				for (let i = 0; i < 1; i++) {
		// 					const element = new Enemy(this, 798, 2076, 'monsters', 5, 'bat')
		// 					element.body.setCollideWorldBounds(true)
		// 					element.setTint(0x999999)
		// 					this.enemies2.add(element)
		// 				}
		// 				this.wall = this.physics.add.sprite(124, 1454, "wall").setScale(0.08)
		// 				this.wall.setImmovable()
		// 				this.physics.add.collider(this.player, this.wall)
						
		// 			})
		// 		})
		// 	}
		// 	if (this.questProcess == 4) {
		// 		console.log('!!!!!!!!');
		// 		this.next.on('pointerdown', () => {
		// 			this.txtBox.destroy();
		// 			this.txtBox = this.add.image(104, 1480, "shop").setDepth(1000).setScale(0.15);
		// 			this.yes = this.add.image(80, 1490, "yes").setDepth(2000).setScale(0.15);
		// 			this.no = this.add.image(149, 1490, "no").setDepth(2000).setScale(0.14);
		// 			this.yes.setInteractive()
		// 			this.no.setInteractive()
		// 			this.next.destroy();
		// 			this.exit.destroy();
		// 			this.wall.destroy();
		// 			localStorage.setItem('health', this.player.health)
		// 			localStorage.setItem('positionX', this.player.x)
		// 			localStorage.setItem('positionY', this.player.y)
		// 			this.yes.on('pointerdown', () => {
		// 				this.scene.start('Shop')
		// 			})
		// 			this.no.on('pointerdown', () => {
		// 				this.txtBox.destroy()
		// 				this.exit.destroy()
		// 				this.next.destroy()
		// 				this.exclamationMark.destroy()
		// 				this.yes.destroy()
		// 				this.no.destroy()
		// 			})
		// 		})
		// 	}
		// 	if (this.questProcess == 1) {
		// 		console.log('Meet hasbulla');
		// 		this.next.on('pointerdown', () => {
		// 			this.txtBox.destroy();
		// 			this.txtBox = this.add.image(80, 3055, "hasbulla-wonder-forest").setDepth(1000).setScale(0.15);
		// 			this.questProcess = 1
		// 			this.next.destroy();
		// 		})
		// 	}
		// 	this.exit.on('pointerdown', () => {
		// 		this.txtBox.destroy()
		// 		this.exit.destroy()
		// 		this.next.destroy()
		// 		this.butcher.destroy()
		// 		this.exclamationMark.destroy()
		// 		if (this.yes != undefined || this.no != undefined) {
		// 			this.yes.destroy()
		// 			this.no.destroy()
		// 		}

		// 	})

		// 	//Enemies are dead
		// 	if (this.enemies.children.entries.length === 0) {

		// 		if (this.questProcess == 1) {
		// 			this.questProcess = 2;
		// 			this.butcher = this.add.image(145, 2207, "butcher").setDepth(1);
		// 			this.exclamationMark = this.add.image(145, 2188, "questemote").setDepth(1);
		// 			this.butcher.setInteractive()
		// 			this.butcher.flipX = true
		// 			this.butcher.on('pointerdown', () => {
		// 				if (this.player.y <= 2250) {
		// 					this.txtBox = this.add.image(115, 2180, "hasbulla-good-job").setDepth(1000).setScale(0.15);
		// 					console.log('wonderToDessert');
		// 					// this.txtWelcome = this.add.image(503, 180, "lblwelcome").setDepth(12).setScale(0.38)
		// 					this.next = this.add.image(160, 2190, "next").setDepth(2000).setScale(0.14);
		// 					this.next.setInteractive()
		// 					this.questProcess = 3
		// 					//update fields localstorage
		// 					//@TODO: pas aan

		// 					//update in firestore
							// updatePlayer();
		// 				}
		// 			})

		// 		}
		// 	}

		// 	if (this.questProcess == 3 && this.enemies2.children.entries.length === 0) {
		// 		// console.log("dessertToCave")
		// 		this.butcher = this.add.image(134, 1508, "butcher").setDepth(1);
		// 		this.exclamationMark = this.add.image(134, 1490, "questemote").setDepth(1);
		// 		this.butcher.setInteractive()
		// 		this.butcher.flipX = true
		// 		this.butcher.on('pointerdown', () => {
		// 			if (this.player.y <= 2250) {
		// 				this.txtBox = this.add.image(104, 1480, "hasbulla-good-job").setDepth(1000).setScale(0.15);
		// 				// this.txtWelcome = this.add.image(503, 180, "lblwelcome").setDepth(12).setScale(0.38)
		// 				this.next = this.add.image(149, 1490, "next").setDepth(2000).setScale(0.14);
		// 				this.next.setInteractive()
		// 				this.questProcess = 4
		// 				//update fields localstorage
		// 				//@TODO: pas aan

		// 				//update in firestore
		// 				// updatePlayer();
		// 			}
		// 		})
				
		// 	}

		// }


		this.player.update()

		/**
		 * Health update
		 */
		this.healthbar.x = this.player.x - 25
		this.healthbar.y = this.player.y - 19
		this.healthbar.updateHealth(this.player.health)

		this.enemies.children.iterate((child) => {
			if (!child.isDead) {
				child.update()
			}
		})

		this.enemies2.children.iterate((child) => {
			if (!child.isDead) {
				child.update()
			}

		})

		// // //All enemies are dead


		// if (!this.enemy.isDead) {
		//     this.enemy.update()
		// }
		// if (!this.enemy2.isDead) {
		//     this.enemy2.update(this.player.body.position)
		// }

	} //end update


}; //end gameScene