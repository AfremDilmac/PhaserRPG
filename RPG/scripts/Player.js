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

        this.joyStick = this.plugins.get('rexVirtualJoyStick').add(this, {
            x: 400,
            y: 300,
            radius: 100,
            // base: this.add.circle(0, 0, 100, 0x888888),
            // thumb: this.add.circle(0, 0, 50, 0xcccccc),
            // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
            // forceMin: 16,
            // enable: true
        })
            .on('update', this.dumpJoyStickState, this);

        this.text = this.add.text(0, 0);
        this.dumpJoyStickState();
    }

    dumpJoyStickState() {
        var cursorKeys = this.joyStick.createCursorKeys();
        var s = 'Key down: ';
        for (var name in cursorKeys) {
            if (cursorKeys[name].isDown) {
                s += `${name} `;
            }
        }

        s += `
Force: ${Math.floor(this.joyStick.force * 100) / 100}
Angle: ${Math.floor(this.joyStick.angle * 100) / 100}
`;

        s += '\nTimestamp:\n';
        for (var name in cursorKeys) {
            var key = cursorKeys[name];
            s += `${name}: duration=${key.duration / 1000}\n`;
        }

        this.text.setText(s);
    


	}	// end constructor

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
        if (keys.left.isDown || keys.q.isDown) {
            this.body.setVelocityX(-speed)
        } else if (keys.right.isDown || keys.d.isDown) {
            this.body.setVelocityX(speed)
        }

		// drukken op boven pijl = positionY -100 (zie speed var, lijn 144 )
		// drukken op rechter pijl = positionY +100 (zie speed var, lijn 144 )
        if (keys.up.isDown || keys.z.isDown) {
            this.body.setVelocityY(-speed)
        } else if (keys.down.isDown || keys.s.isDown) {
            this.body.setVelocityY(speed)
        }
		//dit zorgt ervoor dat de speed niet groter wordt bij een diagonale beweging 
        this.body.velocity.normalize().scale(speed)

        //animations
		//de player kijkt in een verschillende richting op basis van de controls en anims (zie lijn 88 t.e.m 117)
		//rechter pijl = player kijkt naar oven etc..
        if (keys.up.isDown || keys.z.isDown) {
            this.anims.play('player-up', true)
        } else if (keys.down.isDown || keys.s.isDown) {
            this.anims.play('player-down', true)
        } else
        if (keys.left.isDown || keys.q.isDown) {
            this.anims.play('player-left', true)
        } else if (keys.right.isDown || keys.d.isDown) {
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