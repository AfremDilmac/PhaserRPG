class Player extends Entity {
	constructor(scene, x, y, texturekey, health){
        super(scene, x, y, texturekey, 'Player')


		const animFrameRate = 6
		const anims = scene.anims
		this.health = health
		this.facing = 'down'
		// hier gebeurt de animatie van onze character aan de hand van frames
		//player-left = frames nr 15 t.e.m 17 zie characters.png
		//player-right = frames nr 27 t.e.m 29 zie characters.png
		//player-up = frames nr 39 t.e.m 41 zie characters.png
		//player-down = frames nr 3 t.e.m 5 zie characters.png
        anims.create({
            key: 'player-left',
            frames: anims.generateFrameNumbers(this.texturekey, {
                // start: 3,
                // end: 5
                start: 15,
                end: 17
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        anims.create({
            key: 'player-right',
            frames: anims.generateFrameNumbers(this.texturekey, {
                // start: 6,
                // end: 8
                start: 27,
                end: 29
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        anims.create({
            key: 'player-up',
            frames: anims.generateFrameNumbers(this.texturekey, {
                // start: 9,
                // end: 11
                start: 39,
                end: 41
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        anims.create({
			key: 'player-down',
            frames: anims.generateFrameNumbers(this.texturekey, {
                // start: 0,
                // end: 2
                start: 3,
                end: 5
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
		// startposities voor elke richting
        this.idleFrame = {
            down: 4,
            left: 16,
            right: 28,
            up: 40
        }
		//als de player niet beweegt willen we niet dat hij in walking position staat zie guy.png voor verschillende posities
        this.setFrame(this.idleFrame.down)

		        // this.cursors = this.input.keyboard.createCursorKeys()
		//controls definieëren
        const {LEFT,RIGHT,UP,DOWN,Z,Q,S,D} = Phaser.Input.Keyboard.KeyCodes
        this.keys = scene.input.keyboard.addKeys({
            left: LEFT,
            right: RIGHT,
            up: UP,
            down: DOWN,
            z: Z,
            q: Q,
            s: S,
            d: D
        })
        console.log(scene)

        //Joystick plugin
        this.joyStick = scene.plugins.get('rexvirtualjoystickplugin').add(scene, {
            x: 350,
            y: 250,
            radius: 25,
            base: scene.add.circle(0, 0, 30, 0x888888),
            thumb: scene.add.circle(0, 0, 15, 0xcccccc),

        })

        //Rectangle shooting function
        var onPointerDown = function() {
            this.isShooting = true;
          }.bind(this);
          
          var onPointerUp = function() {
            this.isShooting = false;
          }.bind(this);
          
          scene.add.rectangle(60, 250, 70, 50, 0x888888).setInteractive().on('pointerup', onPointerUp).on('pointerdown', onPointerDown);
          
    }
// end constructor

	update(){
		const {keys} = this //output: this.keys
        const speed = 100
		//positie in een var steken, gebruikt voor idle animation (zie lijn 189 t.e.m 200 )
        const previousVelocity = this.body.velocity.clone()
		// player stopt als we op geen enekel arrow drukken
        this.body.setVelocity(0)
        //movement
		// drukken op linker pijl = positionX -100 (zie speed var, lijn 144 )
		// drukken op rechter pijl = positionX +100 (zie speed var, lijn 144 )
        if (keys.left.isDown || keys.q.isDown || this.joyStick.left) {
            this.body.setVelocityX(-speed)
        } else if (keys.right.isDown || keys.d.isDown || this.joyStick.right) {
            this.body.setVelocityX(speed)
        }

		// drukken op boven pijl = positionY -100 (zie speed var, lijn 144 )
		// drukken op rechter pijl = positionY +100 (zie speed var, lijn 144 )
        if (keys.up.isDown || keys.z.isDown || this.joyStick.up) {
            this.body.setVelocityY(-speed)
        } else if (keys.down.isDown || keys.s.isDown || this.joyStick.down) {
            this.body.setVelocityY(speed)
        }
		//dit zorgt ervoor dat de speed niet groter wordt bij een diagonale beweging 
        this.body.velocity.normalize().scale(speed)

        //animations
		//de player kijkt in een verschillende richting op basis van de controls en anims (zie lijn 88 t.e.m 117)
		//rechter pijl = player kijkt naar oven etc..
        if (keys.up.isDown || keys.z.isDow || this.joyStick.up) {
            this.anims.play('player-up', true)
        } else if (keys.down.isDown || keys.s.isDown || this.joyStick.down) {
            this.anims.play('player-down', true)
        } else
        if (keys.left.isDown || keys.q.isDown || this.joyStick.left) {
            this.anims.play('player-left', true)
        } else if (keys.right.isDown || keys.d.isDown || this.joyStick.right) {
            this.anims.play('player-right', true)
        } else {
            this.anims.stop()
        }
 

        //set idle animations
		//dit zorgt ervoor dat de player blijft kijken in de richting van de laatste gedrukte arrow  
        if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
            //show idle anims
            if (previousVelocity.x < 0) {
                this.setFrame(this.idleFrame.left)
            } else if (previousVelocity.x > 0) {
                this.setFrame(this.idleFrame.right)
            } else if (previousVelocity.y < 0) {
                this.setFrame(this.idleFrame.up)
            } else if (previousVelocity.y > 0) {
                this.setFrame(this.idleFrame.down)
            }
        }

		if(this.anims.currentAnim){
			this.facing = this.anims.currentAnim.key.split('-')[1]
		}

	}
}