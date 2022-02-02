class HealthBar{
	constructor(scene, x, y, health){
		this.scene = scene
		this.currentHealth = health
		this.x = x
		this.y = y

		// twee rectangles aanmaken voor healthbar 
		this.graphics = this.scene.add.graphics()
		this.newGraphics = this.scene.add.graphics()
		const healthbarBackground = new Phaser.Geom.Rectangle(x + 32, y, 104, 12)
		const healthbarFill = new Phaser.Geom.Rectangle(x + 34, y + 2, this.currentHealth, 8)
		//kleur geven 
		this.graphics.fillStyle(0xffffff, 0.5)
		this.graphics.fillRectShape(healthbarBackground)
		this.newGraphics.fillStyle(0x3587e2, 1)
		this.newGraphics.fillRectShape(healthbarFill)
		// string 'Health' plaatsen naast de healthbar
		this.scene.add.text(x, y + 2, 'Health', {fontSize: '8px', fill: '#fff'})

	}// end constructor


	//healthbar fill veranderen als player health verliest 
	updateHealth(health){
		this.currentHealth = health

		this.newGraphics.clear()
		this.newGraphics.fillStyle(0xff0025, 1)

		const healthbarFill = new Phaser.Geom.Rectangle(this.x + 34, this.y +2, this.currentHealth, 8)
			this.newGraphics.fillRectShape(healthbarFill)
	}
}