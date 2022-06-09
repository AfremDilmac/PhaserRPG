class InnerHouseScene extends Phaser.Scene {
	constructor() {
		super('innerHouseScene')
	}

	preload() {
		// localStorage.removeItem('gold');
		// localStorage.removeItem('health');
		// localStorage.removeItem('positionX');
		// localStorage.removeItem('positionY');

		this.startData();
		this.cursors
		// this.cameras.main.setBackgroundColor('0x9900e3')
		// verchillende tiles loaden
		this.load.image('house-tiles', 'assets/Tilemap/Tileset.png')
		this.load.image("butcher", "assets/npc/butcher.png")
		this.load.image("exclemote", "assets/npc/emotes/exclamation-mark.png")
		this.load.image("questemote", "assets/npc/emotes/question-mark.png")
		this.load.image("speakemote", "assets/npc/emotes/speach.png")
		this.load.image("wall", "assets/items/wall.jpg")
		this.load.image("beta", "assets/menu/beta.png")
		//bullet loaden
		this.load.image('bullet', 'assets/items/bullet.png')
		//minimap loaden
		this.load.image('minimap', 'assets/minimap/innerVillageMap-minimap.png')
		//particle loaden
		this.load.image('particle', 'assets/items/particle.png')
		//shop button
		this.load.image('btn-shop', 'assets/menu/shopping.png')
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

		//boss loaden
		this.load.spritesheet('boss', 'assets/sprites/boss.png', {
			frameWidth: 50,
			frameHieght: 50
		})
		// coin loaden
		this.load.spritesheet('coin', 'assets/pickup/FullCoins.png', {
			frameWidth: 16,
			frameHieght: 16
		})
		this.load.atlas('monsters', 'assets/monsters.png', 'assets/monsters.json')

		
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
		this.questStarted = false;
		this.wall
		this.wall2
		this.wall3
		this.wall4
		this.wall5
		this.wall6
		this.wall7
		this.wall8
		this.coins
		this.questProcces = "start"
		this.shopbtn1
		this.shopbtn2
		this.shopbtn3
		this.shopbtn4
		this.shopbtn5
		this.shopbtn6
		this.shopbtn7

		/**
		 * Virtual joystick
		 */
		var url;

		url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
		this.load.plugin('rexvirtualjoystickplugin', url, true);



	} //end preload

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

		
		let identifier = localStorage.getItem('ID')

		const db = firebase.firestore()
		const docRef = db.collection('users').doc(identifier);

		docRef.get().then((doc) => {
			if (doc.exists) {
				localStorage.setItem('gold', doc.data().gold)
				localStorage.setItem('health', doc.data().health)
				localStorage.setItem('positionX', doc.data().positionX)
				localStorage.setItem('positionY', doc.data().positionY)
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
		let fsHealth = parseInt(localStorage.getItem('health'));
		let fsPosX = parseFloat(localStorage.getItem('positionX')); 
		let fsPosY = parseFloat(localStorage.getItem('positionY')); 
		let fsGold = parseInt(localStorage.getItem('gold'));
		//Om een player aan te maken gebruiken we deze code => kies de x, y positie de atlas die je wilt, en de health
		this.player = new Player(this, fsPosX , fsPosY, 'player', fsHealth, fsGold).setScale(0.5)
		// this.updatePlayer(this.player.gold, this.player.health, this.player.x, this.player.y)
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
		// if (this.questProcces == "start") {
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
		// if (this.questProcces == "dessert") {
		// 	for (let i = 0; i < 5; i++) {
		// 		const element = new Enemy(this, 180 , 1400 , 'monsters', 5, 'ghost')
		// 		element.body.setCollideWorldBounds(true)
		// 		element.setTint(0x999999)
		// 		this.enemies2.add(element)
		// 	}
			
		//}
		////////////////////////////////////////////////////////////////////////////////
		// if (this.questProcces == "cave") {
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
				const e = new Enemy(this, x, y, 'monsters', 10, tile.properties.CP_monster, 50).setScale(1.5)
				this.enemies.add(e)
				e.body.setCollideWorldBounds(true)
				e.setTint(0x09fc65)
			}
		})

		for (let i = 0; i < 5; i++) {
			const element = new EnemyFollow(this, 1464 + i * 2, 2243 + i *3 , 'monsters', 50, 'skeleton', 200)
			element.body.setCollideWorldBounds(true)
			element.setTint(0x808080)
			element.setScale(3)
			this.enemies2.add(element)
		}

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
		this.physics.add.collider(this.player, worldLayer)
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

		/**
		 * Shop btns
		 */
		 this.shopbtn1 = this.add.image(51, 2221, "btn-shop").setDepth(1).setScale(0.35);
		 this.shopbtn1.setInteractive();
		 this.shopbtn1.on('pointerdown', () => {
			localStorage.setItem('gold', this.player.gold);
			localStorage.setItem('health', this.player.health);
			localStorage.setItem('positionX', this.player.x);
			localStorage.setItem('positionY', this.player.y);

			this.updatePlayer(this.player.gold, this.player.health, this.player.x, this.player.y)
			this.scene.start('Shop')
		 })

		 this.shopbtn2 = this.add.image(40, 1483, "btn-shop").setDepth(1).setScale(0.35);
		 this.shopbtn2.setInteractive();
		 this.shopbtn2.on('pointerdown', () => {
			localStorage.setItem('gold', this.player.gold);
			localStorage.setItem('health', this.player.health);
			localStorage.setItem('positionX', this.player.x);
			localStorage.setItem('positionY', this.player.y);

			this.updatePlayer(this.player.gold, this.player.health, this.player.x, this.player.y)
			this.scene.start('Shop')
		 })

		 this.shopbtn3 = this.add.image(785, 727, "btn-shop").setDepth(1).setScale(0.35);
		 this.shopbtn3.setInteractive();
		 this.shopbtn3.on('pointerdown', () => {
			localStorage.setItem('gold', this.player.gold);
			localStorage.setItem('health', this.player.health);
			localStorage.setItem('positionX', this.player.x);
			localStorage.setItem('positionY', this.player.y);

			this.updatePlayer(this.player.gold, this.player.health, this.player.x, this.player.y)
			this.scene.start('Shop')
		 })

		 this.shopbtn4 = this.add.image(848, 33, "btn-shop").setDepth(1).setScale(0.35);
		 this.shopbtn4.setInteractive();
		 this.shopbtn4.on('pointerdown', () => {
			localStorage.setItem('gold', this.player.gold);
			localStorage.setItem('health', this.player.health);
			localStorage.setItem('positionX', this.player.x);
			localStorage.setItem('positionY', this.player.y);

			this.updatePlayer(this.player.gold, this.player.health, this.player.x, this.player.y)
			this.scene.start('Shop')
		 })

		 this.shopbtn5 = this.add.image(1364, 973, "btn-shop").setDepth(1).setScale(0.35);
		 this.shopbtn5.setInteractive();
		 this.shopbtn5.on('pointerdown', () => {
			localStorage.setItem('gold', this.player.gold);
			localStorage.setItem('health', this.player.health);
			localStorage.setItem('positionX', this.player.x);
			localStorage.setItem('positionY', this.player.y);

			this.updatePlayer(this.player.gold, this.player.health, this.player.x, this.player.y)
			this.scene.start('Shop')
		 })

		 this.shopbtn6 = this.add.image(1397, 1861, "btn-shop").setDepth(1).setScale(0.35);
		 this.shopbtn6.setInteractive();
		 this.shopbtn6.on('pointerdown', () => {
			localStorage.setItem('gold', this.player.gold);
			localStorage.setItem('health', this.player.health);
			localStorage.setItem('positionX', this.player.x);
			localStorage.setItem('positionY', this.player.y);

			this.updatePlayer(this.player.gold, this.player.health, this.player.x, this.player.y)
			this.scene.start('Shop')
		 })


		this.wall = this.physics.add.sprite(144, 2195, "wall").setScale(0.08);
	
		this.wall.visible = false;
		this.physics.add.collider(this.enemies2, this.wall);
		this.physics.add.collider(this.enemies, this.wall);
	

		this.wall2 = this.physics.add.sprite(135, 1460, "wall").setScale(0.08);
	
		this.wall2.visible = false;
		this.physics.add.collider(this.enemies2, this.wall2);
		this.physics.add.collider(this.enemies, this.wall2);


		this.wall3 = this.physics.add.sprite(875, 710, "wall").setScale(0.08);
	
		this.wall3.visible = false;
		this.physics.add.collider(this.enemies2, this.wall3);
		this.physics.add.collider(this.enemies, this.wall3);
	

		this.wall4 = this.physics.add.sprite(890, 80, "wall").setScale(0.1);
		this.wall4.visible = false;
	
		this.physics.add.collider(this.enemies2, this.wall4);
		this.physics.add.collider(this.enemies, this.wall4);
	
		this.wall4.flipY = true

		this.wall5 = this.physics.add.sprite(1448, 953, "wall").setScale(0.1);
		this.wall5.visible = false;
	
		this.physics.add.collider(this.enemies2, this.wall5);
		this.physics.add.collider(this.enemies, this.wall5);
	

		this.wall6 = this.physics.add.sprite(1476, 1833, "wall").setScale(0.1);
		this.wall6.visible = false;
	
		this.physics.add.collider(this.enemies2, this.wall6);
		this.physics.add.collider(this.enemies, this.wall6);
	

		this.wall7 = this.physics.add.sprite(1478, 2050, "wall").setScale(0.1);
		this.wall7.visible = false;
	
		this.physics.add.collider(this.enemies2, this.wall7);
		this.physics.add.collider(this.enemies, this.wall7);

		this.wall8 = this.physics.add.sprite(1471, 2476, "wall").setScale(0.1);
		this.wall8.visible = false;
	
		this.physics.add.collider(this.enemies2, this.wall8);
		this.physics.add.collider(this.enemies, this.wall8);

	} //end create




	//COLLISION HANDLING



	handlePlayerCoinCollision(p, c) {
		c.destroy()
		this.player.gold += 1
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
			this.player.gold = this.player.gold + 0.5

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
		this.player.gold = this.player.gold + 0.5
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
					console.log()
					this.lastFiredTime = time + 200
					this.projectiles.fireProjectile(this.player.x, this.player.y, this.player.facing)
				}
			}
		}


		// /////////////////////////////////////////////////////////////////////////////////


		//lvl 1 done
		if (this.questProcces == "start") {
			this.wall.destroy();
			this.questProcces = "dessert";
		}


		if (this.player.y <= 2180 && this.player.y >= 2175) {
			
			// console.log(this.enemies.children.entries.length);
			console.log("questProcess:" + " " + this.questProcces);
			// console.log("health:" + " " + this.player.health);
			// console.log("gold:" + " " + this.player.gold);
			// console.log("positionX:" + " " + this.player.x);
			// console.log("positionY:" + " " + this.player.y);

			localStorage.setItem('gold', this.player.gold);
			localStorage.setItem('health', this.player.health);
			localStorage.setItem('positionX', this.player.x);
			localStorage.setItem('positionY', this.player.y);

			this.updatePlayer(this.player.gold, this.player.health, this.player.x, this.player.y)

		}

		if (this.player.y <= 2175 && this.player.y >= 2120 ) {
			// wall
			this.wall = this.physics.add.sprite(144, 2195, "wall").setScale(0.08);
			
			this.wall.visible = false;
			this.physics.add.collider(this.enemies2, this.wall);
			this.physics.add.collider(this.enemies, this.wall);
		
		}




		////////////////////////////////////////////////////////////////////////////////////


		if (this.questProcces == "dessert" && this.player.y >= 1381) {
			
		}

		if (this.player.y <= 1488 && this.player.y >= 1430 && this.player.x < 925) {
			this.questProcces = "cave";

			// console.log(this.enemies.children.entries.length);
			// console.log("questProcess:" + " " + this.questProcces);
			// console.log("health:" + " " + this.player.health);
			// console.log("gold:" + " " + this.player.gold);
			// console.log("positionX:" + " " + this.player.x);
			// console.log("positionY:" + " " + this.player.y);

			localStorage.setItem('gold', this.player.gold);
			localStorage.setItem('health', this.player.health);
			localStorage.setItem('positionX', this.player.x);
			localStorage.setItem('positionY', this.player.y);

			this.updatePlayer(this.player.gold, this.player.health, this.player.x, this.player.y)
		}

		if (this.player.y <= 1445) {
			// wall
			this.wall = this.physics.add.sprite(135, 1460, "wall").setScale(0.08);
	
			this.wall.visible = false;
			this.physics.add.collider(this.enemies2, this.wall);
			this.physics.add.collider(this.enemies, this.wall);
			

		}


		// // //////////////////////////////////////////////////////////////////////////////////////


		if (this.questProcces == "cave") {
			this.wall3.destroy();
		}

		if (this.player.y <= 730 && this.player.y >= 690) {
			this.questProcces = "ice";

			// console.log(this.enemies.children.entries.length);
			// console.log("questProcess:" + " " + this.questProcces);
			// console.log("health:" + " " + this.player.health);
			// console.log("gold:" + " " + this.player.gold);
			// console.log("positionX:" + " " + this.player.x);
			// console.log("positionY:" + " " + this.player.y);


			localStorage.setItem('gold', this.player.gold);
			localStorage.setItem('health', this.player.health);
			localStorage.setItem('positionX', this.player.x);
			localStorage.setItem('positionY', this.player.y);

			this.updatePlayer(this.player.gold, this.player.health, this.player.x, this.player.y)
		}

		if (this.player.y <= 685) {
			// wall
			this.wall = this.physics.add.sprite(875, 710, "wall").setScale(0.08);
			
			this.wall.visible = false;
			this.physics.add.collider(this.enemies2, this.wall);
			this.physics.add.collider(this.enemies, this.wall);
		
		}

		////////////////////////////////////////////////////////////////////////////////////


		//Ice -> GreenHell
		if (this.player.y > 60 && this.player.x > 800 && this.questProcces == "ice") {
			// wall
			this.wall4.destroy();
			this.wall4 = this.physics.add.sprite(890, 80, "wall").setScale(0.1);
			this.physics.add.collider(this.enemies2, this.wall4);
			this.physics.add.collider(this.enemies, this.wall4);
		
			this.wall4.flipY = true
			this.wall4.visible = false
			
		}	

		if (this.player.y < 120 && this.player.x > 970) {
			// wall
			this.wall4.destroy();
			this.wall4 = this.physics.add.sprite(890, 80, "wall").setScale(0.1);
			this.physics.add.collider(this.enemies2, this.wall4);
			this.physics.add.collider(this.enemies, this.wall4);

			
			this.wall4.flipY = true
			this.wall4.visible = false
			this.questProcces = "greenhell"
			console.log(this.questProcces)
			
		}

		////////////////////////////////////////////////////////////////////////////////////


		//Green Hell -> Yellowstone
		if (this.player.x > 1000 && this.player.y > 855 && this.player.y < 980) {
			// wall
			this.wall5.destroy();
			this.wall5 = this.physics.add.sprite(1448, 953, "wall").setScale(0.1);
			this.physics.add.collider(this.enemies2, this.wall5);
			this.physics.add.collider(this.enemies, this.wall5);
			
			this.wall5.visible = false
		}	

		//Green Hell -> Yellowstone
		if (this.player.x > 1000 && this.player.y > 1000) {
			// wall
			this.wall5.destroy();
			this.wall5 = this.physics.add.sprite(1448, 953, "wall").setScale(0.1);
			this.physics.add.collider(this.enemies2, this.wall5);
			this.physics.add.collider(this.enemies, this.wall5);
			
		
			this.wall5.visible = false
		}	
		

		////////////////////////////////////////////////////////////////////////////////////

		
		//Yellowstone -> Red hell
		if (this.player.y >= 1200 && this.player.x > 1000) {
			// wall
			this.wall6.destroy();
			this.wall6 = this.physics.add.sprite(1476, 1833, "wall").setScale(0.1);
			this.wall6.visible = false;
			this.physics.add.collider(this.enemies2, this.wall6);
			this.physics.add.collider(this.enemies, this.wall6);
			
			
			
		}	

		if (this.player.y >= 1200 && this.player.y <= 1850 && this.player.x > 1000 ) {
			// wall
			this.wall6.destroy();
			this.wall6 = this.physics.add.sprite(1476, 1833, "wall").setScale(0.1);
			this.wall6.visible = false;
			this.physics.add.collider(this.enemies2, this.wall6);
			this.physics.add.collider(this.enemies, this.wall6);
			
		}	

		if (this.player.y >= 1908 && this.player.x > 1000 ) {
			// wall
			this.wall6.destroy();
			this.wall6 = this.physics.add.sprite(1476, 1833, "wall").setScale(0.1);
			this.wall6.visible = false;
			this.physics.add.collider(this.enemies2, this.wall6);
			this.physics.add.collider(this.enemies, this.wall6);
		
			
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
		if (this.enemies2.children.entries.length < 1 && this.player.y > 2069 && this.player.x > 970) {
			console.log("end game")
			// this.input.keyboard.enabled = false
			this.player.x = 1471
			this.player.y = 2240
			this.beta = this.add.image(1460, 2240, "beta").setDepth(1).setScale(0.85);
			
		}
	} //end update




}; //end gameScene