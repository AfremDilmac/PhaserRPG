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
		this.load.image("monsters-alive", "assets/text/monsters-alive.png")
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
		this.wall2
		this.wall3
		this.wall4
		this.wall5
		this.wall6
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

		// this.startData();


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
		// this.enemies3 = this.add.group()
		// this.enemies.add(this.enemy)
		// this.enemies.add(this.enemy2)

		
		//Wonder forest{
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
		// console.log(this.enemies);
		// this.enemy = new Enemy(this, 300, 200, 'monsters', 5, 'slime', 10).setTint(0xffffff)
		// this.physics.add.collider(this.enemy, this.worldLayer) // collision tussen enemy en map
		// this.enemy.body.setCollideWorldBounds(true)
		// //Om een enemy aan te maken gebruiken we deze code => kies de x, y positie de atlas die je wilt, en de damage
		// //Hier kan men een type/classe geven aan de enemy en hier is het follow zodat hij ons character volgt
		// this.enemy2 = new Enemy(this, 250, 242, 'monsters', 150, 'bat', 10).setTint(0x990005)
		// this.physics.add.collider(this.enemy2, worldLayer) // collision tussen enemy en map
		// // this.physics.add.collider(this.enemy2, worldLayer2) // collision tussen enemy en map
		// this.enemy2.body.setCollideWorldBounds(true)
		//}


		//healthbar aanmaken
		this.healthbar = new HealthBar(this, this.player.x - 27, this.player.y - 19, 50)

		/**
		 * Enemy
		 */

		monsterLayer.forEachTile(tile => {
			if (tile.properties.CP_monster !== undefined) {

				const x = tile.getCenterX()
				const y = tile.getCenterY()
				const e = new Enemy(this, x, y, 'monsters', 1, tile.properties.CP_monster, 50).setScale(1.5)
				this.enemies.add(e)
				e.body.setCollideWorldBounds(true)
				e.setTint(0x09fc65)

			}

		})





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


		this.wall = this.physics.add.sprite(144, 2195, "wall").setScale(0.08);
		this.wall.setImmovable();
		this.wall.visible = false;
		this.physics.add.collider(this.enemies2, this.wall);
		this.physics.add.collider(this.enemies, this.wall);
		this.physics.add.collider(this.player, this.wall);

		this.wall2 = this.physics.add.sprite(135, 1460, "wall").setScale(0.08);
		this.wall2.setImmovable();
		this.wall2.visible = false;
		this.physics.add.collider(this.enemies2, this.wall2);
		this.physics.add.collider(this.enemies, this.wall2);
		this.physics.add.collider(this.player, this.wall2);

		this.wall3 = this.physics.add.sprite(875, 710, "wall").setScale(0.08);
		this.wall3.setImmovable();
		this.wall3.visible = true;
		this.physics.add.collider(this.enemies2, this.wall3);
		this.physics.add.collider(this.enemies, this.wall3);
		this.physics.add.collider(this.player, this.wall3);

		this.wall4 = this.physics.add.sprite(890, 80, "wall").setScale(0.1);
		this.wall4.visible = false;
		this.wall4.setImmovable();
		this.physics.add.collider(this.enemies2, this.wall4);
		this.physics.add.collider(this.enemies, this.wall4);
		this.physics.add.collider(this.player, this.wall4);
		this.wall4.flipY = true

		this.wall5 = this.physics.add.sprite(1448, 953, "wall").setScale(0.1);
		this.wall5.visible = false;
		this.wall5.setImmovable();
		this.physics.add.collider(this.enemies2, this.wall5);
		this.physics.add.collider(this.enemies, this.wall5);
		this.physics.add.collider(this.player, this.wall5);

		this.wall6 = this.physics.add.sprite(1476, 1833, "wall").setScale(0.1);
		this.wall6.visible = false;
		this.wall6.setImmovable();
		this.physics.add.collider(this.enemies2, this.wall6);
		this.physics.add.collider(this.enemies, this.wall6);
		this.physics.add.collider(this.player, this.wall6);

	} //end create

	startData() {

		const firebaseConfig = {
			apiKey: "AIzaSyAeBjdQt26lGPxqiuUeQvDGLiFfbEbYYS8",
			authDomain: "monsterhunter-d7680.firebaseapp.com",
			databaseURL: "https://monsterhunter-d7680-default-rtdb.europe-west1.firebasedatabase.app",
			projectId: "monsterhunter-d7680",
			storageBucket: "monsterhunter-d7680.appspot.com",
			messagingSenderId: "338059376056",
			appId: "1:338059376056:web:a1bb36e87101c4f2598b4d"
		};
		// if not initialized
		if (firebase.apps.length === 0) {
			// Initialize Firebase
			firebase.initializeApp(firebaseConfig);
		}

		//  let uidLocalStorage = localStorage.getItem('uid')
		let identifier = localStorage.getItem('ID')

		const db = firebase.firestore()
		const docRef = db.collection('users').doc(identifier);

		docRef.get().then((doc) => {
			if (doc.exists) {
				localStorage.setItem('gold', doc.data().gold)
			}
		}).catch((error) => {
			console.log("Error getting document:", error);
		});
	}

	updatePlayer(goldd, heal, posX, posY) {

		const firebaseConfig = {
			apiKey: "AIzaSyAeBjdQt26lGPxqiuUeQvDGLiFfbEbYYS8",
			authDomain: "monsterhunter-d7680.firebaseapp.com",
			databaseURL: "https://monsterhunter-d7680-default-rtdb.europe-west1.firebasedatabase.app",
			projectId: "monsterhunter-d7680",
			storageBucket: "monsterhunter-d7680.appspot.com",
			messagingSenderId: "338059376056",
			appId: "1:338059376056:web:a1bb36e87101c4f2598b4d"
		};

		// if not initialized
		if (firebase.apps.length === 0) {
			// Initialize Firebase
			firebase.initializeApp(firebaseConfig);
		}

		let identifier = localStorage.getItem('ID')
		const db = firebase.firestore()

		db.collection('users').doc(identifier)
			.update({
				gold: goldd,
				health: heal,
				positionX: posX,
				positionY: posY,

			})
	}


	//COLLISION HANDLING



	handlePlayerCoinCollision(p, c) {
		c.destroy()
		this.coinAmount += 1
		console.log(this.enemies.children.entries.length);
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
				if (time > this.lastFiredTime) {
					console.log('y:' + this.player.y + 'x: ' + this.player.x)
					// console.log(this.enemies.children.entries.length)
					this.lastFiredTime = time + 200
					this.projectiles.fireProjectile(this.player.x, this.player.y, this.player.facing)
					console.log(this.enemies.children.entries.length);
				}
			}
		}


		// /////////////////////////////////////////////////////////////////////////////////



		//lvl 1 done
		if (this.enemies.children.entries.length == 53 && this.questProcess == "start") {
			this.wall.destroy();
			this.questProcess = "dessert";
			console.log("lvl 1 monsters cleared")
		}


		if (this.player.y <= 2180 && this.player.y >= 2175) {
			console.log('enter dessert');
			

			console.log(this.enemies.children.entries.length);
			console.log("questProcess:" + " " + this.questProcess);
			console.log("health:" + " " + this.player.health);
			console.log("gold:" + " " + this.coinAmount);
			console.log("positionX:" + " " + this.player.x);
			console.log("positionY:" + " " + this.player.y);

			localStorage.setItem('gold', this.coinAmount);
			localStorage.setItem('health', this.player.health);
			localStorage.setItem('positionX', this.player.x);
			localStorage.setItem('positionY', this.player.y);
			localStorage.setItem('level', this.questProcess);

			this.updatePlayer(this.coinAmount, this.player.health, this.player.x, this.player.y)

		}

		if (this.player.y <= 2175 && this.player.y >= 2120 ) {
			// wall
			this.wall = this.physics.add.sprite(144, 2195, "wall").setScale(0.08);
			this.questProcess == "dessert"
			this.wall.setImmovable();
			this.wall.visible = false;
			this.physics.add.collider(this.enemies2, this.wall);
			this.physics.add.collider(this.enemies, this.wall);
			this.physics.add.collider(this.player, this.wall);
			console.log("wall enter dessert replaced")
		}




		////////////////////////////////////////////////////////////////////////////////////


		if (this.enemies.children.entries.length == 43 && this.questProcess == "dessert" && this.player.y >= 1381) {
			this.wall2.destroy();
			console.log("wall enter desert destroyed")
		}

		if (this.player.y <= 1488 && this.player.y >= 1430 && this.player.x < 925) {
			console.log('enter cave');
			this.questProcess = "cave";

			console.log(this.enemies.children.entries.length);
			console.log("questProcess:" + " " + this.questProcess);
			console.log("health:" + " " + this.player.health);
			console.log("gold:" + " " + this.coinAmount);
			console.log("positionX:" + " " + this.player.x);
			console.log("positionY:" + " " + this.player.y);

			localStorage.setItem('gold', this.coinAmount);
			localStorage.setItem('health', this.player.health);
			localStorage.setItem('positionX', this.player.x);
			localStorage.setItem('positionY', this.player.y);
			localStorage.setItem('level', this.questProcess);

			this.updatePlayer(this.coinAmount, this.player.health, this.player.x, this.player.y)
		}

		if (this.player.y <= 1445) {
			// wall
			this.wall = this.physics.add.sprite(135, 1460, "wall").setScale(0.08);
			this.wall.setImmovable();
			this.wall.visible = false;
			this.physics.add.collider(this.enemies2, this.wall);
			this.physics.add.collider(this.enemies, this.wall);
			this.physics.add.collider(this.player, this.wall);

		}


		// // //////////////////////////////////////////////////////////////////////////////////////


		if (this.enemies.children.entries.length == 34 && this.questProcess == "cave") {
			this.wall3.destroy();
		}

		if (this.player.y <= 730 && this.player.y >= 690) {
			console.log('enter ice');
			this.questProcess = "ice";

			console.log(this.enemies.children.entries.length);
			console.log("questProcess:" + " " + this.questProcess);
			console.log("health:" + " " + this.player.health);
			console.log("gold:" + " " + this.coinAmount);
			console.log("positionX:" + " " + this.player.x);
			console.log("positionY:" + " " + this.player.y);


			localStorage.setItem('gold', this.coinAmount);
			localStorage.setItem('health', this.player.health);
			localStorage.setItem('positionX', this.player.x);
			localStorage.setItem('positionY', this.player.y);
			localStorage.setItem('level', this.questProcess);

			this.updatePlayer(this.coinAmount, this.player.health, this.player.x, this.player.y)
		}

		if (this.player.y <= 685) {
			// wall
			this.wall = this.physics.add.sprite(875, 710, "wall").setScale(0.08);
			this.wall.setImmovable();
			this.wall.visible = false;
			this.physics.add.collider(this.enemies2, this.wall);
			this.physics.add.collider(this.enemies, this.wall);
			this.physics.add.collider(this.player, this.wall);
		}

		//Ice -> GreenHell
		if (this.player.y > 60 && this.player.x > 800 && this.enemies.children.entries.length == 23 && this.questProcess == "ice") {
			// wall
			this.wall4.destroy();
			this.wall4 = this.physics.add.sprite(890, 80, "wall").setScale(0.1);
			this.physics.add.collider(this.enemies2, this.wall4);
			this.physics.add.collider(this.enemies, this.wall4);
			this.physics.add.collider(this.player, this.wall4);
			this.wall4.flipY = true
			this.wall4.visible = false
			
		}	

		if (this.player.y < 120 && this.player.x > 970) {
			// wall
			this.wall4.destroy();
			this.wall4 = this.physics.add.sprite(890, 80, "wall").setScale(0.1);
			this.physics.add.collider(this.enemies2, this.wall4);
			this.physics.add.collider(this.enemies, this.wall4);
			this.physics.add.collider(this.player, this.wall4);
			this.wall4.setImmovable();
			this.wall4.flipY = true
			this.wall4.visible = true
			this.questProcess = "greenhell"
			
		}	

		//Green Hell -> Yellowstone
		if (this.questProcess == "greenhell" && this.enemies.children.entries.length == 17) {
			// wall
			this.wall5.destroy();
			this.wall5 = this.physics.add.sprite(1448, 953, "wall").setScale(0.1);
			this.physics.add.collider(this.enemies2, this.wall5);
			this.physics.add.collider(this.enemies, this.wall5);
			this.physics.add.collider(this.player, this.wall5);
			this.wall5.visible = true
		}	

		
		//Yellowstone -> Red hell
		if (this.player.y >= 1900 && this.player.x > 1400) {
			// wall
			this.wall6.destroy();
			this.wall6 = this.physics.add.sprite(1476, 1833, "wall").setScale(0.1);
			this.wall6.visible = false;
			this.physics.add.collider(this.enemies2, this.wall6);
			this.physics.add.collider(this.enemies, this.wall6);
			this.physics.add.collider(this.player, this.wall6);
			this.wall6.setImmovable();
			
		}	




		// //////////////////////////////////////////////////////////////////////////////////////


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

	} //end update




}; //end gameScene