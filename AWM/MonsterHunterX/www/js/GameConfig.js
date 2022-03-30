// document.addEventListener('deviceready', function() {
window.addEventListener('load', () => {
    var config = {
        type: Phaser.WEBGL,
        width: 800,
        height: 480,
        backgroundColor: 0x000000,
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
            parent: "game"
        },
        pixelArt: true,
        scene: [ MenuScene, GameScene, HouseScene, InnerHouseScene, ShopScene , preload],
    };
    
    var game = new Phaser.Game(config);
    
    function preload() {
        window.addEventListener('resize', resize);
        resize();
    }
    
    function create() {
       
       

    }    
    function update() {
        
    }
    function resize() {
        var canvas = game.canvas, width = window.innerWidth, height = window.innerHeight;
        var wratio = width / height, ratio = canvas.width / canvas.height;
        if (wratio < ratio) {
            canvas.style.width = width + "px";
            canvas.style.height = (width / ratio) + "px";
        } else {
            canvas.style.width = (height * ratio) + "px";
            canvas.style.height = height + "px";
        }
    }
});
// });