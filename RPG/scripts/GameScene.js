class GameScene extends Phaser.Scene {
	constructor() {
		super('gameScene')
	}

//class GameScene extends Phaser.Scene {


    preload() {
        this.cursors
        // this.cameras.main.setBackgroundColor('0x9900e3')
		// verchillende tiles loaden
        this.load.image('tiles', '../assets/Tilemap/dungeon.png')
		//map dat we in Tiled hebben gemaakt loaden
        this.load.tilemapTiledJSON('map', '../scripts/dungeonMap.json')
		//characters loaden
        this.load.spritesheet('characters', '../assets/characters.png', {
            frameWidth: 16,
            frameHieght: 16
        })
		// we gebruiken atlas omdat we zowel de .png als de .json file loaden
		this.load.atlas('sprite', 'assets/skeleton.png', 'assets/skeleton.json')

        this.player
        this.keys

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
		// ??????????????????????????
        this.physics.world.bounds.width = map.widthInPixels
        this.physics.world.bounds.height = map.heightInPixels
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        
        /**
         * This is if you want to see the collission layer (world)
         */
		//const debugGraphics = this.add.graphics().setAlpha(0.2)
        // worldLayer.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(0, 0, 255),
        //     faceColor: new Phaser.Display.Color(0, 255, 0, 255)
        // })

        /**
         * Player
         */
		// player instantieëren
        this.player = new Player(this, 200, 120, 'characters')
		// collision tussen player en wereld inschakelen
		this.player.body.setCollideWorldBounds(true)
        this.physics.add.collider(this.player, worldLayer)
		// focus op player bij beweging
        this.cameras.main.startFollow(this.player, true, 0.8, 0.8)

		this.anims.create({
			key: 'skeletonLeft',
			frames: this.anims.generateFrameNames('sprite', {
				prefix: 'skeleton-walk-down/',
				suffix: '',
				start: 1,
				end: 3,
				zeroPad: 2
			}),
			frameRate: 6,
			repeat: -1
		})


		this.add.sprite(280, 250, 'sprite').anims.play('skeletonLeft')
        


    } //end create

 
    update(time, delta) {
		this.player.update();

    } //end update


};//end gameScene