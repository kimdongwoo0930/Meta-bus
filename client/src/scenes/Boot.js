
import Phaser from "phaser";

export default class Boot extends Phaser.Scene {

    preloadComplete = false
    constructor() {
        super("boot");

    }
    preload() {
        console.log("OK")
        this.load.image("tiles", "assets/tiles/Tiles.png");
        this.load.tilemapTiledJSON("map", "assets/Map/tiles.json");

        this.load.spritesheet("player", "/assets/player.png", {
            frameHeight: 32,
            frameWidth: 32,
        });
        this.load.spritesheet("otherPlayer", "/assets/player.png", {
            frameHeight: 32,
            frameWidth: 32,
        });
        this.load.on('complete',() => {
            this.preloadComplete = true
        })
    }

    create(){
        if(!this.preloadComplete) return
        this.scene.start('Game');
    }


}
