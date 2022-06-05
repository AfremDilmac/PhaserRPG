class Boss extends Entity {
    constructor(scene, x, y, textureKey, damage, health) {
        super(scene, x, y, textureKey, 'Boss')

        const anims = scene.anims
        const animFrameRate = 4
        this.textureKey = textureKey
        this.health = health
		this.damage = damage
		this.speed = 200
        //Animations
        //this = sprite dat wij aangeven in anims -> scene.anims
        anims.create({
            key: 'boss-left',
            frames: anims.generateFrameNames(this.textureKey, {
                start: 1,
                end: 2
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        anims.create({
            key: 'boss-right',
            frames: anims.generateFrameNames(this.textureKey, {
                start: 3,
                end: 4
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        anims.create({
            key: 'boss-down',
            frames: anims.generateFrameNames(this.textureKey, {
                start: 0,
                end: 1
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        anims.create({
            key: 'boss-up',
            frames: anims.generateFrameNames(this.textureKey, {
                start: 5,
                end: 6
            }),
            frameRate: animFrameRate,
            repeat: -1
        })

		this.speed = 150
        //Switch met een random 0 - 3 nummer die een willekeurige richting geeft aan de vijand + de animatie die daarbij hoort
        let direction = Math.floor(Math.random() * 4)
        switch (direction) {
            case 0:
                this.body.setVelocity(0, -this.speed) //UP
                this.anims.play('boss-up')
                break;
            case 1:
                this.body.setVelocity(-this.speed, 0) //LEFT
                this.anims.play('boss-left')
                break;
            case 2:
                this.body.setVelocity(0, this.speed) //DOWN
                this.anims.play('boss-down')
                break;
            case 3:
                this.body.setVelocity(this.speed, 0) //RIGHT
                this.anims.play('boss-right')
                break;
            default:
                break;
        }
    } //End constructor
	
    update() {
        const {speed} = this //speed
        const enemyBlocked = this.body.blocked
		//Deze if-statement zorgd ervoor dat de enemy in een andere richting gaat wanneer hij botst tegen een obstakel

		//We nemen eerst al de kays uit de array enemyBlocked ==> none, up, down, left, right
		//Dan maken we onze eigen array aan possibleDirections
		//en we steken al deze keys erin met de push functie
		//We maken de variabele newDirection aan dat gelijk zal zijn aan een willekeurig getal tussen 1 en 4 
		//dit getal komt overeen met een van de keys behalve de key op positie 0 (none)
		//Dan gaan we met een switch de enemy van richting laten veranderen
        if (enemyBlocked.down || enemyBlocked.up || enemyBlocked.left || enemyBlocked.right) {
            let possibleDirections = []

            for (const direction in enemyBlocked) {
                possibleDirections.push(direction)
            }
            const newDirection = possibleDirections[Math.floor(Math.random() * 4)+1]
            switch (newDirection) {
                case 'up':
                    this.body.setVelocity(0, -this.speed) //UP
                    this.anims.play('boss-up')
                    break;
                case 'left':
                    this.body.setVelocity(-this.speed, 0) //LEFT
                    this.anims.play('boss-left')
                    break;
                case 'down':
                    this.body.setVelocity(0, this.speed) //DOWN
                    this.anims.play('boss-down')
                    break;
                case 'right':
                    this.body.setVelocity(this.speed, 0) //RIGHT
                    this.anims.play('boss-right')
                    break;
                case 'none':
                    this.body.setVelocity(0, 0) //NONE
                    this.anims.stop()
                    break;
                default:
                    break;
            }
        }
    } //end update
} //End class