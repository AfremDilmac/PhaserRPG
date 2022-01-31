class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texturekey, type){
        super(scene, x, y, texturekey)

        this.scene = scene
		this.texturekey = texturekey
        this.scene.add.existing(this)
        this.scene.physics.world.enableBody(this, 0)
        this.type = type
        this.isDead = false
	}
	explode(){
		if(!this.isDead){
			this.isDead = true 
			this.destroy()
			console.log('entity explode')
		}
	}
}