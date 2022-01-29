const MenuScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "menuScene" });
    },
    preload: function() {
		this.load.image("background", "assets/menu/back.png");
		this.load.image('options', 'assets/menu/options_button.png')
		this.load.image('play', 'assets/menu/play_button.png')
		this.load.image('diamond', 'assets/menu/diamond.png')
		this.load.image('logo', 'assets/menu/logo.png')
		//this.load.audio('introMusic', 'assets/audio/Dark-Ages.mp3')

		//loading bar aanmaken
		let loadingBar = this.add.graphics({
			fillStyle: {
				color: 0xffffff
			} 		
		})
		this.load.on('progress', (percent)=>{
			loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 5);
			console.log(percent);
		})

		//loading bar display
		for (let i = 0; i < 500; i++){
			this.load.spritesheet('characters' + i, '../assets/characters.png', {
				frameWidth: 16,
				frameHieght: 16
			}); }

		// this.load.on('complete', ()=>{
		// 	this.scene.start('menuScene', "hello from LoadScene");
		// })
        
    },
    create: function() {
		this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.20, "logo").setDepth(1);

		let playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, "play").setDepth(1);

		let optionButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, "options").setDepth(1);

        this.add.image(0, 0, "background").setOrigin(0);

		playButton.setInteractive();
		optionButton.setInteractive();
		// hover sprite
		let hoverSprite = this.add.sprite(390, 425, 'diamond')
		let hoversprite2 = this.add.sprite(400, 525, 'diamond')
		hoverSprite.setScale(0.5)
		hoverSprite.setVisible(false)
		hoversprite2.setScale(0.5)
		hoversprite2.setVisible(false)

		// hover effects
		playButton.on('pointerover', ()=>{
			hoverSprite.setVisible(true)
		})

		playButton.on('pointerout', ()=>{
			hoverSprite.setVisible(false)
		})

		optionButton.on('pointerover', ()=>{
			hoversprite2.setVisible(true)
		})

		optionButton.on('pointerout', ()=>{
			hoversprite2.setVisible(false)
		})

    },
    update: function() {}
});

