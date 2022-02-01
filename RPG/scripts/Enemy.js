class Enemy extends Entity {
    constructor(scene, x, y, textureKey) {
        super(scene, x, y, textureKey, 'Enemy')

        const anims = scene.anims
        const animFrameRate = 4
        this.textureKey = textureKey
        //Animations
        //this = sprite dat wij aangeven in anims -> scene.anims
        anims.create({
            key: 'enemy-left',
            frames: anims.generateFrameNames(this.textureKey, {
                prefix: 'skeleton-walk-left/',
                suffix: '',
                start: 1,
                end: 3,
                zeroPad: 2
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        anims.create({
            key: 'enemy-right',
            frames: anims.generateFrameNames(this.textureKey, {
                prefix: 'skeleton-walk-right/',
                suffix: '',
                start: 1,
                end: 3,
                zeroPad: 2
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        anims.create({
            key: 'enemy-down',
            frames: anims.generateFrameNames(this.textureKey, {
                prefix: 'skeleton-walk-down/',
                suffix: '',
                start: 1,
                end: 3,
                zeroPad: 2
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        anims.create({
            key: 'enemy-up',
            frames: anims.generateFrameNames(this.textureKey, {
                prefix: 'skeleton-walk-up/',
                suffix: '',
                start: 1,
                end: 3,
                zeroPad: 2
            }),
            frameRate: animFrameRate,
            repeat: -1
        })

        this.speed = 32
        //Switch met een random 0 - 3 nummer die een willekeurige richting geeft aan de vijand en de animatie die daarbij hoort
        let direction = Math.floor(Math.random() * 4)
        switch (direction) {
            case 0:
                this.body.setVelocity(0, -this.speed) //UP
                this.anims.play('enemy-up')
                break;
            case 1:
                this.body.setVelocity(-this.speed, 0) //LEFT
                this.anims.play('enemy-left')
                break;
            case 2:
                this.body.setVelocity(0, this.speed) //DOWN
                this.anims.play('enemy-down')
                break;
            case 3:
                this.body.setVelocity(this.speed, 0) //RIGHT
                this.anims.play('enemy-right')
                break;
            default:
                break;
        }
    } //End constructor
    update() {
        const {speed} = this //speed
        const enemyBlocked = this.body.blocked

        if (enemyBlocked.down || enemyBlocked.up || enemyBlocked.left || enemyBlocked.right) {
            let possibleDirections = []

            for (const direction in enemyBlocked) {
                possibleDirections.push(direction)
            }
            const newDirection = possibleDirections[Math.floor(Math.random() * 4)+1]
            switch (newDirection) {
                case 'up':
                    this.body.setVelocity(0, -this.speed) //UP
                    this.anims.play('enemy-up')
                    break;
                case 'left':
                    this.body.setVelocity(-this.speed, 0) //LEFT
                    this.anims.play('enemy-left')
                    break;
                case 'down':
                    this.body.setVelocity(0, this.speed) //DOWN
                    this.anims.play('enemy-down')
                    break;
                case 'right':
                    this.body.setVelocity(this.speed, 0) //RIGHT
                    this.anims.play('enemy-right')
                    break;
                case 'none':
                    this.body.setVelocity(0, 0) //RIGHT
                    this.anims.stop()
                    break;
                default:
                    break;
            }
        }
    } //end update
} //End class