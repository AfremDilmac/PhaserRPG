class Projectile extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y){
		super(scene, x, y, 'bullet')
		this.x = 200
		this.y = 200
	}
	//functie om bullets te schieten a.d.h van een switch-case statement
	fire(x, y, direction){
		this.body.reset(x, y)
		this.setActive(true)
		this.setVisible(true)
		this.direction = direction

		switch (direction) {
			case 'left':
				this.setVelocity(-200, 0)
				this.body.rotation = 180 //om projectiles dezelfde richting te geven als de player (player facing richt = projectile facing right etc...) 
				break;
			case 'right':
				this.setVelocity(200, 0)
				this.body.rotation = 0//om projectiles dezelfde richting te geven als de player (player facing richt = projectile facing right etc...)
				break;
			case 'up':
				this.setVelocity(0, -200)
				this.body.rotation = 270//om projectiles dezelfde richting te geven als de player (player facing richt = projectile facing right etc...)
				break;
			case 'down':
				this.setVelocity(0, 200)
				this.body.rotation = 90//om projectiles dezelfde richting te geven als de player (player facing richt = projectile facing right etc...)
				break;
				
			default:
				break;
		}
	}
	// gebruikt om projectiel inactief en invisible te zetten
	// we zouden ook de killAndHide functie kunnen gebruiken, dat eigenlijk hetzelfde doet 
	recycle(){
		this.setActive(false)
		this.setVisible(false)
	}
}// end projectiles sprite
// hier laken we een subclass aan maar deze keer extended op Group en niet op sprite 
// het zijn groepen van 10 bullets 
//
class Projectiles extends Phaser.Physics.Arcade.Group {
	constructor(scene){
		super(scene.physics.world, scene)
		this.createMultiple({
			frameQuantity: 10,
			key: 'bullet',
			active: false,
			visible: false,
			classType: Projectile
		})
	}
	fireProjectile(x, y, facing){
		let projectile = this.getFirstDead(false)
		if(projectile){
			projectile.fire(x, y, facing)
		}
	}
}