class HealthBar{
	constructor(scene, x, y, health){
		this.scene = scene
		this.currentHealth = health
		this.x = x
		this.y = y

		// twee rectangles aanmaken voor healthbar 
		this.graphics = this.scene.add.graphics()
		this.newGraphics = this.scene.add.graphics()

		const healthbarBackground = new Phaser.Geom.Rectangle(x, y, 52, 7)
		const healthbarFill = new Phaser.Geom.Rectangle(x + 1, y + 1, this.currentHealth, 5)
		
		//kleur geven 
		this.graphics.fillStyle(0xffffff, 0.5)
		this.graphics.fillRectShape(healthbarBackground)

		this.newGraphics.fillStyle(0xff0025, 1)
		this.newGraphics.fillRectShape(healthbarFill)
		// string 'Health' plaatsen naast de healthbar

	}// end constructor


	//healthbar fill veranderen als player health verliest 
	updateHealth(health){

		this.currentHealth = health

		this.newGraphics.clear()
		
		this.graphics.clear()
		
		
		const healthbarBackground = new Phaser.Geom.Rectangle(this.x, this.y, 52, 7)
		const healthbarFill = new Phaser.Geom.Rectangle(this.x + 1, this.y + 1 , this.currentHealth, 5)

		if (this.currentHealth >= 40) {
			this.newGraphics.fillStyle(0x0EE30E, 1)
		}
		if (this.currentHealth >= 30 && this.currentHealth < 40) {
			this.newGraphics.fillStyle(0xA1E50F, 1)
		}
		if (this.currentHealth >= 20 && this.currentHealth < 30) {
			this.newGraphics.fillStyle(0xEBC000, 1)
		}
		if (this.currentHealth >= 10 && this.currentHealth < 20) {
			this.newGraphics.fillStyle(0xF06C6C, 1)
		}
		if (this.currentHealth >= 0 && this.currentHealth < 10) {
			this.newGraphics.fillStyle(0xEB0000, 1)
		}
		
		this.newGraphics.fillRectShape(healthbarFill)

		this.graphics.fillStyle(0xffffff, 0.5)
		this.graphics.fillRectShape(healthbarBackground)

	}
	
}