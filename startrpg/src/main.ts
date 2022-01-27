import Phaser from 'phaser'

import Preloader from './scenes/Preloader'
import HelloWorldScene from './scenes/HelloWorldScene'

export default new Phaser.Game( {
	type: Phaser.AUTO,
	width: 400,
	height: 250,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		}
	},
	scene: [Preloader, HelloWorldScene],
	scale: {
		zoom: 2
	}
})


