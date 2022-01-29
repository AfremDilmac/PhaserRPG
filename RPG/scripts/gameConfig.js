
window.addEventListener('load', () => {
	//game configuratie, moet voor elk nieuw spel gedaan worden
let config = {
    type: Phaser.AUTO,
    width: 300,
    height: 240,
    backgroundColor: 0x999999,
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
            gravity: {
                y: 0
            }
        }
    },
    scale: {
		// centreren + hele viewpoort gebruiken + div met id: thegame als parent declareren 
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: "thegame"
    },
    pixelArt: true,
    scene: [GameScene]
}
// nieuw game object instantieëren
const game = new Phaser.Game(config)
}) //end load listener




class TitleScene extends Phaser.Scene {
    constructor() {
        super('titleScene')
    }

    preload() {

    } //end preload

    create() {

    } //end create

    update() {

    } //end update
} //end title scene

class WinScene extends Phaser.Scene {
    constructor() {
        super('winScene')
    }

    preload() {

    } //end preload

    create() {

    } //end create

    update() {

    } //end update
} //end title scene

class LoseScene extends Phaser.Scene {
    constructor() {
        super('loseScene')
    }

    preload() {

    } //end preload

    create() {

    } //end create

    update() {

    } //end update
} //end title scene