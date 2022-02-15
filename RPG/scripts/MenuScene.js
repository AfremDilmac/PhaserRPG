class MenuScene extends Phaser.Scene {
	constructor() {
		super('menuScene')
	}

    preload() {
		this.load.image("background", "assets/menu/back.png");
		this.load.image('options', 'assets/menu/options_button.png')
		this.load.image('play', 'assets/menu/play_button.png')
		this.load.image('diamond', 'assets/menu/diamond.png')
		this.load.image('option', 'assets/menu/option.png')
		this.load.image('logo', 'assets/menu/logo.png')
		this.load.audio('introMusic', './assets/audio/Dark-Ages.mp3')

		//loading bar aanmaken
		let loadingBar = this.add.graphics({
			fillStyle: {
				color: 0xffffff
			} 		
		})
		this.load.on('progress', (percent)=>{
			loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 5);
		})

		//loading bar display
		for (let i = 0; i < 500; i++){
			this.load.spritesheet('characters' + i, '../assets/characters.png', {
				frameWidth: 16,
				frameHieght: 16
			}); }
        
    }
    create() {
		
		this.music =  this.sound.add('introMusic', {
			volume: 0.2,
			loop: true
		})
	
		if (!this.sound.locked)
		{
			// already unlocked so play
			this.music.play()
		}
		else
		{
			// wait for 'unlocked' to fire and then play
			this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
				this.music.play()
			})
		}
		this.sound.pauseOnBlur = true
		let logo = this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.20, "logo").setDepth(1);
		logo.setScale(0.5)

		let playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, "play").setDepth(1);
		playButton.setScale(0.5)

		let optionButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 50, "options").setDepth(1);
		optionButton.setScale(0.5)
        this.add.image(0, 0, "background").setOrigin(0);

		playButton.setInteractive();
		optionButton.setInteractive();
		// hover sprite
		let hoverSprite = this.add.sprite(150, 150, 'diamond')
		let hoversprite2 = this.add.sprite(150, 200, 'option')
		hoverSprite.setScale(0.3)
		hoverSprite.setVisible(false)
		hoversprite2.setScale(0.05)
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

		playButton.on('pointerdown', function () {

			this.scene.start('gameScene');
			this.music.pause('introMusic');
	
		}, this);

		optionButton.on('pointerdown', function () {

			this.scene.start('optionScene');
			this.music.pause('introMusic');
	
		}, this);
	


    }
    update() {}
};

