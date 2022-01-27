"use strict";

let config = {
	type: Phaser.AUTO,
	width: 1400,
	height: 768,
	physics: {
		default: `arcade`,
		arcade: {
			gravity: {y: 300},
			debug: false
		}
	},
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: 1400,
		height: 768
	},
	scene: {
		preload: preload, 
		create: create,
		update: update
	}
};

let game = new Phaser.Game(config);

function preload(){
	this.load.image('background', 'assets/Background/sky_background_mountains.png');
	this.load.image('john', 'assets/animations/rest/keyframes/rest__000.png');
}

function create(){
	this.add.image(0, 0, 'background'); 
	var a = this.add.image(200, 650, 'john');
	a.setScale(.3); 
}

function update(){
	
}