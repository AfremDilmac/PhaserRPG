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
		this.load.image("down", "assets/menu/down.png")
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
		this.load.image("exit", "assets/menu/exit.png")
		this.load.image("next", "assets/menu/next.png")
		this.load.image("yes", "assets/text/yes.png")
		this.load.image("no", "assets/text/no.png")
		this.load.image("shop-salad", "assets/text/shop-salad.png")
		this.load.image("shop-negative", "assets/text/shop-negative.png")

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
		this.down = true
		this.up
		this.txtBox
		this.foodArrow
		this.coins
		this.coinAmount = 0
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
			}
		}).catch((error) => {
			console.log("Error getting document:", error);
		});
	}

	updatePlayer(goldd, heal) {

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
				health: heal
			})
	}

	create() {


		//map object aanmaken met key 'map'
		const map = this.make.tilemap({
			key: 'shop-map'
		})
		this.cameras.main.zoom = 2.5;

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
		let fsHealth = parseInt(localStorage.getItem('health'));
		let fsGold = parseInt(localStorage.getItem('gold'));
		//Om een player aan te maken gebruiken we deze code => kies de x, y positie de atlas die je wilt, en de health
		this.player = new Player(this, 210, 270, 'player', fsHealth, fsGold).setScale(0.5)
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
		this.healthbar = new HealthBar(this, this.player.x - 27, this.player.y - 19, this.player.health)
		
		//////////////////////:
		// coint text

		let merchant = this.add.image(160, 62, "merchant").setDepth(1);
		
		this.foodArrow = this.add.image(110, 165, "down").setDepth(1).setScale(0.1);
		this.foodArrow.setInteractive()
		this.foodArrow.on('pointerdown', () =>{
			if (this.player.x >= 101 && this.player.y > 160 && this.player.x <= 138 && this.player.y <= 210 ) {
				console.log('Buy food')
				this.txtBox = this.add.image(200, 160, "shop-salad").setDepth(1000).setScale(0.25);
				this.yes = this.add.image(160, 175, "yes").setDepth(2000).setScale(0.2);
				this.no = this.add.image(240, 175, "no").setDepth(2000).setScale(0.2);
				this.no.setInteractive()
				this.yes.setInteractive()
				
				this.no.on('pointerdown', () =>{
					this.txtBox.destroy();
					this.no.destroy();
					this.yes.destroy();
				})

				this.yes.on('pointerdown', () =>{

					let price = 10;
					
					if (this.player.gold >= price) {
						this.player.health = 50
						localStorage.setItem('health', 50)
						this.player.gold -= price;
						localStorage.setItem('gold', this.player.gold);
						this.updatePlayer(this.player.gold, this.player.health);
						this.no.destroy();
						this.yes.destroy();
						this.txtBox.destroy();
					}
					else{
						this.txtBox.destroy();
						this.txtBox = this.add.image(200, 160, "shop-negative").setDepth(1000).setScale(0.25);
						this.no.destroy();
						this.yes.destroy();
						this.exit = this.add.image(290, 130, "exit").setDepth(1001).setScale(0.2);
						this.exit.setInteractive()
						this.exit.on('pointerdown', () =>{
							this.txtBox.destroy();
							this.exit.destroy();
						})
					}
				})
			}
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
		this.healthbar.updateHealth(this.player.health);
		// als er op space gedrukto wordt schieten we een bullet met een interval van 200 ms
		// en we houden rekening met de positie van de player en de richting waar naar hij kijkt 
		this.player.update()
		// console.log('X: ' + this.player.x + 'Y: ' + this.player.y)
	} //end update


}; //end gameScene