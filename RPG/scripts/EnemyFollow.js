class EnemyFollow extends Enemy {
    constructor(scene, x, y, textureKey, damage, type) {
        super(scene, x, y, textureKey, 'Enemy', type)

        this.speed = 32
        this.chasing = true
    } //end create

    //dx = destination x
    //dy = destination y 
    update(destination) {
        const {
            speed
        } = this
        if (this.chasing) {
            this.body.setVelocity(0, 0)
            const dx = Math.abs(this.body.x - destination.x)
            const dy = Math.abs(this.body.y - destination.y)
            if (dx > dy) {
                //close x gap
                if (this.body.x < destination.x) {
                    //move right
                    this.body.setVelocity(speed, 0)
                    this.anims.play('enemy-right', true)
                } else {
                    //move left
                    this.body.setVelocity(-speed, 0)
                    this.anims.play('enemy-left', true)
                }
            } else {
                //close y gap
                if (this.body.y < destination.y) {
                    //move down
                    this.body.setVelocity(0, speed)
                    this.anims.play('enemy-down', true)
                } else {
                    //move up
                    this.body.setVelocity(0, -speed)
                    this.anims.play('enemy-up', true)
                }
            }
            this.body.velocity.normalize().scale(speed)
        } //end chase

        /**
         * enemy following blocked on walls redirection
         */
         const enemyBlocked = this.body.blocked
         //Deze if-statement zorgd ervoor dat de enemy in een andere richting gaat wanneer hij botst tegen een obstakel
 
         //We nemen eerst al de kays uit de array enemyBlocked ==> none, up, down, left, right
         //Dan maken we onze eigen array aan possibleDirections
         //en we steken al deze keys erin met de push functie
         //We maken de variabele newDirection aan dat gelijk zal zijn aan een willekeurig getal tussen 1 en 4 
         //dit getal komt overeen met een van de keys behalve de key op positie 0 (none)
         //Dan gaan we met een switch de enemy van richting laten veranderen
         if (enemyBlocked.down || enemyBlocked.up || enemyBlocked.left || enemyBlocked.right) {
             this.chasing = false

             this.scene.time.addEvent({
                 delay: 2000,
                 callback: ()=>{
                     this.chasing = true
                 },
                 callbackScope: this.scene,
                 loop: false
             })

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
                     this.body.setVelocity(0, 0) //NONE
                     this.anims.stop()
                     break;
                 default:
                     break;
             }
         }
    } //end update

} // end class